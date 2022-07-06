import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelButton from '../common/cancelConfirmation'
import { IPost, IUpdatePost, ICategory, createPostForUpdate, minimumPostTitleLength, minimumPostDescriptionLength,
          ImageSizeProps } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { IErrors, ImageData } from '../../types';
import { checkUnauthorized, checkForbidden } from '../../utils/html.response.utils';
import { createActionSessionExpired } from '../../reducers/auth';
import Image from '../common/Image';
import ImageUpload from '../common/ImageUpload';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';
import EditPostContent from './EditPostContent';

const EditPost = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [postImage, setPostImage] = useState<ImageData>();
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();
  const [content, setContent] = useState<string>();
  const [editingContent, setEditingContent] = useState<boolean>();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumPostTitleLength, `Title must be at least ${minimumPostTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumPostDescriptionLength, `Description must be at least ${minimumPostDescriptionLength} characters long`),
    body: Yup.string().required('Content is required'),
    categoryTitle: Yup.string(),
    imageChanged: Yup.bool(),
  });

  type UpdateSubmitForm = {
    categoryTitle: string;
    title: string;
    description: string;
    body: string;
    imageChanged: boolean;
  };

  const defaultValues = {categoryTitle: '', title: post?.title, description: post?.description, body: post?.body,
                          imageChanged: false};

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
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
        await CategoryApiService.getAllCategories()
          .then(categories => {
            const noCategory: ICategory = {id:'no_category', title: 'No category', description: ''};
            allCategories = [noCategory].concat(categories);
            setCategories(allCategories);
            selectCategory(allCategories, 'no_category', false);
          })
          .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors));
        }
        fetchCategories();
      }
      if (!post) {
        const fetchPost = async (): Promise<void> => {
          await getDefaultPostImage()
          .then(imageData => { setpostDefaultImage(imageData);})
          .catch(error => {
            throw new Error(error);
          });  
          await PostApiService.getPostById(postId!)
          .then(post => { 
            setPost(post); 
            reset(post);
            if (post?.category) {
              selectCategory(allCategories, post.category.id!, false);
            }
            register('body');
            setContent(post.body);
          })
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        }
        await fetchPost();
      }
      dispatch(createActionLoading(false));

    })();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setImageData(post?.image);
  // eslint-disable-next-line
  }, [post]);

  const getDefaultPostImage = (): Promise<ImageData> => {
    return resizeImage('/default-post-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const PostImage = (post: IPost) => {
    if(postImage) {
      return <ImageResize imageData={postImage} resize={imageMaxSize}/>;
    }  else {
      return  postDefaultImage && <Image imageData={postDefaultImage}/> 
    }
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:200, maxHeight:200}

  const onSubmit = async (data: UpdateSubmitForm) => {
    if (post && isDirty) {
      dispatch(createActionLoading(true));
      const image = postImage;
      const postData: IUpdatePost = createPostForUpdate({...post, ...data, image, category});
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
    navigate(`/post/${post?.id}`);
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

const handleEditContent = () => {
  setEditingContent(true);
}

const handleCategorySelect=(e: any)=>{
  selectCategory(categories!, e, true);
}

const setPostContent = (value: string) => {
  setValue('body', value, { shouldDirty: true, shouldValidate: true });
  if (!value) {
    setError('body', {message: 'Content must not be empty, user Edit button to add some content'});
  }
  setContent(value);
  setEditingContent(false);
}

const onCancelContentEditing = () => {
  setEditingContent(false);
}

const selectCategory = (categories: ICategory[], categoryId: string, setDirty: boolean)=>{
  const category = categories.find(category => category.id === categoryId);
  setCategory(category?.id === 'no_category' ? undefined: category);
  setValue('categoryTitle', category!.title, { shouldDirty: setDirty });
}

const handleCancelEditPost = () => {
  navigate(`/post/${post?.id}`);   
};

const handleImageUpload = (image: ImageData) => {
  setImageData(image);
}

const handleImageUploadError = (error: any) => {
  toast.error(`User image upload failed`);
}

const handleDeleteImage = () => {
  setImageData(undefined);
}

const setImageData = (image: ImageData | undefined) => {
  const isImageDefined = image !== undefined;
  const isInitialImageDefined = post?.image !== undefined;
  const imageChanged = (isImageDefined !== isInitialImageDefined) ||
                        (isImageDefined && image?.base64 !== post?.image?.base64);
  setValue('imageChanged', imageChanged, {shouldDirty: true});
  setPostImage(image);
}

  return (
    <div className={'page-wrapper'}>
    {post &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit Post  </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"create-post-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <div className="form-group col-md-8">
              <div className="row">
                <DropdownButton title="Select Category" onSelect={handleCategorySelect} className="col-md-2">
                    {categories && categories.map((category: ICategory) => 
                    (
                      <Dropdown.Item eventKey={category.id}>{category.title}</Dropdown.Item>
                    ))
                  }
                </DropdownButton>
                <input    
                  type="text" disabled  placeholder="no category selected" 
                  {...register('categoryTitle')}
                  className={`col-md-2 form-control float-right ${errors.categoryTitle ? 'is-invalid' : ''}`}           
                />
                </div>
              <div className="invalid-feedback">{errors.categoryTitle?.message}</div>
            </div>

            <div className="form-group col-md-4">
              <div className="row">
                <label className="col-md-2"> Image: </label>
                { postImage && (
                  <button className="btn btn-secondary col-md-3"  onClick={ () => handleDeleteImage() } >
                    Delete Image
                  </button>
                )  
                }   
                <ImageUpload onImageUpload={handleImageUpload} onImageUploadError={handleImageUploadError} resize={imageMaxSize}/>                     
              </div>
            </div>

            <div className="form-group col-md-12">
              {PostImage(post)}
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

            {!editingContent && (
              <div>
                <div className="form-group col-md-12">
                  <label htmlFor="body"> Content </label>
                  {content !== undefined && (
                    <div>
                    <textarea 
                      readOnly 
                      className="col-md-12"
                      placeholder="Content must not be empty, user Edit button to edit the content"
                    >
                      {content}
                    </textarea> 
                    {errors && errors.body && (
                    <div>
                      <div style={{color: 'red'}}>{errors.body?.message}</div>
                    </div>
                    )
                    }
                  </div>
                  )}
                </div>

                <div className="form-group col-md-4">
                  <button className="btn btn-secondary col-md-3"  onClick={ () => handleEditContent() } >
                      Edit Content
                  </button>  
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                </div> 
              </div>
            )         
            }
            {editingContent && (
              <EditPostContent content={getValues('body')} onSaveContent={setPostContent} onCancelEditing={onCancelContentEditing}/>
            ) 
            }
          </form>

          <div className="row">
            <div className="col-lg-10 col-md-12">
              <div className="form-group row-md-5 pull-right">
                  {
                    <CancelButton prompt={isDirty} message={cancelEditPostMessage()} onClick={() => handleCancelEditPost()} className="btn ml-2 btn-danger">Cancel</CancelButton>
                  }
                  <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={ () => handleResetEditPost() } >
                    Reset
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                  <button className="btn ml-2 btn-success"  disabled={!isDirty} type="submit">
                    Update
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
              </div>
            </div>
          </div>
        </div>
      )
    }
  </div>
  )
}

export default EditPost;