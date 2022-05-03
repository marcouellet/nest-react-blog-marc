import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';

const Create = () => {

  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const { isLoading } = state;
  interface IValues {
    [key: string]: any;
  }

  const [values, setValues] = useState<IValues>([]);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errors, setErrors] = React.useState<IErrors | null>();

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = {
      title: values.title,
      description: values.description,
      body: values.body,
    }

    const submitSuccess: boolean = await submitForm(formData);
    setSubmitSuccess(submitSuccess);
    setValues({...values, formData});
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  const submitForm = async (formData: {}) : Promise<boolean>  =>  {
    dispatch(createActionLoading(true));
    const isOk = await PostApiService.createPost(formData)
      .then(() => { handleSubmitFormSucess();  return true;})
      .catch((error) =>  { handleSubmitFormError(error); return false;});
    dispatch(createActionLoading(false));
    return isOk;
  }

  const setFormValues = (formValues: IValues) => {
    setValues({...values, ...formValues})
  }

  const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormValues({ [e.currentTarget.name]: e.currentTarget.value })
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Post created successfully...`);
  }

  const handleSubmitFormError = (error: any) => {
    toast.error(`Post creation failed...`);
    console.log(error);
    setErrors(error.data.errors);
  }

  return (
    <div>
    <div className={"col-md-12 form-wrapper"}>
      <h2> Create Post </h2>
      {!submitSuccess && (
        <div className="alert alert-info" role="alert">
          Fill the form below to create a new post
                </div>
      )}

      {submitSuccess && (
        <div className="alert alert-info" role="alert">
          The form was successfully submitted!
                        </div>
      )}
      {errors && <ListErrors errors={errors} />}
      <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
        <div className="form-group col-md-12">
          <label htmlFor="title"> Title </label>
          <input type="text" id="title" onChange={handleInputChanges} name="title" className="form-control" placeholder="Enter title" />
        </div>

        <div className="form-group col-md-12">
          <label htmlFor="description"> Description </label>
          <input type="text" id="description" onChange={handleInputChanges} name="description" className="form-control" placeholder="Enter Description" />
        </div>

        <div className="form-group col-md-12">
          <label htmlFor="body"> Write Content </label>
          <input type="text" id="body" onChange={handleInputChanges} name="body" className="form-control" placeholder="Enter content" />
        </div>

        <div className="form-group col-md-4 pull-right">
          <button className="btn btn-success" type="submit">
            Create Post
          </button>
          {isLoading &&
            <span className="fa fa-circle-o-notch fa-spin" />
          }
        </div>
      </form>
    </div>
  </div>
  );

}
export default Create
