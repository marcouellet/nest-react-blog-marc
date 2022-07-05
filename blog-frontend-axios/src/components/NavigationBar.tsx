import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout, createActionLoading } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthApiService';
// import { toast } from "react-toastify";
import { UserRole } from '../types';

const NavigationBar = () => {
    const { state: { user, isAuthenticated, isLoading}, dispatch } = useAuth();
    const navigate = useNavigate();

     const handleLogout = () => {
        dispatch(createActionLoading(true));
        dispatch(createActionLogout());
        AUTHAPI.logout();
        // toast.info(`${user!.username} is logged out`);
        setTimeout(() => {
            dispatch(createActionLoading(false));
            navigate('/');
          }, 1500);
      };

      const handleUserProfile = () => {
        navigate('/user/profile');
      }

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    const authButton = () => {
        if (isAuthenticated) {
            return (
                <ButtonGroup>
                    <Button variant="secondary" onClick={handleLogout} disabled={isLoading}>Logout</Button>
                    <Button variant="secondary" onClick={handleUserProfile}  disabled={isLoading}>Profile</Button>
                </ButtonGroup>
            )
        } else {
            return (
                <ButtonGroup>
                    <Button variant="secondary" as={Link} to="/login" disabled={isLoading}>Login</Button>
                    <Button variant="secondary" as={Link} to="/register" disabled={isLoading}>Register</Button>
                </ButtonGroup>
            )              
        } 
    }

    return (
    <>
        <Navbar expand="lg" bg="dark" variant="dark">
            <div className="container-fluid">
                <Navbar.Brand href="/">Marc's Blog</Navbar.Brand>
                <div>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/post" disabled={isLoading}>Posts</Nav.Link>
                    <Nav.Link href="/category" disabled={isLoading}>Categories</Nav.Link>
                    {isAdministrator() && <Nav.Link href="/user" disabled={isLoading}>Users</Nav.Link>}
                </Nav>

                </div>
            </div>
            <Form inline className="mx-3">
                {authButton()}
            </Form>
        </Navbar>
        <br/>
    </>
    );
}

export default NavigationBar;
