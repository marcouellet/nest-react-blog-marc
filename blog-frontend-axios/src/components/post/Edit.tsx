import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { IPost, IUpdatePost, createPostForUpdate } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';

const Edit = () => {

  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const { isLoading } = state;
  const { postId } = useParams<{ postId: string }>();
  interface IValues {
    [key: string]: any | null;
  }

  const [post, setPost] = useState<IPost>();
  const [values, setValues] = useState<IValues>([]);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errors, setErrors] = React.useState<IErrors | null>();

  useEffect(() => {
    if (!post) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await PostApiService.getPostById(postId!)
        .then((post) => { setPost(post); setValues(post); })
        .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        dispatch(createActionLoading(false));
       }
      fetchData();      
    }
  // eslint-disable-next-line
  }, []);

  const handleFetchPostError = (apiErrors: IErrors) => {
    toast.error(`Post reading failed, see error list`);
    setErrors(apiErrors);
  }

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = {
      title: values.title,
      description: values.description,
      body: values.body,
    }

    const submitSuccess: boolean = await submitForm(formData);
    setSubmitSuccess(submitSuccess);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  const submitForm = async (formData: {}) : Promise<boolean>  =>  {
    if (post) {
      dispatch(createActionLoading(true));
      const updatePost: IUpdatePost = createPostForUpdate({...post, ...formData});
      const isOk = await PostApiService.updatePost(post.id!, updatePost)
        .then(() => { handleSubmitFormSucess();  return true;})
        .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); return false;});
      dispatch(createActionLoading(false));
      return isOk;
    }
    return Promise.resolve(false);
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Post updated successfully...`);
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    toast.error(`Post update failed, see error list`);
    setErrors(apiErrors);
}

  const setFormValues = (formValues: IValues) => {
    setValues({...values, ...formValues})
  }

  const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    setFormValues({ [e.currentTarget.id]: e.currentTarget.value })
  }

  return (
    <div className={'page-wrapper'}>
    {post &&
      <div className={"col-md-12 form-wrapper"}>
        <h2> Edit Post  </h2>

        {submitSuccess && (
          <div className="alert alert-info" role="alert">
            The post has been edited successfully!
                        </div>
        )}
        {errors && <ListErrors errors={errors} />}
        <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
          <div className="form-group col-md-12">
            <label htmlFor="title"> Title </label>
            <input type="text" id="title" defaultValue={post.title.toString()} onChange={handleInputChanges} name="title" className="form-control" placeholder="Enter title" />
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="description"> Description </label>
            <input type="text" id="description" defaultValue={post.description.toString()} onChange={handleInputChanges} name="description" className="form-control" placeholder="Enter Description" />
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="body"> Write Content </label>
            <input type="text" id="body" defaultValue={post.body.toString()} onChange={handleInputChanges} name="body" className="form-control" placeholder="Enter content" />
          </div>

          <div className="form-group col-md-4 pull-right">
            <button className="btn btn-success" type="submit">
              Update Post
            </button>
            {isLoading &&
              <span className="fa fa-circle-o-notch fa-spin" />
            }
          </div>
        </form>
      </div>
    }
  </div>
  )
}

export default Edit;