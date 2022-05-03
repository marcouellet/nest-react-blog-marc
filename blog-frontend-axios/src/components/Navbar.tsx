import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthAPI';

const Navbar = () => {
    const { state, dispatch } = useAuth();
    const { user, isLoading, isAuthenticated } = state;
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(createActionLogout());
        AUTHAPI.logout();
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
                    {!isLoading && isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/create"}> Create </Link></li>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/login"}> Log In </Link></li>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/register"}> Register </Link></li>
                    )}
                    {!isLoading && user && (
                        <li>
                            <div>
                                <label className="mr-2">{user.userName}</label>
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
