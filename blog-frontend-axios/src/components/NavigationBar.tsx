import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout, createActionLoading } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthApiService';
import { toast } from "react-toastify";
import { UserRole } from '../types';

const NavigationBar = () => {
    const { state: { user, isAuthenticated, isLoading}, dispatch } = useAuth();
    const navigate = useNavigate();

     const handleLogout = () => {
        dispatch(createActionLoading(true));
        dispatch(createActionLogout());
        AUTHAPI.logout();
        toast.info(`${user!.username} is logged out`);
        dispatch(createActionLoading(false));
        navigate('/');
      };

      const handleUserProfile = () => {
        navigate('/user/profile');
      }

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    const userDisplay = () => {
        let userInfo: string = '';
        if (isAuthenticated) {
            userInfo = user!.email;
        }
        if (isAdministrator()) {
            userInfo += ' (administrator)';
        }
        return userInfo;
    }

    const authButton = () => {
        if (isAuthenticated) {
            return (
                <ButtonGroup>
                    <Button variant="secondary" onClick={handleLogout} disabled={isLoading}>Logout</Button>
                    &nbsp;&nbsp;
                    <Button variant="secondary" onClick={handleUserProfile}  disabled={isLoading}>Profile</Button>
                </ButtonGroup>
            )
        } else {
            return (
                <ButtonGroup>
                    <Button variant="secondary" as={Link} to="/login" disabled={isLoading}>Login</Button>
                    &nbsp;&nbsp;
                    <Button variant="secondary" as={Link} to="/register" disabled={isLoading}>Register</Button>
                </ButtonGroup>
            )              
        } 
    }

    return (
    <>
        <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
            <div className="container-fluid">
                <Navbar.Brand href="/">Marc's Blog</Navbar.Brand>
                <Navbar.Text>{userDisplay()}</Navbar.Text>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/blog">Blogs</Nav.Link>
                    {isAuthenticated && (
                        <NavDropdown id="nav-dropdown-manage" title="Manage">
                         {!isAdministrator() && (
                            <div>
                                <NavDropdown.Item as={Link} to="/post/user">Posts</NavDropdown.Item>                               
                            </div>
                        )
                        }                        
                        {isAdministrator() && (
                            <div>
                                <NavDropdown.Item as={Link} to="/post">Posts</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/category">Categories</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/user">Users</NavDropdown.Item>
                            </div>
                        )
                        }
                        </NavDropdown>
                    )
                    }
                </Nav>
            </div>
            <Form inline>
                {authButton()}
            </Form>
        </Navbar>
        <br/>
        <br/>
        <br/>
    </>
    );
}

export default NavigationBar;
