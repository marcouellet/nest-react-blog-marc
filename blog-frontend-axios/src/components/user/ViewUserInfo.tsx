import 'bootstrap/dist/css/bootstrap.min.css';  
import React, { useState, useEffect } from 'react';
import {Container ,Card } from 'react-bootstrap';
import ImageResize from '../common/ImageResize';
import ImageUpload from '../common/ImageUpload';
import useAuth from '../../contexts/auth';
import { toast } from "react-toastify";
import { UserRole, ImageData, ImageSizeProps, createUserForUpdate, IUpdateUser, IErrors } from '../../types';
import { createActionLoading, createActionSessionExpired, createActionUpdateUser } from '../../reducers/auth';
import { UserApiService } from "../../services/api/UserApiService";
import { checkUnauthorized, checkForbidden } from '../../utils/html.response.utils';

const ViewUserInfo = () => {

    const { state: { user, isAuthenticated }, dispatch } = useAuth();
    const [userImage, setUserImage] = useState<ImageData>();
    const [imageChanged, setImageChanged] = useState<boolean>();

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    useEffect(() => {
        setImageData(user?.image);
      // eslint-disable-next-line
      }, [user]);

    const handleImageUpload = (image: ImageData) => {
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
        .catch((apiErrors: IErrors) =>  { handleSaveImageError(apiErrors); });
        dispatch(createActionLoading(false));
    }

    const handleSaveImageSuccess = () => {
        setImageChanged(false);
        toast.success(`User image updated successfully...`);
    }
    
    const handleSaveImageError = (apiErrors: IErrors) => {
        if (checkForbidden(apiErrors)) {
            toast.error(`User image update failed, session expired`);
            dispatch(createActionSessionExpired());
        } else if (checkUnauthorized(apiErrors)) {
            toast.error(`Access denied`);
        } else {
            toast.error(`User image update failed, see error list`);   
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

    const imageMaxSize: ImageSizeProps = {maxWidth:260, maxHeight:260};

    return (  
        <>
        {  
            user && 
            <div className="ViewUserInfo">  
            <div className="float-start">
            <Container className='p-4'>  
                <Card>  
                    <Card.Body className="image-container">
                        <Card.Header>
                            <h5>{user?.username}&nbsp;{isAdministrator() && '(admin)'}</h5>
                        </Card.Header> 
                        { userImage && <ImageResize imageData={userImage} resize={imageMaxSize}/> }
                        <Card.Subtitle>
                            <br/>
                            <span>Email:&nbsp;</span> 
                            <span>{user.email}</span> 
                        </Card.Subtitle> 
                        <Card.Footer>
                            <Card.Text>
                                <label className="col-md-1"> Image: </label>
                            </Card.Text>
                            <Card.Text>
                                { userImage && 
                                    <button className="btn btn-secondary col-md-1"  onClick={ () => handleDeleteImage() } >
                                        Delete
                                    </button> 
                                }
                            </Card.Text>
                            <Card.Text>
                                { imageChanged && 
                                    <div className="form-group col-md-4">
                                        <button className="btn btn-secondary col-md-4"  onClick={ () => handleSaveImage() } >
                                            Update
                                        </button> 
                                        <button className="btn btn-secondary col-md-3"  onClick={ () => handleCancelImage() } >
                                            Cancel
                                        </button>  
                                    </div>                                                                               
                                }  
                                <ImageUpload onImageUpload={handleImageUpload} resize={imageMaxSize}/>                
                            </Card.Text>
                        </Card.Footer>     
                    </Card.Body>  
                    </Card>  
                </Container>  
            </div>
            </div>  
        }
        </>
    );
};

export default ViewUserInfo;