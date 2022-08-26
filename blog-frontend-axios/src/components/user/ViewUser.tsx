import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserApiService, PostApiService } from '@Services';
import { createActionSessionExpired, createActionLoading } from '@Reducers';
import { useUIContext, useSessionContext } from '@Contexts';
import { ListErrors, DeleteButton, Image, ImageResize } from '@Common';
import { IUser, IErrors, ImageSizeProps, ImageData } from '@Types';
import { checkUnauthorized, checkSessionExpired, checkTimeout, resizeImage } from '@Utils';

const ViewUser = () => {

  const { userId } = useParams<{ userId: string }>();
  const { sessionState: { isAuthenticated, user }, dispatchSession } = useSessionContext();
  const { uiState: { isLoading }, dispatchUI } = useUIContext();
  const [userDisplayed, setUserDisplayed] = useState<IUser>();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
    if (!userDisplayed) {
      const fetchData = async (): Promise<void> => {
        // alert('ViewUser useEffet called');
        dispatchUI(createActionLoading(true));
        await getDefaultUserImage()
        .then(imageData => { 
          setuserDefaultImage(imageData);
        }) 
        .catch(error => {
          throw new Error(error);
        })
        .finally(() => dispatchUI(createActionLoading(false)));
        await UserApiService.getUserById(userId!)
          .then(user => setUserDisplayed(user))
          .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors))
      }
      await fetchData();  
    }
    })().finally(() => dispatchUI(createActionLoading(false))); 
  // eslint-disable-next-line
  }, [user]);

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatchSession(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }
  const handleFetchUserError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'User reading');
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:400, maxHeight:400}

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
    dispatchUI(createActionLoading(true));
    const postscount = await PostApiService.getNumberOfPostsForUser(id);
    if (postscount) {
      toast.error(`User has posts, delete them first`);
      dispatchUI(createActionLoading(false));
    } else {
      await UserApiService.deleteUser(id)
      .then(() => handleDeleteUserSuccess())
      .catch((apiErrors: IErrors) => handleDeleteUserError(apiErrors))
      dispatchUI(createActionLoading(false));
    }
  }

  const handleDeleteUserSuccess = () => {
    toast.success(`User deleted successfully...`);
    navigate('/user'); 
  }

  const handleDeleteUserError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'User delete');
  }

    return (
      <div className="container-fluid">
          {userDisplayed  &&
          (     
            <div>         
              <div className="row">
                <div className="col-md-4">
                  {UserImage()}
                </div>
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
              <div className="row">
                <div className="col-lg-10 col-md-12">
                  <div className="form-group row-md-2 pull-right">
                    <button className="btn ml-2 btn-secondary" onClick={handleReturn} >
                      Return
                    </button>
                    {isAuthenticated && !isLoading && 
                      <Link to={`/user/edit/${userDisplayed.id}`} className="btn ml-2 btn-primary">Edit User</Link>
                    }
                    {isAuthenticated && !isLoading &&  
                      <DeleteButton message={deleteUserMessage(userDisplayed)} onClick={() => handleDeleteUser(userDisplayed.id!)} className="btn ml-2 btn-danger">Delete User</DeleteButton>
                    }
                  </div>
                </div>
              </div>
              <div className="row">
                {errorList && <ListErrors errors={errorList} />}
              </div>
          </div>  
          )           
          }
      </div>
    );
}

export default ViewUser;