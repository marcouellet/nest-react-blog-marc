import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { DropdownButton, Dropdown } from "react-bootstrap";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { CancelButton, ListErrors, ImageUpload, Image, ImageResize } from '@Common';
import { UserApiService } from "@Services";
import { createActionSessionExpired, createActionLoading } from '@Reducers';
import { useUIContext, useSessionContext } from '@Contexts';
import { IErrors, minimumPasswordLength, minimumEmailLength, minimumUserNameLength,
          ImageSizeProps, ImageData } from '@Types';
import { checkUnauthorized, checkSessionExpired, checkForbidden, checkTimeout, resizeImage } from '@Utils';

const CreateUser = () => {

  const navigate = useNavigate();
  const { dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [userImage, setUserImage] = useState<ImageData>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required')
      .min(minimumUserNameLength, `User name must be at least ${minimumUserNameLength} characters long`),
    email: Yup.string().required('Email is required')
      .min(minimumEmailLength, `Email must be at least ${minimumEmailLength} characters long`),
    password: Yup.string().required('Password is required')
      .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`),
    confirm_password: Yup.string().required('Confirm password is required')
      .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`)
      .oneOf([Yup.ref('password')], "Passwords don't match!"),
    role: Yup.string().required('Role is required'),
    imageChanged: Yup.bool(),
  });

  type CreateSubmitForm = {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    role: string;
    imageChanged: boolean;
  };

  const defaultValues = {username: '', email: '', password: '', confirm_password: '', role: '', imageChanged: false};

  useEffect(() => {
    if (!userDefaultImage) {
      const fetchData = async (): Promise<void> => {
        // alert('CreateUser useEffet called');
        dispatchUI(createActionLoading(true));
        await getDefaultUserImage()
        .then(imageData => { 
          setuserDefaultImage(imageData);
        }) 
        .catch(error => {
          throw new Error(error);
        })
        .finally(() => dispatchUI(createActionLoading(false)));
      }
      fetchData();      
    }
  // eslint-disable-next-line
  }, []);

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
    if (submitForm) {
      dispatchUI(createActionLoading(true));
      const image: ImageData | undefined = userImage;
      const userData = {...data, image};
      await UserApiService.createUser(userData)
      .then(() => { handleSubmitFormSuccess(); })
      .catch((apiErrors: IErrors) =>  { handleApiErrors(apiErrors, 'Creation') })
      .finally(() => dispatchUI(createActionLoading(false)));
    }
  } 

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    setSubmitForm(false);
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatchSession(createActionSessionExpired());
    } else if (checkForbidden(apiErrors)) {
      const message = apiErrors['message'];
      toast.error(`${process} failed: ${message}`);   
    } else if (checkUnauthorized(apiErrors)) {
      toast.error('Access denied');
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }
  
  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const handleSubmitFormSuccess = () => {
    setSubmitForm(false);
    toast.success(`User created successfully...`);
    navigate('/user');
  }

  const cancelCreateUserMessage = () => `User creation and loose changes`;

  const handleClearCreateUser = () => {
    setUserImage(undefined);
    reset(defaultValues, { keepDirty: false});
  }

  const handleCancelCreateUser = () => {
    navigate('/user');   
  };

  const handleRoleSelect=(e: any)=>{
      setValue('role', e, {shouldDirty: true});
  }

  const handleImageUpload = (image: ImageData) => {
    setUserImage(image);
    setValue('imageChanged', true, {shouldDirty: true});
  }

  const handleImageUploadError = (error: any) => {
    toast.error(`User image upload failed`);
  }
  
  const handleDeleteImage = () => {
    setUserImage(undefined);
  }

  return (
    <>
      <div className={"col-md-12 form-wrapper"}>
        <h2> Create User </h2>
        {errorList && <ListErrors errors={errorList} />}
        <form id={"create-user-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <div className="form-group col-md-4">
            <div className="row">
              <label className="col-md-2"> Image: </label>
              { userImage && 
              (
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
            <br/>

            <label htmlFor="username"> Enter user name </label>
            <input 
              type="text"
              placeholder="Enter user name"
              {...register('username')}
              className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
            />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="email"> Enter email </label>
            <input 
              type="text" 
              placeholder="Enter email"
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="password"> Enter password </label>
            <input 
              type="text" 
              placeholder="Enter password" 
              {...register('password')}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}           
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="confirm_password"> Enter password again</label>
            <input 
              type="text" 
              placeholder="Enter password" 
              {...register('confirm_password')}
              className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}           
            />
            <div className="invalid-feedback">{errors.confirm_password?.message}</div>
          </div>

          <div className="form-group ">
            <div className="row">
              <DropdownButton title="Select Role" onSelect={handleRoleSelect} className="col-md-1">
                  <Dropdown.Item eventKey='user'>User</Dropdown.Item>
                  <Dropdown.Item eventKey='admin'>Admin</Dropdown.Item>
              </DropdownButton>
              <input 
                style={{float: 'right'}}    
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
                <CancelButton prompt={isDirty} message={cancelCreateUserMessage()} onClick={handleCancelCreateUser} className="btn ml-2 btn-danger">Cancel</CancelButton>
                <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={handleClearCreateUser} >
                  Reset
                </button>
                <button className="btn ml-2 btn-success" disabled={!isDirty} onClick={handleSubmitForm}>
                  Create
                </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </>
  );

}
export default CreateUser
