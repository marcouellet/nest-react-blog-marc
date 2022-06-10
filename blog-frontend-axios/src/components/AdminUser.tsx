import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { UserApiService } from "../services/api/UserApiService";
import { IUser } from "../types";
import useAuth from '../contexts/auth';
import { createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { IErrors } from '../types';
import DeleteButton from './common/deleteConfirmation'
import { checkForbidden } from '../utils/response';
import { createActionSessionExpired } from '../reducers/auth';
import { toLocalDateString } from '../utils/utils';
import { PostApiService } from '../services/api/PostApiService';

const AdminUser = () => {
  
  const navigate = useNavigate();

  const { state, dispatch } = useAuth();

  const [errors, setErrors] = React.useState<IErrors | null>();

  const [users, setUsers] = useState<IUser[]>([]);

  const _removeUserFromView = (id: string) => {
    const index = users.findIndex((user: IUser) => user.id! === id);
    users.splice(index, 1);
  }

  const deleteUserMessage = (user: IUser) => `${user.username} User`;

  const handleDeleteUser = async (id: string) => {
    dispatch(createActionLoading(true));
    const postscount = await PostApiService.getNumberOfPostsForUser(id);
    if (postscount) {
      toast.error(`User has posts, delete them first`);
      dispatch(createActionLoading(false));
    } else {
      await UserApiService.deleteUser(id)
      .then(() => handleDeleteUserSuccess())
      .catch((apiErrors: IErrors) => handleDeleteUserError(apiErrors))
      dispatch(createActionLoading(false));
      _removeUserFromView(id);
      navigate('/user'); 
    }
  }

  const handleDeleteUserSuccess = () => {
    toast.success(`User deleted successfully...`);
  }

  const handleDeleteUserError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`User delete failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/user'); 
    } else {
      toast.error(`User delete failed, see error list`);
      setErrors(apiErrors);      
    }
  }

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      UserApiService.getAllUsers()
        .then(users => setUsers(users));
    }
    fetchUsers();
  }, [])

    return (
        <section className="blog-area section">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div>
            {
              state.isAuthenticated && !state.isLoading && 
              (
                  <Link to={`/user/create`} className="btn btn-sm btn-primary">Create User</Link>
              )
            }
          </div>
          <br/>
          <div className="row">
            {users && users.map((user: IUser) => (
              <div className="col-lg-4 col-md-6" key={user.id}>
              <div className="card h-100">
                <div className="single-user user-style-1">

                  <div className="blog-info">

                    <h4 className="username">
                      <span>
                        <b>{user.username}</b>
                      </span>
                    </h4>
                    { user.createdOn &&
                      <h5 className="createdOn">
                        <span>
                          <b>Created on {toLocalDateString(user.createdOn)}</b>
                        </span>
                      </h5>
                    }
                 </div>
                </div>

                <ul className="user-footer">
                  {
                    !state.isLoading &&
                    (
                      <li>
                      {
                        <p>
                          <Link to={`/user/${user.id}`} className="btn btn-sm btn-info">View User </Link>
                        </p>
                      }
                      </li>
                    )
                  }
                  {
                    state.isAuthenticated && !state.isLoading && 
                    (
                      <li>
                      {
                        <p>
                          <Link to={`/user/edit/${user.id}`} className="btn btn-sm btn-primary">Edit User</Link>
                        </p>

                      }
                      </li>
                    )
                  }
                  {
                    state.isAuthenticated && !state.isLoading &&  
                    (                   
                      <li>
                      {
                        <DeleteButton message={deleteUserMessage(user)} onClick={() => handleDeleteUser(user.id!)} className="btn btn-danger">Delete User</DeleteButton>
                      }
                      </li>
                    )
                  }
                </ul>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default AdminUser;
