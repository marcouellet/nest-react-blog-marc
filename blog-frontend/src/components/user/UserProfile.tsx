import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from "react-toastify";

import { AuthApiService } from 'services/api';
import { useUIContext, useSessionContext } from 'contexts';
import { ListErrors, CancelButton, Image, ImageUpload, ImageResize } from 'components/common';
import { checkUnauthorized, checkSessionExpired, checkTimeout, checkForbidden, resizeImage } from 'utils';
import { createActionUpdateUser, createActionSessionExpired, createActionLoading } from 'reducers';
import { IErrors, ImageSizeProps } from 'types';
import { minimumUserPasswordLength, minimumUserEmailLength, minimumUserNameLength } from "shared/entities";
import { UserDto, UpdateUserDto } from "shared/dtos";
import { ImageData } from "shared/interfaces";
import { createUserForUpdate } from "shared/builders";

const UserProfile = () => {

  const { sessionState: { user }, dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [errorList, setErrorList] = useState<IErrors | null>();
  const [userEdited, setUserEdited] = useState<UserDto>();
  const [userImage, setUserImage] = useState<ImageData>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
      username: Yup.string().required('User name is required')
      .min(minimumUserNameLength, `User name must be at least ${minimumUserNameLength} characters long`),
      email: Yup.string().required('Email is required')
      .min(minimumUserEmailLength, `Email must be at least ${minimumUserEmailLength} characters long`),
      password: Yup.lazy(value => {
          if (
          value &&
          Object.values(value).some(v => !(v === null || v === undefined || v === ""))
          ) {
          // Return our normal validation
          return Yup.string().required('Password is required')
              .min(minimumUserPasswordLength, `Password must be at least ${minimumUserPasswordLength} characters long`);
          }
          // Otherwise, return a simple validation
          return Yup.mixed().notRequired();
      }),
      confirmPassword: Yup.lazy(value => {
      if (
          value &&
          Object.values(value).some(v => !(v === null || v === undefined || v === ""))
      ) {
          // Return our normal validation
          return Yup.string().required('Confirm password is required')
          .min(minimumUserPasswordLength, `Password must be at least ${minimumUserPasswordLength} characters long`)
          .when('password', {is: (password: string) => password, then: (schema) => schema.required()})
          .oneOf([Yup.ref('password'), null], "Passwords don't match!");
          }
      // Otherwise, return a simple validation
      return Yup.string().when('password', {
        is: (password: string) => {
          return password && password.length > 0
        },
        then: (schema) => schema.required()
      });
      }),
      imageChanged: Yup.bool(),
  });

  type UpdateSubmitForm = {
      username: string;
      email: string;
      password?: string;
      confirmPassword?: string;
      imageChanged: boolean;
  };

  const defaultValues = {username: userEdited?.username, email: userEdited?.email, password: undefined, 
                          confirmPassword: undefined, imageChanged: false};

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
              dispatchUI(createActionLoading(true));
              await getDefaultUserImage()
              .then(imageData => { 
                setuserDefaultImage(imageData);
              }) 
              .catch(error => {
                throw new Error(error);
              })
              .finally(() => dispatchUI(createActionLoading(false)));
              await AuthApiService.getUserProfile()
              .then((userRead) => { setUserEdited(userRead); reset(userRead); setUserImage(userRead?.image);})
              .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'User reading'))
              .finally(() => dispatchUI(createActionLoading(false)));
              }
              fetchData();      
          }
      } else {
          navigate('/');
      }
  // eslint-disable-next-line
  }, []);

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkForbidden(apiErrors)) {
      const message = apiErrors['message'];
      toast.error(`Profile update failed: ${message}`);
    } else if (checkSessionExpired(apiErrors)) {
      // toast.error(`${process} failed, session expired`);
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

  const imageMaxSize: ImageSizeProps = {maxWidth:400, maxHeight:400}

  const UserImage = () => {
    if(userImage) {
      return <ImageResize imageData={userImage} resize={imageMaxSize}/>;
    }  else {
      return  userDefaultImage && <Image imageData={userDefaultImage}/> 
    }
  }

  const getDefaultUserImage = (): Promise<ImageData> => {
    return resizeImage('/default-profil-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const onSubmit = async (data: UpdateSubmitForm) => {
      if (userEdited && isDirty && submitForm) {
        dispatchUI(createActionLoading(true));
        const image: ImageData | undefined = userImage;
        const userData: UpdateUserDto = createUserForUpdate({...userEdited, ...data, image});
        await AuthApiService.updateUserProfile(userData)
          .then((userUpdated) => { handleSubmitFormSuccess(userUpdated); })
          .catch((apiErrors: IErrors) =>  { setSubmitForm(false); handleApiErrors(apiErrors,'User update'); });
        dispatchUI(createActionLoading(false));
      }
  } 

  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const handleSubmitFormSuccess = (userUpdated: UserDto) => {
    setUserEdited(userUpdated);
    setSubmitForm(false);
      if (user?.email === userUpdated?.email) {
      // Update state user to refresh user info in NavBar
      dispatchSession(createActionUpdateUser(userUpdated!));
      }
      toast.success(`User updated successfully...`);
      navigate('/'); 
  }

  const cancelEditUserMessage = () => `user edition and loose changes`;

  const handleResetEditUser = () => {
    setImageData(userEdited?.image);
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

  return (
      
    <div className={'page-wrapper'}>
    {userEdited &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit User Profile </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"user-profile-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <div className="form-group col-md-4">
              <div className="row">
                <label className="col-md-2"> Image: </label>
                { userImage && (
                      <button className="btn btn-secondary col-md-3"  onClick={handleDeleteImage} >
                          Delete Image
                      </button>  
                  )
                }   
                <ImageUpload onImageUpload={handleImageUpload} onImageUploadError={handleImageUploadError} resize={imageMaxSize}/>                     
              </div>
            </div>

            <div className="form-group col-md-12">
              {UserImage()}
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
              <label htmlFor="password"> Enter Password </label>
              <input 
                type="password" 
                placeholder="Enter a value to change current password" 
                {...register('password')}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}           
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>

            <div className="form-group col-md-12">
              <label htmlFor="password"> Confirm Password</label>
              <input 
                type="password" 
                placeholder="Enter a value to change current password" 
                {...register('confirmPassword')}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}           
              />
              <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
            </div>

            <div className="row">
              <div className="col-lg-10 col-md-12">
                <div className="form-group row-md-5 pull-right">
                    <CancelButton prompt={isDirty} message={cancelEditUserMessage()} onClick={handleCancelEditUser} className="btn ml-2 btn-danger">Cancel</CancelButton>
                    <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={handleResetEditUser} >
                      Reset
                    </button>
                    <button className="btn ml-2 btn-success" disabled={!isDirty} onClick={handleSubmitForm}>
                      Update
                    </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      )
    }
  </div>
  )
}

export default UserProfile;