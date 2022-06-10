import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelButton from '../common/cancelConfirmation'
import { IPost, IUpdatePost, createPostForUpdate, minimumTitleLength, minimumDescriptionLength,
          minimumBodyLength } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const EditPost = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>();
 
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumTitleLength, `Title must be at least ${minimumTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumDescriptionLength, `Description must be at least ${minimumDescriptionLength} characters long`),
    body: Yup.string().required('Content is required')
      .min(minimumBodyLength, `Content must be at least ${minimumBodyLength} characters long`),
  });

  type UpdateSubmitForm = {
    title: string;
    description: string;
    body: string;
  };

  const defaultValues = {title: post?.title, description: post?.description, body: post?.body};

  const {
    register,
    handleSubmit,
    reset,
    
    formState: { errors, isDirty }
  } = useForm<UpdateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (!post) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await PostApiService.getPostById(postId!)
        .then((post) => { setPost(post); reset(post);})
        .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        dispatch(createActionLoading(false));
       }
      fetchData();      
    }
  // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: UpdateSubmitForm) => {
    if (post && isDirty) {
      dispatch(createActionLoading(true));
      const postData: IUpdatePost = createPostForUpdate({...post, ...data});
      await PostApiService.updatePost(post.id!, postData)
      .then(() => { handleSubmitFormSucess(); })
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
      dispatch(createActionLoading(false));
     }
  } 

  const handleFetchPostError = (apiErrors: IErrors) => {
    toast.error(`Post reading failed, see error list`);
    setErrorList(apiErrors);
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Post updated successfully...`);
    navigate('/'); 
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Post update failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/'); 
    } else {
      toast.error(`Post update failed, see error list`);
      setErrorList(apiErrors);      
    }
}

const cancelEditPostMessage = () => `post edition and loose changes`;

const handleResetEditPost = () => {
  reset(defaultValues, { keepDirty: false});
}

const handleCancelEditPost = () => {
  navigate('/');   
};

  return (
    <div className={'page-wrapper'}>
    {post &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit Post  </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"create-post-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <div className="form-group col-md-12">
              <label htmlFor="title"> Title </label>
              <input 
                type="text"
                placeholder="Enter title"
                {...register('title')}
                className={`form-control ${errors.title ? 'is-invalid' : ''}`} 
              />
              <div className="invalid-feedback">{errors.title?.message}</div>
           </div>

            <div className="form-group col-md-12">
              <label htmlFor="description"> Description </label>
              <input 
                type="text" 
                placeholder="Enter description"
                {...register('description')}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>

            <div className="form-group col-md-12">
              <label htmlFor="body"> Enter Content </label>
              <input 
                type="text" 
                placeholder="Enter content" 
                {...register('body')}
                className={`form-control ${errors.body ? 'is-invalid' : ''}`}           
              />
              <div className="invalid-feedback">{errors.body?.message}</div>
            </div>

            <div className="form-group col-md-4 pull-right">
              <button className="btn btn-success"  disabled={!isDirty} type="submit">
                Update Post
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>

            <div className="form-group col-md-1 pull-right">
              <button className="btn btn-secondary" disabled={!isDirty} onClick={ () => handleResetEditPost() } >
                Reset
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>
          </form>

          <div className="form-group col-md-1 pull-right">
              {
              <CancelButton prompt={isDirty} message={cancelEditPostMessage()} onClick={() => handleCancelEditPost()} className="btn btn-danger">Cancel</CancelButton>
              }
           </div>

        </div>
      )
    }
  </div>
  )
}

export default EditPost;