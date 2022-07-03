import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from "react-toastify";
import { UserApiService } from "../../services/api/UserApiService";
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import CancelButton from '../common/cancelConfirmation';
import { checkUnauthorized, checkForbidden } from '../../utils/html.response.utils';
import { createActionLoading, createActionUpdateUser, createActionSessionExpired } from '../../reducers/auth';
import Image from '../common/Image';
import ImageUpload from '../common/ImageUpload';
import { IErrors, User, IUpdateUser, createUserForUpdate, minimumPasswordLength, minimumEmailLength, 
    minimumUserNameLength, ImageData, ImageSizeProps } from "../../types";

const UserProfile = () => {

    const { state: { isLoading, user }, dispatch } = useAuth();
    const [errorList, setErrorList] = React.useState<IErrors | null>();
    const [userEdited, setUserEdited] = useState<User>();
    const [userImage, setUserImage] = useState<ImageData>();

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('User name is required')
        .min(minimumUserNameLength, `User name must be at least ${minimumUserNameLength} characters long`),
        email: Yup.string().required('Email is required')
        .min(minimumEmailLength, `Email must be at least ${minimumEmailLength} characters long`),
        currentPassword: Yup.lazy(value => {
            if (
            value &&
            Object.values(value).some(v => !(v === null || v === undefined || v === ""))
            ) {
            // Return our normal validation
            return Yup.string().required()
                .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`);
            }
            // Otherwise, return a simple validation
            return Yup.mixed().notRequired();
        }),
        newPassword: Yup.lazy(value => {
        if (
            value &&
            Object.values(value).some(v => !(v === null || v === undefined || v === ""))
        ) {
            // Return our normal validation
            return Yup.string().required()
            .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`);
            }
        // Otherwise, return a simple validation
        return Yup.mixed().notRequired();
        }),
        imageChanged: Yup.bool(),
    });

    type UpdateSubmitForm = {
        username: string;
        email: string;
        password?: string;
        imageChanged: boolean;
        currentPassword?: string;
        newPassword?: string;
    };

    const defaultValues = {username: userEdited?.username, email: userEdited?.email, currentPassword: undefined, 
                            newPassword: undefined, imageChanged: false};

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isDirty }
      } = useForm<UpdateSubmitForm>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues
      });

    useEffect(() => {
        if (user) {
            if (!userEdited) {
                const fetchData = async (): Promise<void> => {
                dispatch(createActionLoading(true));
                await UserApiService.getUserById(user!.id!)
                .then((userRead) => { setUserEdited(userRead); reset(userRead); setUserImage(userRead?.image);})
                .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors));
                dispatch(createActionLoading(false));
                }
                fetchData();      
            }
        } else {
            navigate('/');
        }
    // eslint-disable-next-line
    }, []);

    const handleFetchUserError = (apiErrors: IErrors) => {
        toast.error(`User reading failed, see error list`);
        setErrorList(apiErrors);
    }

    const onSubmit = async (data: UpdateSubmitForm) => {
        if (userEdited && isDirty) {
        dispatch(createActionLoading(true));
        const image: ImageData | undefined = userImage;
        const userData: IUpdateUser = createUserForUpdate({...userEdited, ...data, image});
        await UserApiService.updateUser(userEdited.id!, userData)
        .then((userUpdated) => { setUserEdited(userUpdated);  handleSubmitFormSuccess(userUpdated); })
        .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
        dispatch(createActionLoading(false));
        }
    } 

    const handleSubmitFormSuccess = (userUpdated: User) => {
        if (user?.email === userUpdated?.email) {
        // Update state user to refresh user info in NavBar
            dispatch(createActionUpdateUser(userUpdated!));
        }
        toast.success(`User updated successfully...`);
        navigate('/'); 
    }

    const handleSubmitFormError = (apiErrors: IErrors) => {
        if (checkForbidden(apiErrors)) {
        toast.error(`User update failed, session expired`);
        dispatch(createActionSessionExpired());
        navigate('/'); 
        } else if (checkUnauthorized(apiErrors)) {
        toast.error(`Access denied`);
        } else {
        toast.error(`User update failed, see error list`);
        setErrorList(apiErrors);      
        }
    }

    const cancelEditUserMessage = () => `user edition and loose changes`;

    const handleResetEditUser = () => {
        reset(defaultValues, { keepDirty: false});
    }

    const handleCancelEditUser = () => {
        navigate('/');   
    };

    const handleImageUpload = (image: ImageData) => {
        setImageData(image);
    }

    const handleImageUploadError = (error: any) => {
      toast.error(`User image upload failed`);
    }

    const handleDeleteImage = () => {
        setImageData(undefined);
    }

    const setImageData = (image: ImageData | undefined) => {
        const isImageDefined = image !== undefined;
        const isInitialImageDefined = userEdited?.image !== undefined;
        const imageChanged = (isImageDefined !== isInitialImageDefined) ||
                              (isImageDefined && image?.base64 !== user?.image?.base64);
        setValue('imageChanged', imageChanged, {shouldDirty: true});
        setUserImage(image);
    }

    const imageMaxSize: ImageSizeProps = {maxWidth:600, maxHeight:400}

    return (
        
        <div className={'page-wrapper'}>
        {userEdited &&
          (
            <div className={"col-md-12 form-wrapper"}>
              <h2> Edit User Profile </h2>
              {errorList && <ListErrors errors={errorList} />}
              <form id={"create-user-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                <div className="form-group col-md-4">
                    <div className="row">
                      <label className="col-md-2"> Image: </label>
                      { userImage && (
                            <button className="btn btn-secondary col-md-3"  onClick={() => handleDeleteImage()} >
                                Delete Image
                            </button>  
                        )
                      }   
                      <ImageUpload onImageUpload={handleImageUpload} onImageUploadError={handleImageUploadError} resize={imageMaxSize}/>                     
                    </div>
                  </div>
    
                  <div className="form-group col-md-12">
                    { userImage && (
                      <>
                        <Image imageData={userImage}/> 
                        <br/>
                      </>
                    )
                    }    
                </div>
    
                <div className="form-group col-md-12">
                  <label htmlFor="username"> Title </label>
                  <input 
                    type="text"
                    placeholder="Enter user name"
                    {...register('username')}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
                  />
                  <div className="invalid-feedback">{errors.username?.message}</div>
               </div>
    
                <div className="form-group col-md-12">
                  <label htmlFor="email"> Email </label>
                  <input 
                    type="text" 
                    placeholder="Enter email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
    
                <div className="form-group col-md-12">
                  <label htmlFor="password"> Enter Current Password </label>
                  <input 
                    type="password" 
                    placeholder="Enter a value to change current password" 
                    {...register('currentPassword')}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}           
                  />
                  <div className="invalid-feedback">{errors.currentPassword?.message}</div>
                </div>

                <div className="form-group col-md-12">
                  <label htmlFor="password"> Enter New Password </label>
                  <input 
                    type="password" 
                    placeholder="Enter a value to change current password" 
                    {...register('newPassword')}
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}           
                  />
                  <div className="invalid-feedback">{errors.newPassword?.message}</div>
                </div>

        
                <div className="form-group col-md-4 pull-right">
                  <button className="btn btn-success"  disabled={!isDirty} type="submit">
                    Update
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                </div>
    
                <div className="form-group col-md-1 pull-right">
                  <button className="btn btn-secondary" disabled={!isDirty} onClick={() => handleResetEditUser()} >
                    Reset
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                </div>
              </form>
    
              <div className="form-group col-md-1 pull-right">
                  {
                  <CancelButton prompt={isDirty} message={cancelEditUserMessage()} onClick={() => handleCancelEditUser()} className="btn btn-danger">Cancel</CancelButton>
                  }
               </div>
    
            </div>
          )
        }
      </div>
      )
}

export default UserProfile;