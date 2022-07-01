import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthApiService';
import { toast } from "react-toastify";
import { UserRole } from '../types';
import ViewUserInfo from './user/ViewUserInfo';

const Navbar = () => {
    const { state: { user, isAuthenticated, isLoading}, dispatch } = useAuth();
    const navigate = useNavigate();

     const handleLogout = () => {
        dispatch(createActionLogout());
        AUTHAPI.logout();
        toast.info(`${user!.username} is logged out`);
        setTimeout(() => {
            navigate('/');
          }, 1500);
      };

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    return (
        <header>
            <ViewUserInfo/>
            <div className="container-fluid position-relative no-side-padding">
                <div className="menu-nav-icon" data-nav-menu="#main-menu">
                    <i className="ion-navicon" />
                </div>
                  <ul className="main-menu visible-on-click" id="main-menu">
                    <li><Link className={"nav-link"} to={"/"}> Home </Link></li>
                    {!isLoading && isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/post/create"}>Create Post</Link></li>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/login"}>Log In</Link></li>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/register"}>Register</Link></li>
                    )}
                    {!isLoading && isAdministrator() && (
                        <li><Link className={"nav-link"} to={"/user"}>Admin User</Link></li>
                    )}
                    {!isLoading && (
                        <li><Link className={"nav-link"} to={"/category"}>Category</Link></li>
                    )}
                    {!isLoading && user && (
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
