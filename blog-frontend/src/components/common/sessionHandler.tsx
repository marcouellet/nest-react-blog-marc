import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { useUIContext, useSessionContext } from 'contexts';
import { AuthApiService } from 'services/api';
import { createActionLoggingOut, createActionLogout, createActionLoggedIn, createActionSessionExpired,
        createActionLoading } from 'reducers';
import { isTokenValid, isAutomaticSessionRenewalRequired, getSessionDuration } from 'utils';

import { ConfirmRefresh } from './confirmRefresh';

export const SessionHandler = () => {

  const [askRefresh, setAskRefresh] = useState(false);
  const { sessionState: { user, isAuthenticated, isLoggingOut, isSessionExpired  }, dispatchSession } = useSessionContext();
  const { uiState: { lastActivityTimeStamp }, dispatchUI } = useUIContext();
  const navigate = useNavigate();

  const handleLogout = () => {
      setAskRefresh(false);
      if (isAuthenticated) {
        dispatchSession(createActionLogout());
          AuthApiService.logout();
          toast.info(`${user!.username} is logged out`);
          navigate('/');
      }
    };

  const handleRefresh = async () => {

    dispatchUI(createActionLoading(true));
    AuthApiService.refresh()
    .then((user) => {
        dispatchSession(createActionLoggedIn(user));
        toast.info(`${user.username} session renewed!`);
        })
    .catch(_ => {
        toast.error(`Refresh session failed, logging out!`);
        handleLogout();
    })
    .finally(() => {
      dispatchUI(createActionLoading(false));
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
              dispatchSession(createActionLoggedIn(user));
              // toast.info(`${user.username} session renewed!`);
              })
            .catch(_ => {
              toast.error(`Refresh session failed, logging out!`);
              dispatchSession(createActionLoggingOut());
            })
            .finally(() => dispatchUI(createActionLoading(false)));
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
