import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthAPI';
import { toast } from "react-toastify";

const Navbar = () => {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(createActionLogout());
        AUTHAPI.logout();
        toast.info(`${state.user!.username} is logged out`);
        navigate('/');
      };

      return (
        <header>
            <div className="container-fluid position-relative no-side-padding">
                <div className="menu-nav-icon" data-nav-menu="#main-menu">
                    <i className="ion-navicon" />
                </div>

                <ul className="main-menu visible-on-click" id="main-menu">
                    <li><Link className={"nav-link"} to={"/"}> Home </Link></li>
                    {!state.isLoading && state.isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/post/create"}> Create </Link></li>
                    )}
                    {!state.isLoading && !state.isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/login"}> Log In </Link></li>
                    )}
                    {!state.isLoading && !state.isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/register"}> Register </Link></li>
                    )}
                    {!state.isLoading && state.user && (
                        <li>
                            <div>
                                <button className="btn" onClick={handleLogout}>
                                    Log Out 
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Navbar;
