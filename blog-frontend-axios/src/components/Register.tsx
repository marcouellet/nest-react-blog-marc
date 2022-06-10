import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import AUTHAPI from '../services/api/AuthApiService';
import useAuth from '../contexts/auth';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createActionLoadUser, createActionLoading } from '../reducers/auth';
import { checkForbidden } from '../utils/response';
import ListErrors from './common/ListErrors';
import { IErrors, User, minimumUserNameLength, minimumPasswordLength, minimumEmailLength } from "../types";

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const {
    state: { isLoading },
    dispatch,
  } = useAuth();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required')
    .min(minimumUserNameLength, `User name must be at least ${minimumUserNameLength} characters long`),
    email: Yup.string().required('Email is required')
      .min(minimumEmailLength, `Email must be at least ${minimumEmailLength} characters long`),
    password: Yup.string().required('Password is required')
      .min(minimumPasswordLength, `Password must be at least ${minimumPasswordLength} characters long`),
  });

  type RegisterSubmitForm = {
    username: string;
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  const navigate = useNavigate();

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Registration failed, email already used!`);
    } else {
      toast.error(`User registration failed, see error list`);
      setErrorList(apiErrors);
      }
  }

  const onSubmit = async (data: RegisterSubmitForm) => {
    dispatch(createActionLoading(true));
    const { username, email, password } = data;
    await AUTHAPI.register(username, email, password)
      .then(
        (user: User) => {
          toast.success(`${user.username} is registered`);
          dispatch(createActionLoadUser(user));
          navigate('/login');    
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
            <h1 className="text-xs-center">Register</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>
            {errorList && <ListErrors errors={errorList} />}
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="form-group">
                <input
                      type="username"
                      placeholder="Your Name"
                      {...register('username')}
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
                />
                <div className="invalid-feedback">{errors.username?.message}</div>
              </fieldset>
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
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
