import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/auth';
import { createActionLogout } from '../reducers/auth';
import AUTHAPI from '../services/api/AuthApiService';
import { toast } from "react-toastify";
import { UserRole, ImageData, ImageSizeProps, createUserForUpdate, IUpdateUser, IErrors } from '../types';
import ImageUpload from './common/ImageUpload';
import ImageResize from './common/ImageResize';
import { createActionLoading, createActionSessionExpired, createActionUpdateUser } from '../reducers/auth';
import { UserApiService } from "../services/api/UserApiService";
import { checkUnauthorized, checkForbidden } from '../utils/html.response.utils';
import ListErrors from './common/ListErrors';

const Navbar = () => {
    const { state: { user, isAuthenticated, isLoading}, dispatch } = useAuth();
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState<ImageData>();
    const [imageChanged, setImageChanged] = useState<boolean>();
    const [errorList, setErrorList] = React.useState<IErrors | null>();

    useEffect(() => {
        setImageData(user?.image);
      // eslint-disable-next-line
      }, [user]);

     const handleLogout = () => {
        dispatch(createActionLogout());
        AUTHAPI.logout();
        toast.info(`${user!.username} is logged out`);
        setTimeout(() => {
            navigate('/');
          }, 1500);
      };

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    const handleImageUpload = (image: ImageData) => {
        setImageData(undefined);
        setImageData(image);
      }
      
    const handleDeleteImage = () => {
        setImageData(undefined);
    }

    const handleCancelImage = () => {
        setImageData(user?.image);
    }

    const handleSaveImage = async () => {
        dispatch(createActionLoading(true));
        const image: ImageData | undefined = userImage;
        const userData: IUpdateUser = createUserForUpdate({...user!, image});
        await UserApiService.updateUser(user!.id!, userData)
        .then((user) => {
            dispatch(createActionUpdateUser(user));
            handleSaveImageSuccess(); 
        })
        .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
        dispatch(createActionLoading(false));
    }

    const handleSaveImageSuccess = () => {
        setImageChanged(false);
        toast.success(`User image updated successfully...`);
    }
    
    const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
        toast.error(`User update failed, session expired`);
        dispatch(createActionSessionExpired());
        navigate('/user'); 
    } else if (checkUnauthorized(apiErrors)) {
        toast.error(`Access denied`);
    } else {
        toast.error(`User update failed, see error list`);
        setErrorList(apiErrors);      
    }
    }

    const setImageData = (image: ImageData | undefined) => {
        const isImageDefined = image !== undefined;
        const isInitialImageDefined = user?.image !== undefined;
        const imageChanged = (isImageDefined !== isInitialImageDefined) ||
                              (isImageDefined && image?.base64 !== user?.image?.base64);
        let newImage: ImageData | undefined = undefined;
        if (image) {
            newImage = { ...image}
        }
        setUserImage(newImage);
        setImageChanged(imageChanged);
    }

    const imageMaxSize: ImageSizeProps = {maxWidth:600, maxHeight:400};
    const imageDisplayMaxSize: ImageSizeProps = {maxWidth:260, maxHeight:260};

      return (
        <header>
            <div className="container-fluid position-relative no-side-padding">
                <div className="menu-nav-icon" data-nav-menu="#main-menu">
                    <i className="ion-navicon" />
                </div>
                { user && (
                    <div>
                        <div>
                            <h5>User:&nbsp;{user.username}&nbsp;{isAdministrator() && '(admin)'}</h5>
                        </div>
                        <div className="form-group col-md-4">
                            {errorList && <ListErrors errors={errorList} />}
                            <div className="row">
                                <label className="col-md-2"> Image: </label>
                                { userImage && 
                                    <button className="btn btn-secondary col-md-2"  onClick={ () => handleDeleteImage() } >
                                        Delete
                                    </button> 
                                }
                                { imageChanged && 
                                        <div className="form-group col-md-5">
                                            <button className="btn btn-secondary col-md-4"  onClick={ () => handleSaveImage() } >
                                                Update
                                            </button> 
                                            <button className="btn btn-secondary col-md-4"  onClick={ () => handleCancelImage() } >
                                                Cancel
                                            </button>  
                                        </div> 
                                                                                              
                                }  
                                <ImageUpload onImageUpload={handleImageUpload} resize={imageMaxSize}/>                
                            </div>
                        </div>
                        { userImage && 
                            <>
                                <ImageResize imageData={userImage} resize={imageDisplayMaxSize}/>
                                <br/>
                            </>
          }
          <br/>

                    </div>                
                )}
                <ul className="main-menu visible-on-click" id="main-menu">
                    <li><Link className={"nav-link"} to={"/"}> Home </Link></li>
                    {!isLoading && isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/post/create"}> Create Post</Link></li>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/login"}> Log In </Link></li>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <li><Link className={"nav-link"} to={"/register"}> Register </Link></li>
                    )}
                    {!isLoading && isAdministrator() && (
                        <li><Link className={"nav-link"} to={"/user"}> Admin User</Link></li>
                    )}
                    {!isLoading && isAdministrator() && (
                        <li><Link className={"nav-link"} to={"/category"}> Admin Category</Link></li>
                    )}
                    {!isLoading && user && (
                        <li>
                            <div>
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
