import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DropdownButton, Dropdown } from 'react-bootstrap';

import { CancelButton, ListErrors, Image, ImageUpload, ImageResize } from 'components/common';
import { ImageSizeProps, IErrors, IPostEditingFormState, IPostEditingState } from 'types';
import { minimumPostTitleLength,  minimumPostDescriptionLength, } from "shared/entities";
import { PostApiService, CategoryApiService } from "services/api";
import { createActionSessionExpired, createActionLoading } from 'reducers';
import { useUIContext, useSessionContext } from 'contexts';
import { checkUnauthorized, checkSessionExpired, checkTimeout, resizeImage } from 'utils';
import { PostDto, UpdatePostDto, CategoryDto } from "shared/dtos";
import { createPostForUpdate } from "shared/builders";
import { ImageData } from "shared/interfaces";

import EditPostContent from './EditPostContent';

const EditPost = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [errorList, setErrorList] = useState<IErrors | null>();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDto>();
  const [categories, setCategories] = useState<CategoryDto[]>();
  const [category, setCategory] = useState<CategoryDto>();
  const [postImage, setPostImage] = useState<ImageData>();
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();
  const [editingContent, setEditingContent] = useState<boolean>();
  const [content, setContent] = useState<string>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumPostTitleLength, `Title must be at least ${minimumPostTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumPostDescriptionLength, `Description must be at least ${minimumPostDescriptionLength} characters long`),
    body: Yup.string().required('Content is required'),
    categoryTitle: Yup.string(),
    imageChanged: Yup.bool(),
  });

  const defaultValues = {categoryTitle: '', title: post?.title, description: post?.description, body: post?.body,
                          imageChanged: false};

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty }
  } = useForm<IPostEditingFormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    (async () => {
      // alert('EditPost useEffet called');
      dispatchUI(createActionLoading(true));
      let allCategories: CategoryDto[];
      const fetchCategories = async (): Promise<void> => {
        CategoryApiService.getAllCategories()
          .then(categories => {
            const noCategory: CategoryDto = {id:'no_category', title: 'No category', description: ''};
            allCategories = [noCategory].concat(categories);
            setCategories(allCategories);
            selectCategory(allCategories, 'no_category', false);
          })
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors, 'Categories reading'))
      }
      await fetchCategories(); // must wait since allCategories required by fetchPost

      const fetchPost = async (): Promise<void> => {
        await getDefaultPostImage()
          .then(imageData => { setpostDefaultImage(imageData);})
          .catch(error => {
            throw new Error(error);
          })
        await PostApiService.getPostById(postId!)
          .then(post => { 
          setContent(post.body);
          setPost(post); 
          reset(post);
          if (post.category) {
            selectCategory(allCategories, post.category.id!, false);
          }
        })
        .catch((apiErrors: IErrors) => handleApiErrors(apiErrors, 'Post reading'))
      }
      await fetchPost();

      if (location.state) {
        restorePostEditingState(location.state as any);
      }
    })().finally(() => dispatchUI(createActionLoading(false)));
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setImageData(post?.image);
  // eslint-disable-next-line
  }, [post]);

  const getDefaultPostImage = (): Promise<ImageData> => {
    return resizeImage('/default-post-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const PostImage = (post: PostDto) => {
    if(postImage) {
      return <ImageResize imageData={postImage} resize={imageMaxSize}/>;
    }  else {
      return  postDefaultImage && <Image imageData={postDefaultImage}/> 
    }
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:400, maxHeight:400}

  const onSubmit = async (data: IPostEditingFormState) => {
    if (post && isDirty && submitForm) {
      dispatchUI(createActionLoading(true));
      const image = postImage;
      const postData: UpdatePostDto = createPostForUpdate({...post, ...data, image, category});
      await PostApiService.updatePost(post.id!, postData)
      .then(() => { handleSubmitFormSuccess(); })
      .catch((apiErrors: IErrors) =>  { handleApiErrors(apiErrors, 'Post update') })
      .finally(() => dispatchUI(createActionLoading(false)));
     }
  } 

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatchSession(createActionSessionExpired());
      navigate(`/post/${post?.id}`);
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const handleSubmitFormSuccess = () => {
    toast.success(`Post updated successfully...`);
    navigate(`/post/${post?.id}`);
  }

  const cancelEditPostMessage = () => `post edition and loose changes`;

  const handleResetEditPost = () => {
    setPostContent(post!.body, false);
    if (post?.category) {
      selectCategory(categories!, post.category.id!, false);
    } else {
      selectCategory(categories!, 'no_category', false);
    }
    setImageData(post?.image);
    reset(post);
  }

  const handleEditContent = () => {
    setEditingContent(true);
  }

  const handleCategorySelect=(e: any)=>{
    selectCategory(categories!, e, true);
  }

  const setPostContent = (value: string, shouldDirty: boolean = true) => {
    setValue('body', value, { shouldDirty: shouldDirty, shouldValidate: false });
    setContent(value);
    setEditingContent(false);
  }

  const onCancelContentEditing = () => {
    setEditingContent(false);
  }

  const selectCategory = (categories: CategoryDto[], categoryId: string, setDirty: boolean)=>{
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

  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const setImageData = (image: ImageData | undefined) => {
    const isImageDefined = image !== undefined;
    const isInitialImageDefined = post?.image !== undefined;
    const imageChanged = (isImageDefined !== isInitialImageDefined) ||
                          (isImageDefined && image?.base64 !== post?.image?.base64);
    setValue('imageChanged', imageChanged, {shouldDirty: true});
    setPostImage(image);
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

  const setFormValues = (formState: IPostEditingFormState, isDirty: boolean) => {
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
    <div className={'page-wrapper'}>
    {post &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit Post  </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"edit-post-form"} onSubmit={handleSubmit(onSubmit)} noValidate={false}>
            <div className="form-group col-md-8">
              <div className="row">
                <DropdownButton title="Select Category" onSelect={handleCategorySelect} className="col-md-2">
                    {categories && categories.map((category: CategoryDto) => 
                    (
                      <div key={category.id}>
                       <Dropdown.Item eventKey={category.id}>{category.title}</Dropdown.Item>
                      </div>
                    ))
                  }
                </DropdownButton>
                <input    
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
                { postImage && (
                  <button className="btn btn-secondary col-md-3"  onClick={handleDeleteImage} >
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
            <div className="row">
              <div className="col-lg-10 col-md-12">
                <div className="form-group row-md-5 pull-right">
                    <CancelButton prompt={isDirty} message={cancelEditPostMessage()} onClick={handleCancelEditPost} className="btn ml-2 btn-danger">Cancel</CancelButton>
                    <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={handleResetEditPost} >
                      Reset
                    </button>
                    <button className="btn ml-2 btn-success"  disabled={!isDirty} onClick={handleSubmitForm}>
                      Update
                    </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    }
  </div>
  )
}

export default EditPost;