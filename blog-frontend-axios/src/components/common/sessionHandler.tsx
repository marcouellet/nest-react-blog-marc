import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import useSessionContext from '../../contexts/session.context';
import AUTHAPI from '../../services/api/AuthApiService';
import { createActionLoggingOut, createActionLogout, createActionLoadUser, createActionLoading,
        createActionSessionExpired } from '../../reducers/session.reducer';
import ConfirmRefresh from './confirmRefresh';
import { isTokenValid, isAutomaticSessionRenewalRequired, getSessionDuration } from '../../utils/session.util';
import AuthApiService from '../../services/api/AuthApiService';

const SessionHandler = () => {

  const [askRefresh, setAskRefresh] = useState(false);
  const { sessionState: { user, isAuthenticated, isLoggingOut, isSessionExpired, lastActivityTimeStamp }, dispatchSession } = useSessionContext();
  const navigate = useNavigate();

  const handleLogout = () => {
      setAskRefresh(false);
      if (isAuthenticated) {
        dispatchSession(createActionLogout());
          AUTHAPI.logout();
          toast.info(`${user!.username} is logged out`);
          navigate('/');
      }
    };

  const handleRefresh = async () => {

    dispatchSession(createActionLoading(true));
    AUTHAPI.refresh()
    .then((user) => {
        dispatchSession(createActionLoadUser(user));
        toast.info(`${user.username} session renewed!`);
        })
    .catch(_ => {
        toast.error(`Refresh session failed, logging out!`);
        handleLogout();
    })
    .finally(() => {
      dispatchSession(createActionLoading(false));
      setAskRefresh(false);
    }
    );
  };

  const handleConfirmExit = () => {
    setAskRefresh(false);
  }

  useEffect(() => {

    if (isAuthenticated) {
      if (isLoggingOut) {
        handleLogout();
      } else if (isSessionExpired) {
        if (!askRefresh) {
          setAskRefresh(true);
        }
      } else if (user && user.authtoken) {
        const token = user.authtoken!.accessToken;
        if (isTokenValid(token)) {
          if (isAutomaticSessionRenewalRequired(token)) {
            const sessionDuration = getSessionDuration(token);
            AuthApiService.extendUserSession(sessionDuration)
            .then((user) => {
              dispatchSession(createActionLoadUser(user));
              // toast.info(`${user.username} session renewed!`);
              })
            .catch(_ => {
              toast.error(`Refresh session failed, logging out!`);
              dispatchSession(createActionLoggingOut());
            })
            .finally(() => dispatchSession(createActionLoading(false)));
          }
        } else {
          if (!isSessionExpired) {
            dispatchSession(createActionSessionExpired());
          }
        }
      }
    }
  // eslint-disable-next-line
  }, [isAuthenticated, isLoggingOut, isSessionExpired, lastActivityTimeStamp]);

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