import React, { useEffect } from 'react';
import useAuth from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import AUTHAPI from '../../services/api/AuthAPI';
import { createActionLogout, createActionLoadUser } from '../../reducers/auth';
import { useConfirmationModalContext } from "../../contexts/modalConfirmationContext";
import { toast } from "react-toastify";

const SessionTimeoutHandler = () => {
    const modalContext = useConfirmationModalContext();
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const showSessionTimeoutModel = async (): Promise<boolean> => {
        return modalContext.showConfirmation(
            `${state.user!.username} session expired!`,
            (
                <div style={{border: "2px solid blue", padding: "10px"}}>
                    <p>
                        Do you want to stay logged in?
                    </p>
                </div>
            )
        );
    }

    const handleLogout = () => {
        if (state.isAuthenticated) {
            dispatch(createActionLogout());
            AUTHAPI.logout();
            toast.info(`${state.user!.username} is logged out`);
            setTimeout(() => {
                navigate('/');
              }, 1500);    
        }
      };

    const handleRefresh = () => {
        AUTHAPI.refresh(state.user!.authrefreshtoken!)
        .then((user) => {
            dispatch(createActionLoadUser(user));
            toast.info(`${user.username} session renewed!`);
            setTimeout(() => {
                navigate('/');
              }, 1500);
            })
        .catch((error) => {
            toast.error(`Refresh session failed, logging out!`);
            handleLogout();
        });
      };


    useEffect(() => {
        if (state.isAuthenticated && state.isSessionExpired) {
            showSessionTimeoutModel().then((result) => {
                if (result) {
                    // Session must be renewed
                    handleRefresh();
                } else {
                    handleLogout();
                }
            });
    
        }
    // eslint-disable-next-line
    }, [state]);

    return <></>;
}

export default SessionTimeoutHandler;