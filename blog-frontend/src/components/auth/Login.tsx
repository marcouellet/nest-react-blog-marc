import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import { AuthApiService } from 'services/api';
import { useUIContext, useSessionContext } from 'contexts';
import { createActionLoggedIn, createActionLoading } from 'reducers';
import { ListErrors } from 'components/common'; 
import { IErrors } from "types";
import { minimumUserPasswordLength, minimumUserEmailLength } from 'shared/entities'
import { checkUnauthorized, checkNotFound, checkTimeout } from 'utils';

const Login = () => {
  const navigate = useNavigate();
  const { uiState: { isLoading }, dispatchUI } = useUIContext();
  const { dispatchSession } = useSessionContext();
  const [errorList, setErrorList] = useState<IErrors | null>();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required')
      .min(minimumUserEmailLength, `Email must be at least ${minimumUserEmailLength} characters long`),
    password: Yup.string().required('Password is required')
      .min(minimumUserPasswordLength, `Password must be at least ${minimumUserPasswordLength} characters long`),
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
  
  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkNotFound(apiErrors)) {
      toast.error(`User not found`);    
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Invalid credentials`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);   
    }
   }

  const onSubmit = async (data: LoginSubmitForm) => {
    dispatchUI(createActionLoading(true));
    await AuthApiService.login(data.email, data.password)
      .then(
        (user) => {
          // toast.info(`${user.username} is logged in`);
          dispatchSession(createActionLoggedIn(user));
          navigate('/');    
        }
      )
      .catch((apiErrors: IErrors) =>  { handleApiErrors(apiErrors, 'Login'); })
      .finally(() => dispatchUI(createActionLoading(false)));
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
                <h4 className="email">
                  <span>
                    User email:
                  </span>
                 </h4>
                 <br/>
                <input
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </fieldset>
              <fieldset className="form-group">
                <h4 className="email">
                  <span>
                    User password:
                  </span>
                 </h4>
                 <br/>
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
