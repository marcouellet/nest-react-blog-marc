import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { IPost, UserRole } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionSessionExpired } from '../../reducers/session.reducer';
import { createActionLoading } from '../../reducers/ui.reducer';
import useSessionContext from '../../contexts/session.context';
import useUIContext from '../../contexts/ui.context';
import ListErrors from '../common/ListErrors';
import { IErrors, ImageData, ImageSizeProps } from '../../types';
import { toLocalDateString } from '../../utils/local.storage.utils';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';
import DeleteButton from '../common/deleteConfirmation';
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';

const ViewPost = () => {

  const { postId } = useParams<{ postId: string }>();
  const { sessionState: { isAuthenticated, user }, dispatchSession } = useSessionContext();
  const { uiState: { isLoading }, dispatchUI } = useUIContext();
  const [post, setPost] = useState<IPost>();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();

  const navigate = useNavigate();

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;
  const deletePostMessage = (post: IPost) => `${post.title} post`;

  useEffect(() => {
    (async () => {
      const fetchData = async (): Promise<void> => {
        dispatchUI(createActionLoading(true));
        await getDefaultPostImage()
        .then(imageData => { setpostDefaultImage(imageData);})
        .catch(error => {
          throw new Error(error);
        })
        .finally(() => dispatchUI(createActionLoading(false))); 
        await PostApiService.getPostById(postId!)
        .then((post) => setPost(post))
        .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors))
      }
      await fetchData();
    })().finally(() => dispatchUI(createActionLoading(false))); 
  // eslint-disable-next-line
  }, []);

  const getDefaultPostImage = (): Promise<ImageData> => {
    return resizeImage('/default-post-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const PostImage = (post: IPost) => {
    if(post.image) {
      return <ImageResize imageData={post.image} resize={imageMaxSize}/>;
    }  else {
      return  postDefaultImage && <Image imageData={postDefaultImage}/> 
    }
  }

  const goBack = () => {
    if (isAdministrator()) {
      navigate('/post');
    } else if (isAuthenticated) {
      navigate('/post/user');
    } else {
      navigate('/');
    }
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:400, maxHeight:400}
  
  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatchSession(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const handleDeletePost = async (id: string) => {
    dispatchUI(createActionLoading(true));
    await PostApiService.deletePost(id)
     .then(() => handleDeletePostSucess())
     .catch((apiErrors: IErrors) => handleDeletePostError(apiErrors))
     dispatchUI(createActionLoading(false));
    goBack();
  }
  const handleDeletePostSucess = () => {
    toast.success(`Post deleted successfully...`);
  }

  const handleDeletePostError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'Post delete');
  }

  const handleFetchPostError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'Post reading');
  }

  const handleViewBlog = ()=>{
    navigate(`/blog/${post!.id}`);
  }

  const handleReturn = () => {
    goBack();  
  }

  const getDateString = (date: Date): string => {
    if (date) {
      return toLocalDateString(date)!;
    } else {
      return "no date provided"
    }
  }

    return (
      <div className="container-fluid">
        {post && 
        (
          <div>
            <div className="row">
              <div className="col-md-4">
                {PostImage(post)}
              </div>
              <div className="col-md-7">
                <h6 className="date">
                  <span>
                    Date posted:&nbsp;{getDateString(post.publishDate!)}
                  </span>
                </h6>
                <br/>
                <h6 className="title">
                  <span>
                    Title:&nbsp;{post.title}
                  </span>
                </h6>
                <br/>
                <h6 className="category">
                  <span>
                    Category:&nbsp;{post.category ? post.category.title : 'No category assigned'}
                  </span>
                </h6>
                <br/>
                <h6 className="description">
                  <span>
                    Description:&nbsp;{post.description}
                  </span>
                </h6>
                <br/>
              </div>
            </div>
            <br/>
            <div className="row">
              <div className="col-lg-10 col-md-12">
                <div className="form-group row-md-6 pull-right">
                  <button className="btn ml-2 btn-secondary" onClick={handleReturn} >
                    Return
                  </button>
                  <button type="button" className="btn ml-2 btn-secondary" onClick={handleViewBlog}>
                    View Content
                  </button>
                  {isAuthenticated && !isLoading && (isAdministrator() || user!.email === post.user!.email) &&
                    (
                      <Link to={`/post/edit/${post.id}`} className="btn ml-2 btn-primary">Edit Post</Link>                  
                    )
                  }
                  {isAuthenticated && !isLoading && (isAdministrator() || user!.email === post.user!.email) && 
                    (               
                      <DeleteButton message={deletePostMessage(post)} onClick={() => handleDeletePost(post.id!)} className="btn ml-2 btn-danger">Delete Post</DeleteButton>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row">
                {errorList && <ListErrors errors={errorList} />}
            </div>
          </div>
        )
        }
      </div>
    );
}

export default ViewPost;