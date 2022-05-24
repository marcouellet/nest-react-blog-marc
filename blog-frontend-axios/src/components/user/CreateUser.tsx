import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import CancelButton from '../common/cancelConfirmation'
import { yupResolver } from '@hookform/resolvers/yup';
import { UserApiService } from "../../services/api/UserApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const CreateUser = () => {

  const navigate = useNavigate();
  const { state: { isLoading, user }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  type CreateSubmitForm = {
    username: string;
    email: string;
    password: string;
    role: string;
  };

  const defaultValues = {username: '', email: '', password: '', role: ''};

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<CreateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  const onSubmit = async (data: CreateSubmitForm) => {
    dispatch(createActionLoading(true));
    await UserApiService.createUser(data)
    .then(() => { handleSubmitFormSucess(); })
    .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
    dispatch(createActionLoading(false));
  } 

  const handleSubmitFormSucess = () => {
    toast.success(`User created successfully...`);
    navigate('/user');
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`User creation failed, session expired`);
      dispatch(createActionSessionExpired());
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

  return (
    <div>
    <div className={"col-md-12 form-wrapper"}>
      <h2> Create User </h2>
      {errorList && <ListErrors errors={errorList} />}
      <form id={"create-User-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
                placeholder="Enter password" 
                {...register('password')}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}           
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>

            <div className="form-group col-md-12">
              <label htmlFor="role"> Select Role </label>
              <input 
                type="text" 
                {...register('role')}
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}           
              />
              <div className="invalid-feedback">{errors.role?.message}</div>
            </div>

            <div className="form-group col-md-4 pull-right">
              <button className="btn btn-success"  disabled={!isDirty} type="submit">
                Create
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>

            <div className="form-group col-md-1 pull-right">
              <button className="btn btn-secondary" disabled={!isDirty} onClick={ () => handleClearCreateUser() } >
                Reset
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>

      </form>

      <div className="form-group col-md-1 pull-right">
              <CancelButton prompt={isDirty} message={cancelCreateUserMessage()} onClick={() => handleCancelCreateUser()} className="btn btn-danger">Cancel</CancelButton>
            </div>

    </div>
  </div>
  );

}
export default CreateUser
