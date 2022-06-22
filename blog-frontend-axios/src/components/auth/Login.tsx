import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import AUTHAPI from '../../services/api/AuthApiService';
import useAuth from '../../contexts/auth';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createActionLoadUser, createActionLoading } from '../../reducers/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, minimumPasswordLength, minimumEmailLength } from "../../types";
import { checkUnauthorized, checkNotFound } from '../../utils/response';

const Login = () => {
  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required')
      .min(minimumEmailLength, `Email must be at least ${minimumEmailLength} characters long`),
    password: Yup.string().required('Password is required')
      .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`),
  });

  type LoginSubmitForm = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkNotFound(apiErrors)) {
      toast.error(`User not found`);    
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Invalid credentials`);
    } else {
      toast.error(`Login failed, see error list`);
      setErrorList(apiErrors);
    }
   }

  const onSubmit = async (data: LoginSubmitForm) => {
    dispatch(createActionLoading(true));
    await AUTHAPI.login(data.email, data.password)
      .then(
        (user) => {
          toast.info(`${user.username} is logged in`);
          dispatch(createActionLoadUser(user));
          navigate('/');    
        }
      )
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
    dispatch(createActionLoading(false));
  } 

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Log in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>
            {errorList && <ListErrors errors={errorList} />}
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </fieldset>
              <fieldset className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                />
                <div className="invalid-feedback">{errors.password?.message}</div>
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={isLoading}
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
