import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { IPost } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";

//import { useAuth0 } from '../../contexts/auth0-context';

const Edit = () => {

  //const { getIdTokenClaims } = useAuth0();

  let history = useHistory();
  const { postId } = useParams<{ postId: string }>();

  interface IValues {
    [key: string]: any | null;
  }

  const [post, setPost] = useState<IPost>();
  const [values, setValues] = useState<IValues>([]);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const post = await PostApiService.getPostById(Number.parseInt(postId));
      setPost(post.data);
    }
    fetchData();    
  }, [postId]);

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      title: values.title,
      description: values.description,
      body: values.body,
    }

    const submitSuccess: boolean = await submitForm(formData);
    setSubmitSuccess(submitSuccess);
    setLoading(false);
    setTimeout(() => {
      history.push('/');
    }, 1500);
  }

  const submitForm = async (formData: {}) : Promise<boolean>  =>  {
    if (post) {
      const data: IPost = {...post, ...formData};
      return await PostApiService.updatePost(data)
      .then(() => { handleSubmitFormSucess();  return true;})
      .catch(() =>  { handleSubmitFormError(); return false;});
    }
    return Promise.resolve(false);
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Post updated successfully...`);
  }

  const handleSubmitFormError = () => {
    toast.error(`Post update failed...`);
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
        <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
          <div className="form-group col-md-12">
            <label htmlFor="title"> Title </label>
            <input type="text" id="title" defaultValue={post.title.toString()} onChange={(e) => handleInputChanges(e)} name="title" className="form-control" placeholder="Enter title" />
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="description"> Description </label>
            <input type="text" id="description" defaultValue={post.description.toString()} onChange={(e) => handleInputChanges(e)} name="description" className="form-control" placeholder="Enter Description" />
          </div>

          <div className="form-group col-md-12">
            <label htmlFor="body"> Write Content </label>
            <input type="text" id="body" defaultValue={post.body.toString()} onChange={(e) => handleInputChanges(e)} name="body" className="form-control" placeholder="Enter content" />
          </div>

          <div className="form-group col-md-4 pull-right">
            <button className="btn btn-success" type="submit">
              Edit Post
            </button>
            {loading &&
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