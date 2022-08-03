import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DropdownButton, Dropdown } from 'react-bootstrap';

import CancelButton from '../common/cancelConfirmation';
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading, createActionSessionExpired } from '../../reducers/session.reducer';
import useSessionContext from '../../contexts/session.context';
import ListErrors from '../common/ListErrors';
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { UserRole, IErrors, ICategory, ImageData, ImageSizeProps, minimumPostTitleLength, 
          minimumPostDescriptionLength, PostEditingFormState, IPostEditingState } from '../../types';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';
import ImageUpload from '../common/ImageUpload';
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';
import EditPostContent from './EditPostContent';

const CreatePost = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { sessionState: { isLoading, isAuthenticated, user }, dispatchSession } = useSessionContext();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [postImage, setPostImage] = useState<ImageData>();
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();
  const [editingContent, setEditingContent] = useState<boolean>();
  const [content, setContent] = useState<string>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumPostTitleLength, `Title must be at least ${minimumPostTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumPostDescriptionLength, `Description must be at least ${minimumPostDescriptionLength} characters long`),
    body: Yup.string().required('Content is required'),
    categoryTitle: Yup.string(),
    imageChanged: Yup.bool(),
  });

  const defaultValues = {title: '', description: '', body: '', categoryTitle: '', image: undefined, imageChanged: false};

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    getValues,
  } = useForm<PostEditingFormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    (async () => {
      if (!categories) {
        const fetchCategories = async (): Promise<void> => {
          dispatchSession(createActionLoading(true));
          await getDefaultPostImage()
            .then(imageData => { setpostDefaultImage(imageData);})
            .catch(error => {
              throw new Error(error);
            })
            .finally(() => dispatchSession(createActionLoading(false)));  
          await CategoryApiService.getAllCategories()
            .then(categories => {
              const noCategory: ICategory = {id:'no_category', title: 'No category', description: ''};
              const allCategories = [noCategory].concat(categories);
              setCategories(allCategories);
              selectCategory(allCategories, 'no_category', false);
            })
            .catch((apiErrors: IErrors) =>  handleApiErrors(apiErrors, 'Categories reading'))
            .finally(() => dispatchSession(createActionLoading(false)));
        }
        fetchCategories();
      }
      if (location.state) {
        restorePostEditingState(location.state as any);
      }
    })();
 // eslint-disable-next-line
  }, [categories]);

  const getDefaultPostImage = (): Promise<ImageData> => {
    return resizeImage('/default-post-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const PostImage = () => {
    if(postImage) {
      return <ImageResize imageData={postImage} resize={imageMaxSize}/>;
    }  else {
      return  postDefaultImage && <Image imageData={postDefaultImage}/> 
    }
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:400, maxHeight:400}

  const goBack = () => {
    if (isAdministrator()) {
      navigate('/post');
    } else if (isAuthenticated) {
      navigate('/post/user');
    } else {
      navigate('/');
    }
  }
  
  const onSubmit = async (data: PostEditingFormState) => {
    if (submitForm) {
      dispatchSession(createActionLoading(true));
      const image: ImageData | undefined = postImage;
      const postData = {...data, category, image, user};
      await PostApiService.createPost(postData)
      .then(() => { handleSubmitFormSuccess(); })
      .catch((apiErrors: IErrors) =>  { handleApiErrors(apiErrors, 'Post creation') });
      dispatchSession(createActionLoading(false));  
    }
   } 

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatchSession(createActionSessionExpired());
      goBack();
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const handleSubmitFormSuccess = () => {
    toast.success(`Post created successfully...`);
    goBack();
  }

  const cancelCreatePostMessage = () => `post creation and loose changes`;

  const handleClearCreatePost = () => {

    const noCategory = categories?.find(category => category.id === 'no_category');
    setCategory(noCategory);
    setValue('categoryTitle', noCategory!.title, { shouldDirty: false });
    setPostImage(undefined);
    reset(defaultValues, { keepDirty: false});
  }

  const handleCategorySelect=(e: any)=>{
    selectCategory(categories!, e, true);
  }

  const handleEditContent = () => {
    setEditingContent(true);
  }
  
  const setPostContent = (value: string, shouldDirty: boolean = true) => {
    setValue('body', value, { shouldDirty: shouldDirty, shouldValidate: true });
    setContent(value);
    setEditingContent(false);
  }
  
  const onCancelContentEditing = () => {
    setEditingContent(false);
  }

  const selectCategory = (categories: ICategory[], categoryId: string, setDirty: boolean)=>{
    const category = categories?.find(category => category.id === categoryId);
    setCategory(category?.id === 'no_category' ? undefined: category);
    setValue('categoryTitle', category!.title, { shouldDirty: setDirty });
  }

  const handleCancelCreatePost = () => {
    goBack();  
  };

  const handleImageUpload = (image: ImageData) => {
    setPostImage(image);
    setValue('imageChanged', true, {shouldDirty: true});
  }

  const handleImageUploadError = (error: any) => {
    toast.error(`User image upload failed`);
  }
  
  const handleDeleteImage = () => {
    setPostImage(undefined);
  }

  const getPostEditingState = () : IPostEditingState => {
    return {
      content: content,
      formState: getValues(),
      category: category,
      postImage: postImage,
      postUrl: location.pathname,
      isDirty: isDirty
    }
  }

  const setFormValues = (formState: PostEditingFormState, isDirty: boolean) => {
    setValue('title', formState.title, {shouldDirty: isDirty});
    setValue('description', formState.description, {shouldDirty: isDirty});
    setValue('body', formState.body, {shouldDirty: isDirty});
    setValue('categoryTitle', formState.categoryTitle, {shouldDirty: isDirty});
    setValue('imageChanged', formState.imageChanged, {shouldDirty: isDirty});
  }

  const restorePostEditingState = (postEditingState: IPostEditingState) => {
    if (postEditingState) {
      setContent(postEditingState.content);
      setCategory(postEditingState.category);
      setPostImage(postEditingState.postImage);
      setFormValues(postEditingState.formState, postEditingState.isDirty);
    }
  }
  
  return (
    <div>
    <div className={"col-md-12 form-wrapper"}>
      <h2> Create Post </h2>
      {errorList && <ListErrors errors={errorList} />}
      <form id={"create-post-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
        
        <div className="form-group">
          <div className="row">
            <DropdownButton title="Select Category" onSelect={handleCategorySelect} className="col-md-2">
                {categories && categories.map((category: ICategory) => 
                (
                  <div key={category.id}>
                    <Dropdown.Item eventKey={category.id}>{category.title}</Dropdown.Item>
                  </div>
                ))
              }
            </DropdownButton>
            <input 
              style={{float: 'right'}}    
              type="text" 
              disabled  
              placeholder="no category selected" 
              {...register('categoryTitle')}
              className={`col-md-2 form-control float-right ${errors.categoryTitle ? 'is-invalid' : ''}`}           
            />
          </div>
          <div className="invalid-feedback">{errors.categoryTitle?.message}</div>
        </div>

        <div className="form-group col-md-4">
          <div className="row">
            <label className="col-md-2"> Image: </label>
            { postImage && 
            (
              <button className="btn btn-secondary col-md-3"  onClick={handleDeleteImage} >
                Delete Image
              </button>
            )  
            }  
            <ImageUpload onImageUpload={handleImageUpload} onImageUploadError={handleImageUploadError} resize={imageMaxSize}/>                
            </div>
        </div>

        <div className="form-group col-md-12">
          {PostImage()}
          <br/>
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

        {!editingContent && (
          <div>
            <div className="form-group col-md-12">
              <label htmlFor="body"> Content </label>
              <div>
                <textarea 
                  readOnly 
                  placeholder="Content must not be empty, user Edit button to edit the content"
                  {...register('body')}
                  className={`form-control ${errors.body ? 'is-invalid' : ''}`} 
                />
                <div className="invalid-feedback">{errors.body?.message}</div>
              </div>
            </div>
            <div className="form-group col-md-7">
              <div className="row">
                <button className="btn btn-secondary"  onClick={handleEditContent} >
                    Edit Content
                </button>  
                {content && (
                  <div className="col-md-6">
                    <Link to="/post/content" state={getPostEditingState()}>
                      <button type="button" className="btn btn-secondary col-md-3">
                        View Content
                      </button>
                    </Link>                     
                  </div>  
                )}
              </div> 
            </div>
          </div>
        )         
        }
        {editingContent && (
          <EditPostContent content={getValues('body')} onSaveContent={setPostContent} onCancelEditing={onCancelContentEditing}/>
        ) 
        }
        <br/>
        <div className="row">
          <div className="col-lg-10 col-md-12">
            <div className="form-group row-md-5 pull-right">
                <CancelButton prompt={isDirty} message={cancelCreatePostMessage()} onClick={handleCancelCreatePost} className="btn ml-2 btn-danger">Cancel</CancelButton>
                <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={handleClearCreatePost} >
                  Clear
                </button>
                {isLoading &&
                  <span className="fa fa-circle-o-notch fa-spin" />
                }
                <button className="btn ml-2 btn-success"  disabled={!isDirty} onClick={handleSubmitForm}>
                  Create
                </button>
                {isLoading &&
                  <span className="fa fa-circle-o-notch fa-spin" />
                }
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  );
}
export default CreatePost
