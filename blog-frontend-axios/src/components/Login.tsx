import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AUTHAPI from '../services/api/AuthAPI';
import useAuth from '../contexts/auth';
import { toast } from "react-toastify";
import { createActionLoadUser, createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { IErrors } from '../types';

const Login = () => {
  const [errors, setErrors] = React.useState<IErrors | null>();
  const {
    state: { isLoading },
    dispatch,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch(createActionLoading(true));
    const { email, password } = form;
    await AUTHAPI.login(email, password)
      .then(
        (user) => {
          toast.info(`${user.username} is logged in`);
          dispatch(createActionLoadUser(user));
          navigate('/');    
        }
      )
      .catch((apiErrors: IErrors) => {
        toast.error(`Login failed, see error list`);
        setErrors(apiErrors);
      });
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
            {errors && <ListErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  name="email"
                  className="form-control form-control-lg"
                  type="email"
                  value={form.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  value={form.password}
                  placeholder="Password"
                  onChange={handleChange}
                />
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
