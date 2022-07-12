import React, { useEffect, useState } from 'react';
import useAuth from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import AUTHAPI from '../../services/api/AuthApiService';
import { createActionLogout, createActionLoadUser, createActionLoading } from '../../reducers/auth';
import ConfirmRefresh from '../common/confirmRefresh';
import { toast } from "react-toastify";

const SessionTimeoutHandler = () => {

    const [askRefresh, setAskRefresh] = useState(false);
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAskRefresh(false);
        if (state.isAuthenticated) {
            dispatch(createActionLogout());
            AUTHAPI.logout();
            // toast.info(`${state.user!.username} is logged out`);
            navigate('/');
        }
      };

      const handleRefresh = async () => {
        setAskRefresh(false);
        dispatch(createActionLoading(true));
        AUTHAPI.refresh(state.user!)
        .then((user) => {
            dispatch(createActionLoadUser(user));
            toast.info(`${user.username} session renewed!`);
            navigate('/');
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
        if (state.isAuthenticated && state.isSessionExpired) {
            setAskRefresh(true);
        }
    // eslint-disable-next-line
    }, [state]);

    return <ConfirmRefresh show={askRefresh} logout={handleLogout} refresh={handleRefresh}
                            onExit={handleConfirmExit}></ConfirmRefresh>;
}

export default SessionTimeoutHandler;