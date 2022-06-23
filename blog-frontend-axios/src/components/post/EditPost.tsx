import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelButton from '../common/cancelConfirmation'
import { IPost, IUpdatePost, ICategory, createPostForUpdate, minimumPostTitleLength, minimumPostDescriptionLength,
          minimumPostBodyLength } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { IErrors } from '../../types';
import { checkUnauthorized, checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const EditPost = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
 
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumPostTitleLength, `Title must be at least ${minimumPostTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumPostDescriptionLength, `Description must be at least ${minimumPostDescriptionLength} characters long`),
    body: Yup.string().required('Content is required')
      .min(minimumPostBodyLength, `Content must be at least ${minimumPostBodyLength} characters long`),
    categoryTitle: Yup.string(),
  });

  type UpdateSubmitForm = {
    categoryTitle: string;
    title: string;
    description: string;
    body: string;
  };

  const defaultValues = {categoryTitle: '', title: post?.title, description: post?.description, body: post?.body};

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = useForm<UpdateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    (async () => {
      let allCategories: ICategory[];

      dispatch(createActionLoading(true));
      if (!categories) {
        const fetchCategories = async (): Promise<void> => {
          CategoryApiService.getAllCategories()
          .then(categories => {
            const noCategory: ICategory = {id:'no_category', title: 'No category', description: ''};
            allCategories = [noCategory].concat(categories);
            setCategories(allCategories);
            selectCategory(allCategories, 'no_category', false);
          })
          .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors));
        }
        await fetchCategories();
      }
      if (!post) {
        const fetchPost = async (): Promise<void> => {
          PostApiService.getPostById(postId!)
          .then(post => { 
            setPost(post); 
            reset(post);
            if (post?.category) {
              selectCategory(allCategories, post.category.id!, false);
            }
          })
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        }
        await fetchPost();
      }
      dispatch(createActionLoading(false));

    })();
 // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: UpdateSubmitForm) => {
    if (post && isDirty) {
      dispatch(createActionLoading(true));
      const postData: IUpdatePost = createPostForUpdate({...post, ...data, category});
      await PostApiService.updatePost(post.id!, postData)
      .then(() => { handleSubmitFormSuccess(); })
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
      dispatch(createActionLoading(false));
     }
  } 

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    toast.error(`Categories reading failed, see error list`);
    setErrorList(apiErrors);
  }
  
  const handleFetchPostError = (apiErrors: IErrors) => {
    toast.error(`Post reading failed, see error list`);
    setErrorList(apiErrors);
  }

  const handleSubmitFormSuccess = () => {
    toast.success(`Post updated successfully...`);
    navigate('/'); 
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Post update failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/'); 
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else {
      toast.error(`Post update failed, see error list`);
      setErrorList(apiErrors);      
    }
}

const cancelEditPostMessage = () => `post edition and loose changes`;

const handleResetEditPost = () => {
  reset(post);
  if (post?.category) {
    selectCategory(categories!, post.category.id!, false);
  } else {
    selectCategory(categories!, 'no_category', false);
  }
}

const handleCategorySelect=(e: any)=>{
  selectCategory(categories!, e, true);
}

const selectCategory = (categories: ICategory[], categoryId: string, setDirty: boolean)=>{
  const category = categories.find(category => category.id === categoryId);
  setCategory(category?.id === 'no_category' ? undefined: category);
  setValue('categoryTitle', category!.title, { shouldDirty: setDirty });
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