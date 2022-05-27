import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { DropdownButton, Dropdown } from "react-bootstrap";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelButton from '../common/cancelConfirmation'
import { IUser, IUpdateUser, createUserForUpdate } from "../../types";
import { UserApiService } from "../../services/api/UserApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const EditUser = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<IUser>();
 
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required'),
    email: Yup.string().required('Email is required'),
    role: Yup.string().required('Role is required'),
  });

  type UpdateSubmitForm = {
    username: string;
    email: string;
    password: string;
    role: string;
  };

  const defaultValues = {username: user?.username, email: user?.email, password: '', role: user?.role};

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
    if (!user) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await UserApiService.getUserById(userId!)
        .then((user) => { setUser(user); reset(user);})
        .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors));
        dispatch(createActionLoading(false));
       }
      fetchData();      
    }
  // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: UpdateSubmitForm) => {
    if (user && isDirty) {
      dispatch(createActionLoading(true));
      const userData: IUpdateUser = createUserForUpdate({...user, ...data});
      await UserApiService.updateUser(user.id!, userData)
      .then(() => { handleSubmitFormSucess(); })
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
      dispatch(createActionLoading(false));
     }
  } 

  const handleFetchUserError = (apiErrors: IErrors) => {
    toast.error(`User reading failed, see error list`);
    setErrorList(apiErrors);
  }

  const handleSubmitFormSucess = () => {
    toast.success(`User updated successfully...`);
    navigate('/user'); 
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`User update failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/user'); 
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

const handleRoleSelect=(e: any)=>{
  setValue('role', e);
}

  return (
    <div className={'page-wrapper'}>
    {user &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit User  </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"create-user-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
                type="text" 
                placeholder="Enter a value to change current password" 
                {...register('password')}
                className={`form-control`}           
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
                  type="text" disabled  
                  {...register('role')}
                  className={`col-md-1 form-control float-right ${errors.role ? 'is-invalid' : ''}`}           
                />
              </div>
              <div className="invalid-feedback">{errors.role?.message}</div>
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
              <button className="btn btn-secondary" disabled={!isDirty} onClick={ () => handleResetEditUser() } >
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

export default EditUser;