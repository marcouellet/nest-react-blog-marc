import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IUser } from "../../types";
import { toast } from "react-toastify";
import { UserApiService } from "../../services/api/UserApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import DeleteButton from '../common/deleteConfirmation';
import { checkUnauthorized } from '../../utils/html.response.utils';
import { PostApiService } from '../../services/api/PostApiService';
import { createActionSessionExpired } from '../../reducers/auth';
import Image from '../common/Image';

const ViewUser = () => {

  const { userId } = useParams<{ userId: string }>();
  const { state: { isLoading, isAuthenticated }, dispatch } = useAuth();
  const [user, setUser] = useState<IUser>();
  const [errors, setErrors] = React.useState<IErrors | null>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await UserApiService.getUserById(userId!)
        .then(user => setUser(user))
        .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors))
        dispatch(createActionLoading(false));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

  const handleFetchUserError = (apiErrors: IErrors) => {
    toast.error(`User reading failed, see error list`);
    setErrors(apiErrors);
  }

  const handleReturn = () => {
    navigate('/user');  
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
      navigate('/user'); 
    }
  }

  const handleDeleteUserSuccess = () => {
    toast.success(`User deleted successfully...`);
  }

  const handleDeleteUserError = (apiErrors: IErrors) => {
    if (checkUnauthorized(apiErrors)) {
      toast.error(`User delete failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/user'); 
    } else {
      toast.error(`User delete failed, see error list`);
      setErrors(apiErrors);      
    }
  }

    return (
        <section className="user-area">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div className="row">
            <div className="col-lg-1 col-md-0" />
            <div className="col-lg-10 col-md-12">
              {user && 
              (
                <div className="main-user">
                  <div className="user-top-area">
                    { user.image && 
                      <>
                        <Image imageData={user.image}/> 
                        <br/>
                      </>
                    } 
                    <div>
                      <h4 className="username">
                        <span>
                          Name:
                        </span>
                      </h4>
                      <h5>{user.username}</h5>
                      <br/>
                      <h4 className="email">
                        <span>
                          Email:
                        </span>
                      </h4>
                      <h5>{user.email}</h5>
                      <br/>
                      <h4 className="role">
                        <span>
                          Role: 
                        </span>
                        </h4>
                      <h5>{user.role}</h5>
                      </div>
                  </div>
                  <div className="col-md-3 pull-right">
                    <button className="btn btn-secondary"  onClick={ () => handleReturn() } >
                      Return
                    </button>
                    {isLoading &&
                      <span className="fa fa-circle-o-notch fa-spin" />
                    }
                    {isAuthenticated && !isLoading && 
                      <Link to={`/user/edit/${user.id}`} className="btn btn-sm btn-primary">Edit User</Link>
                    }
                    {isAuthenticated && !isLoading &&  
                      <DeleteButton message={deleteUserMessage(user)} onClick={() => handleDeleteUser(user.id!)} className="btn btn-danger">Delete User</DeleteButton>
                    }
                  </div>
                </div>   
              )           
              }
            </div>
          </div>
        </div>
      </section>
    );
}

export default ViewUser;