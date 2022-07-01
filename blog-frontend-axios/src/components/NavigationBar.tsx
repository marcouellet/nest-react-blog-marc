import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthApiService';
import { toast } from "react-toastify";
import { UserRole } from '../types';

const NavigationBar = () => {
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

    const authButton = () => {
        if (isAuthenticated) {
            return <Button variant="secondary" onClick={handleLogout}>Logout</Button>;
        } else {
            return (
                <ButtonGroup>
                    <Button variant="secondary" as={Link} to="/login">Login</Button>
                    <Button variant="secondary" as={Link} to="/register">Register</Button>
                </ButtonGroup>
            )              
        } 
    }

    return (
    <>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Blog Marc</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    {!isLoading && isAuthenticated && <Nav.Link href="/post/create">Create Post</Nav.Link>}
                    {!isLoading && <Nav.Link href="/category">Categories</Nav.Link>}
                    {!isLoading && isAdministrator() && <Nav.Link href="/user">Admin User</Nav.Link>}
                </Nav>
            </Container>
            <Form inline className="mx-3">
                {authButton()}
            </Form>
        </Navbar>
        <br/>
    </>
    );
}

export default NavigationBar;
