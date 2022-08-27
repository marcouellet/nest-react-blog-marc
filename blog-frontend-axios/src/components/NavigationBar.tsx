import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { useUIContext, useSessionContext } from '@Contexts';
import { createActionLogout, createActionLoading } from '@Reducers';
import { AuthApiService } from '@Services';
import { UserRole } from '@blog-common/enum';

const NavigationBar = () => {
    const { sessionState: { user, isAuthenticated }, dispatchSession } = useSessionContext();
    const { uiState: { isLoading }, dispatchUI } = useUIContext();
    const navigate = useNavigate();

     const handleLogout = () => {
        dispatchUI(createActionLoading(true));
        dispatchSession(createActionLogout());
        AuthApiService.logout();
        toast.info(`${user!.username} is logged out`);
        dispatchUI(createActionLoading(false));
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
