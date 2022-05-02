import React from 'react';
import { Link, useRoutes } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout } from '../reducers/auth';

const Navbar = () => {
    const { state, dispatch } = useAuth();
    const { user, isLoading } = state;

    const handleLogout = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(createActionLogout());
      };

    return (
        <header>
            <div className="container-fluid position-relative no-side-padding">
                <div className="menu-nav-icon" data-nav-menu="#main-menu">
                    <i className="ion-navicon" />
                </div>

                <ul className="main-menu visible-on-click" id="main-menu">
                    <li><Link className={"nav-link"} to={"/"}> Nest React TypeScript Blog </Link></li>
                    <li>
                    <Link className={"nav-link"} to={"/"}>
                        {!isLoading && !user && (
                            <>
                                <button className="btn btn-dark" onClick={loginWithRedirect}>
                                    Sign In
                                </button>
                            </>
                        )}

                        {!isLoading && user && (
                            <>
                                <div>
                                    <label className="mr-2">{user.userName}</label>
                                    <button className="btn btn-dark" onClick={() => logout({ returnTo: window.location.origin })}>
                                        Sign Out 
                                    </button>
                                </div>
                            </>
                        )}
                    </Link>
                    </li>
                    <li><Link className={"nav-link"} to={"/"}> Home </Link></li>
                    {isAuthenticated && (
                    <li><Link className={"nav-link"} to={"/create"}> Create </Link></li>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Navbar;
