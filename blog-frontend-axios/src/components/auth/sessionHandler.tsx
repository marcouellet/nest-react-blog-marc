import React, { useEffect, useState } from 'react';
import useAuth from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import AUTHAPI from '../../services/api/AuthApiService';
import { createActionLoggingOut, createActionLogout, createActionLoadUser, createActionLoading,
        createActionSessionExpired } from '../../reducers/auth';
import ConfirmRefresh from '../common/confirmRefresh';
import { isTokenValid, isAutomaticSessionRenewalRequired, getSessionDuration } from '../../utils/session.util';
import AuthApiService from '../../services/api/AuthApiService';
import TokenService from '../../services/api/TokenService';
import { toast } from "react-toastify";

const SessionHandler = () => {

  const [askRefresh, setAskRefresh] = useState(false);
  const { state: { user, isAuthenticated, isLoggingOut, isSessionExpired}, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      setAskRefresh(false);
      if (isAuthenticated) {
          dispatch(createActionLogout());
          AUTHAPI.logout();
          toast.info(`${user!.username} is logged out`);
          navigate('/');
      }
    };

  const handleRefresh = async () => {
    setAskRefresh(false);
    dispatch(createActionLoading(true));
    AUTHAPI.refresh()
    .then((user) => {
        dispatch(createActionLoadUser(user));
        toast.info(`${user.username} session renewed!`);
        })
    .catch(_ => {
        toast.error(`Refresh session failed, logging out!`);
        handleLogout();
    })
    .finally(() => dispatch(createActionLoading(false)));
  };

  const handleConfirmExit = () => {
    setAskRefresh(false);
  }

  useEffect(() => {
    // The following 3 lines are a fix to reverse the fact that state is reinitialized while navigating 
    const user = TokenService.getUser();
    if (!user) return;
    dispatch(createActionLoadUser(user));

    if (isAuthenticated) {
      if (isLoggingOut) {
        handleLogout();
      } else if (isSessionExpired) {
        setAskRefresh(true);
      } else if (user && user.authtoken) {
        const token = user.authtoken!.accessToken;
        if (isTokenValid(token)) {
          if (isAutomaticSessionRenewalRequired(token)) {
            const sessionDuration = getSessionDuration(token);
            AuthApiService.extendUserSession(sessionDuration)
            .then((user) => {
              dispatch(createActionLoadUser(user));
              // toast.info(`${user.username} session renewed!`);
              })
            .catch(_ => {
              toast.error(`Refresh session failed, logging out!`);
              dispatch(createActionLoggingOut());
            })
            .finally(() => dispatch(createActionLoading(false)));
          }
        } else {
          dispatch(createActionSessionExpired());
        }
  
      }
    }
  // eslint-disable-next-line
  }, [isAuthenticated, isLoggingOut, isSessionExpired]);

  return (
    <ConfirmRefresh 
      show={askRefresh} 
      logout={handleLogout} 
      refresh={handleRefresh}
      onExit={handleConfirmExit}
    />
  )
}

export default SessionHandler;