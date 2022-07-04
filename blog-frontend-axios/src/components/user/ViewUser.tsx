import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IUser } from "../../types";
import { toast } from "react-toastify";
import { UserApiService } from "../../services/api/UserApiService";
import { createActionLoading, createActionSessionExpired } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, ImageSizeProps, ImageData } from '../../types';
import DeleteButton from '../common/deleteConfirmation';
import { checkUnauthorized } from '../../utils/html.response.utils';
import { PostApiService } from '../../services/api/PostApiService';
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';

const ViewUser = () => {

  const { userId } = useParams<{ userId: string }>();
  const { state: { isLoading, isAuthenticated, user }, dispatch } = useAuth();
  const [userDisplayed, setUserDisplayed] = useState<IUser>();
  const [errors, setErrors] = React.useState<IErrors | null>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userDisplayed) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await getDefaultUserImage()
        .then(imageData => { 
          setuserDefaultImage(imageData);
        }) 
        .catch(error => {
          throw new Error(error);
        });
        await UserApiService.getUserById(userId!)
          .then(user => setUserDisplayed(user))
          .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors));
        dispatch(createActionLoading(false));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, [user]);

  const handleFetchUserError = (apiErrors: IErrors) => {
    toast.error(`User reading failed, see error list`);
    setErrors(apiErrors);
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:200, maxHeight:200}

  const UserImage = () => {
    if(userDisplayed?.image) {
      return <ImageResize imageData={userDisplayed.image} resize={imageMaxSize}/>;
    }  else {
      return  userDefaultImage && <Image imageData={userDefaultImage}/> 
    }
  }

  const getDefaultUserImage = (): Promise<ImageData> => {
    return resizeImage('/default-profil-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
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
    }
  }

  const handleDeleteUserSuccess = () => {
    toast.success(`User deleted successfully...`);
    navigate('/user'); 
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
              {userDisplayed  &&
              (
                <div className="main-user">
                  <div className="user-top-area">
                    {UserImage()}
                    <div>
                      <h4 className="username">
                        <span>
                          Name:
                        </span>
                      </h4>
                      <h5>{userDisplayed.username}</h5>
                      <br/>
                      <h4 className="email">
                        <span>
                          Email:
                        </span>
                      </h4>
                      <h5>{userDisplayed.email}</h5>
                      <br/>
                      <h4 className="role">
                        <span>
                          Role: 
                        </span>
                        </h4>
                      <h5>{userDisplayed.role}</h5>
                      </div>
                  </div>
                  <div className="form-group row-md-2 pull-right">
                    <button className="btn ml-2 btn-secondary" onClick={ () => handleReturn() } >
                      Return
                    </button>
                    {isLoading &&
                      <span className="fa fa-circle-o-notch fa-spin" />
                    }
                    {isAuthenticated && !isLoading && 
                      <Link to={`/user/edit/${userDisplayed.id}`} className="btn ml-2 btn-primary">Edit User</Link>
                    }
                    {isAuthenticated && !isLoading &&  
                      <DeleteButton message={deleteUserMessage(userDisplayed)} onClick={() => handleDeleteUser(userDisplayed.id!)} className="btn ml-2 btn-danger">Delete User</DeleteButton>
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