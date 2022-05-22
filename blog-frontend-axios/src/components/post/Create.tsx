import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import CancelButton from '../common/cancelConfirmation'
import { yupResolver } from '@hookform/resolvers/yup';
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const Create = () => {

  const navigate = useNavigate();
  const { state: { isLoading, user }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    body: Yup.string().required('Body is required'),
  });

  type CreateSubmitForm = {
    title: string;
    description: string;
    body: string;
  };

  const defaultValues = {title: '', description: '', body: ''};

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
    const postData = {...data, user}
    await PostApiService.createPost(postData)
    .then(() => { handleSubmitFormSucess(); })
    .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
    dispatch(createActionLoading(false));
  } 

  const handleSubmitFormSucess = () => {
    toast.success(`Post created successfully...`);
    navigate('/'); 
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Post creation failed, session expired`);
      dispatch(createActionSessionExpired());
    } else {
      toast.error(`Post creation failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const cancelCreatePostMessage = () => `post creation and loose changes`;

  const handleClearEditPost = () => {
    reset(defaultValues, { keepDirty: false});
  }

  const handleCancelCreatePost = () => {
    navigate('/');   
  };

  return (
    <div>
    <div className={"col-md-12 form-wrapper"}>
      <h2> Create Post </h2>
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
          <label htmlFor="body"> Write Content </label>
          <input 
            type="text" 
            placeholder="Enter body" 
            {...register('body')}
            className={`form-control ${errors.body ? 'is-invalid' : ''}`}           
          />
          <div className="invalid-feedback">{errors.body?.message}</div>
        </div>

        <div className="form-group col-md-1 pull-right">
          <button className="btn btn-success"  disabled={!isDirty} type="submit">
            Create Post
          </button>
          {isLoading &&
            <span className="fa fa-circle-o-notch fa-spin" />
          }
        </div>
  
        <div className="form-group col-md-1 pull-right">
          <button className="btn btn-secondary"  disabled={!isDirty} onClick={ () => handleClearEditPost() } >
            Clear
          </button>
          {isLoading &&
            <span className="fa fa-circle-o-notch fa-spin" />
          }
        </div>

      </form>

      <div className="form-group col-md-1 pull-right">
              <CancelButton prompt={isDirty} message={cancelCreatePostMessage()} onClick={() => handleCancelCreatePost()} className="btn btn-danger">Cancel</CancelButton>
            </div>

    </div>
  </div>
  );

}
export default Create
