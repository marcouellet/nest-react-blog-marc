import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AUTHAPI from '../services/api/AuthAPI';
import useAuth from '../contexts/auth';
import { createActionLoadUser, createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { IErrors } from '../types';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<IErrors | null>(null);
  const {
    state: { isLoading },
    dispatch,
  } = useAuth();

  const navigate = useNavigate();

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch(createActionLoading(true));
    const { username, email, password } = form;

    await AUTHAPI.register({username, email, password})
      .then(
        (user) => {
          dispatch(createActionLoadUser(user));
          navigate('/');    
        }
      )
      .catch((error) => {
        setErrors(error.data.errors);  
      });
    dispatch(createActionLoading(false));
 } 

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>
            {errors && <ListErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  name="username"
                  className="form-control form-control-lg"
                  type="text"
                  value={form.username}
                  placeholder="Your Name"
                  onChange={handleChange}
                />
              </fieldset>
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
                disabled={isLoading}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
