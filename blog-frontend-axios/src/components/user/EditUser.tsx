import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { DropdownButton, Dropdown } from "react-bootstrap";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CancelButton from '../common/cancelConfirmation';
import { User, IUpdateUser, createUserForUpdate, minimumPasswordLength, minimumEmailLength, 
        minimumUserNameLength, ImageData, ImageSizeProps, IErrors } from "../../types";
import { UserApiService } from "../../services/api/UserApiService";
import { createActionUpdateUser, createActionSessionExpired } from '../../reducers/session.reducer';
import { createActionLoading } from '../../reducers/ui.reducer';
import useSessionContext from '../../contexts/session.context';
import useUIContext from '../../contexts/ui.context';
import ListErrors from '../common/ListErrors';
import { checkUnauthorized, checkSessionExpired, checkTimeout, checkForbidden } from '../../utils/html.response.utils';
import Image from '../common/Image';
import ImageUpload from '../common/ImageUpload';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';

const EditUser = () => {

  const navigate = useNavigate();
  const { sessionState: { user }, dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { userId } = useParams<{ userId: string }>();
  const [userEdited, setUserEdited] = useState<User>();
  const [userImage, setUserImage] = useState<ImageData>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
 
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required')
      .min(minimumUserNameLength, `User name must be at least ${minimumUserNameLength} characters long`),
    email: Yup.string().required('Email is required')
      .min(minimumEmailLength, `Email must be at least ${minimumEmailLength} characters long`),
    password: Yup.lazy(value => {
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
    confirmPassword: Yup.lazy(value => {
      if (
          value &&
          Object.values(value).some(v => !(v === null || v === undefined || v === ""))
      ) {
          // Return our normal validation
          return Yup.string().required()
          .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`)
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
    role: Yup.string().required('Role is required'),
    imageChanged: Yup.bool(),
  });

  type UpdateSubmitForm = {
    username: string;
    email: string;
    password?: string;
    role: string;
    imageChanged: boolean;
  };

  const defaultValues = {username: userEdited?.username, email: userEdited?.email, password: undefined, role: userEdited?.role,
                           imageChanged: false};

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
    if (!userEdited) {
      (async () => {
        // alert('EditUser useEffet called');
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
          await UserApiService.getUserById(userId!)
          .then((userRead) => { setUserEdited(userRead); reset(userRead); setUserImage(userRead?.image);})
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors, 'User reading'))
          .finally(() => dispatchUI(createActionLoading(false)));
        }
        await fetchData();  
      })().finally(() => dispatchUI(createActionLoading(false)));        
    }

  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user?.email === userEdited?.email) {
      setImageData(user?.image);
    }
  // eslint-disable-next-line
  }, [user]);

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
      const userData: IUpdateUser = createUserForUpdate({...userEdited, ...data, image});
      await UserApiService.updateUser(userEdited.id!, userData)
      .then((userUpdated) => { handleSubmitFormSuccess(userUpdated); })
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
      dispatchUI(createActionLoading(false));
     }
  } 

  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const handleSubmitFormSuccess = (userUpdated: User) => {
    setSubmitForm(false);
    setUserEdited(userUpdated);
    if (user?.email === userUpdated?.email) {
      // Update state user to refresh user info in NavBar
      dispatchSession(createActionUpdateUser(userUpdated!));
    }
    toast.success(`User updated successfully...`);
    navigate(`/user/${userEdited!.id}`); 
  }

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkForbidden(apiErrors)) {
      const message = apiErrors['message'];
      toast.error(`Profile update failed: ${message}`);
    } else if (checkSessionExpired(apiErrors)) {
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

  const handleSubmitFormError = (apiErrors: IErrors) => {
    setSubmitForm(false);
    handleApiErrors(apiErrors, 'User update');
  }

  const cancelEditUserMessage = () => `user edition and loose changes`;

  const handleResetEditUser = () => {
    setImageData(userEdited?.image);
    reset(defaultValues, { keepDirty: false});
  }

  const handleCancelEditUser = () => {
    navigate(`/user/${userEdited!.id}`);   
  };

  const handleRoleSelect=(e: any)=>{
    setValue('role', e, {shouldDirty: true});
  }

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
          <h2> Edit User  </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"edit-user-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
              <label htmlFor="username"> Name </label>
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

            <div className="form-group ">
              <div className="row">
                <DropdownButton title="Select Role" onSelect={handleRoleSelect} className="col-md-1">
                    <Dropdown.Item eventKey='user'>User</Dropdown.Item>
                    <Dropdown.Item eventKey='admin'>Admin</Dropdown.Item>
                </DropdownButton>
                <input 
                  style={ {float: 'right'} }    
                  type="text" 
                  disabled  
                  placeholder="no role selected" 
                  {...register('role')}
                  className={`col-md-1 form-control float-right ${errors.role ? 'is-invalid' : ''}`}           
                />
              </div>
              <div className="invalid-feedback">{errors.role?.message}</div>
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

export default EditUser;