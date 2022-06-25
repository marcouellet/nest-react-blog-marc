import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import CancelButton from '../common/cancelConfirmation'
import { yupResolver } from '@hookform/resolvers/yup';
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { IErrors, IUser, ICategory, IPostImage, minimumPostTitleLength, minimumPostDescriptionLength, 
          minimumPostBodyLength } from '../../types';
import { checkUnauthorized, checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const CreatePost = () => {

  const navigate = useNavigate();
  const { state: { isLoading, user }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [postImage, setPostImage] = useState<IPostImage>();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumPostTitleLength, `Title must be at least ${minimumPostTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumPostDescriptionLength, `Description must be at least ${minimumPostDescriptionLength} characters long`),
    body: Yup.string().required('Content is required')
      .min(minimumPostBodyLength, `Content must be at least ${minimumPostBodyLength} characters long`),
    categoryTitle: Yup.string(),
  });

  type CreateSubmitForm = {
    categoryTitle: string;
    title: string;
    description: string;
    body: string;
  };

  const defaultValues = {title: '', description: '', body: '', categoryTitle: ''};

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<CreateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    (async () => {
      dispatch(createActionLoading(true));
      if (!categories) {
        const fetchCategories = async (): Promise<void> => {
          CategoryApiService.getAllCategories()
          .then(categories => {
            const noCategory: ICategory = {id:'no_category', title: 'No category', description: ''};
            const allCategories = [noCategory].concat(categories);
            setCategories(allCategories);
            selectCategory(allCategories, 'no_category', false);
          })
          .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors));
        }
        await fetchCategories();
      }
      dispatch(createActionLoading(false));
    })();
 // eslint-disable-next-line
  }, []);

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    toast.error(`Categories reading failed, see error list`);
    setErrorList(apiErrors);
  }
  
  const onSubmit = async (data: CreateSubmitForm) => {
    dispatch(createActionLoading(true));
    const image: IPostImage | undefined = postImage;
    const postData = {...data, category, image, user};
    await PostApiService.createPost(postData)
    .then(() => { handleSubmitFormSuccess(); })
    .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
    dispatch(createActionLoading(false));
  } 

  const handleSubmitFormSuccess = () => {
    toast.success(`Post created successfully...`);
    navigate('/'); 
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Post creation failed, session expired`);
      dispatch(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else {
      toast.error(`Post creation failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const cancelCreatePostMessage = () => `post creation and loose changes`;

  const handleClearCreatePost = () => {
    reset(defaultValues, { keepDirty: false});
    const noCategory = categories?.find(category => category.id === 'no_category');
    setCategory(noCategory);
    setValue('categoryTitle', noCategory!.title, { shouldDirty: false });
  }

  const handleCategorySelect=(e: any)=>{
    selectCategory(categories!, e, true);
  }

  const selectCategory = (categories: ICategory[], categoryId: string, setDirty: boolean)=>{
    const category = categories?.find(category => category.id === categoryId);
    setCategory(category?.id === 'no_category' ? undefined: category);
    setValue('categoryTitle', category!.title, { shouldDirty: setDirty });
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
        
        <div className="form-group ">
          <div className="row">
            <DropdownButton title="Select Category" onSelect={handleCategorySelect} className="col-md-2">
                {categories && categories.map((category: ICategory) => 
                (
                  <Dropdown.Item eventKey={category.id}>{category.title}</Dropdown.Item>
                ))
              }
            </DropdownButton>
            <input style={ {float: 'right'} }    
              type="text" disabled  placeholder="no category selected" 
              {...register('categoryTitle')}
              className={`col-md-2 form-control float-right ${errors.categoryTitle ? 'is-invalid' : ''}`}           
            />
          </div>
          <div className="invalid-feedback">{errors.categoryTitle?.message}</div>
        </div>

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
          <button className="btn btn-secondary"  disabled={!isDirty} onClick={ () => handleClearCreatePost() } >
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
export default CreatePost
