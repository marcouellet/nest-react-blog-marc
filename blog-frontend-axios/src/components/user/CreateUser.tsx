import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { DropdownButton, Dropdown } from "react-bootstrap";
import * as Yup from 'yup';
import CancelButton from '../common/cancelConfirmation'
import { yupResolver } from '@hookform/resolvers/yup';
import { UserApiService } from "../../services/api/UserApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, minimumPasswordLength, minimumEmailLength, minimumUserNameLength,
          ImageSizeProps, ImageData } from '../../types';
import { checkUnauthorized, checkForbidden } from '../../utils/html.response.utils';
import { createActionSessionExpired } from '../../reducers/auth';
import ImageUpload from '../common/ImageUpload';
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils'

const CreateUser = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [userImage, setUserImage] = useState<ImageData>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required')
      .min(minimumUserNameLength, `User name must be at least ${minimumUserNameLength} characters long`),
    email: Yup.string().required('Email is required')
      .min(minimumEmailLength, `Email must be at least ${minimumEmailLength} characters long`),
    password: Yup.string().required('Password is required')
      .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`),
    role: Yup.string().required('Role is required'),
  });

  type CreateSubmitForm = {
    username: string;
    email: string;
    password: string;
    role: string;
  };

  const defaultValues = {username: '', email: '', password: '', role: ''};

  useEffect(() => {
    if (!userDefaultImage) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await getDefaultUserImage()
        .then(imageData => { 
          setuserDefaultImage(imageData);
        }) 
        .catch(error => {
          throw new Error(error);
        });
        dispatch(createActionLoading(false));
      }
      fetchData();      
    }
  // eslint-disable-next-line
  }, []);

  const imageMaxSize: ImageSizeProps = {maxWidth:200, maxHeight:200}

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

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<CreateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  const onSubmit = async (data: CreateSubmitForm) => {
    dispatch(createActionLoading(true));
    const image: ImageData | undefined = userImage;
    const userData = {...data, image};
    await UserApiService.createUser(userData)
    .then(() => { handleSubmitFormSuccess(); })
    .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
    dispatch(createActionLoading(false));
  } 

  const handleSubmitFormSuccess = () => {
    toast.success(`User created successfully...`);
    navigate('/user');
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`User creation failed, session expired`);
      dispatch(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`User already exist or access denied`);
    } else {
      toast.error(`User creation failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const cancelCreateUserMessage = () => `User creation and loose changes`;

  const handleClearCreateUser = () => {
    reset(defaultValues, { keepDirty: false});
  }

  const handleCancelCreateUser = () => {
    navigate('/user');   
  };

  const handleRoleSelect=(e: any)=>{
      setValue('role', e);
  }

  const handleImageUpload = (image: ImageData) => {
    setUserImage(image);
  }

  const handleImageUploadError = (error: any) => {
    toast.error(`User image upload failed`);
  }
  
  const handleDeleteImage = () => {
    setUserImage(undefined);
  }

  return (
    <div>
      <div className={"col-md-12 form-wrapper"}>
        <h2> Create User </h2>
        {errorList && <ListErrors errors={errorList} />}
        <form id={"create-user-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <div className="form-group col-md-4">
            <div className="row">
              <label className="col-md-2"> Image: </label>
              { userImage && 
                <button className="btn btn-secondary col-md-3"  onClick={ () => handleDeleteImage() } >
                  Delete Image
                </button>  
              }  
              <ImageUpload onImageUpload={handleImageUpload} onImageUploadError={handleImageUploadError} resize={imageMaxSize}/>                
              </div>
          </div>
          <div className="form-group col-md-12">
            {UserImage()}  
            <br/>

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
              type="text" 
              placeholder="Enter password" 
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
              <input style={ {float: 'right'} }    
                type="text" disabled  placeholder="no role selected" 
                {...register('role')}
                className={`col-md-1 form-control float-right ${errors.role ? 'is-invalid' : ''}`}           
              />
            </div>
            <div className="invalid-feedback">{errors.role?.message}</div>
          </div>
          <div className="row">
          <div className="col-lg-10 col-md-12">
            <div className="form-group row-md-5 pull-right">
                {
                  <CancelButton prompt={isDirty} message={cancelCreateUserMessage()} onClick={() => handleCancelCreateUser()} className="btn ml-2 btn-danger">Cancel</CancelButton>
                }
                <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={ () => handleClearCreateUser() } >
                  Reset
                </button>
                {isLoading &&
                  <span className="fa fa-circle-o-notch fa-spin" />
                }
                <button className="btn ml-2 btn-success" disabled={!isDirty} type="submit">
                  Create
                </button>
                {isLoading &&
                  <span className="fa fa-circle-o-notch fa-spin" />
                }
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  );

}
export default CreateUser
