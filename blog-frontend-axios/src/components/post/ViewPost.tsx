import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IPost, UserRole } from "../../types";
import { toast } from "react-toastify";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading, createActionSessionExpired } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, ImageData, ImageSizeProps } from '../../types';
import { toLocalDateString } from '../../utils/local.storage.utils';
import { checkUnauthorized, checkForbidden } from '../../utils/html.response.utils';
import DeleteButton from '../common/deleteConfirmation';
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';

const ViewPost = () => {

  const { postId } = useParams<{ postId: string }>();
  const { state: { isLoading, isAuthenticated, user }, dispatch } = useAuth();
  const [post, setPost] = useState<IPost>();
  const [errors, setErrors] = React.useState<IErrors | null>();
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();

  const navigate = useNavigate();

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;
  const deletePostMessage = (post: IPost) => `${post.title} post`;

  useEffect(() => {
    if (!post) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await getDefaultPostImage()
        .then(imageData => { setpostDefaultImage(imageData);})
        .catch(error => {
          throw new Error(error);
        }); 
        await PostApiService.getPostById(postId!)
        .then((post) => setPost(post))
        .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors))
        dispatch(createActionLoading(false));
      }
      fetchData();  
    }
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

  const parseHtml = (html: string) => {
    return ReactHtmlParser(html);
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:200, maxHeight:200}
  
  const handleDeletePost = async (id: string) => {
    dispatch(createActionLoading(true));
    await PostApiService.deletePost(id)
     .then(() => handleDeletePostSucess())
     .catch((apiErrors: IErrors) => handleDeletePostError(apiErrors))
    dispatch(createActionLoading(false));
    navigate('/');
  }
  const handleDeletePostSucess = () => {
    toast.success(`Post deleted successfully...`);
  }

  const handleDeletePostError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Post delete failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/'); 
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else {
      toast.error(`Post delete failed, see error list`);
      setErrors(apiErrors);      
    }
  }

  const handleFetchPostError = (apiErrors: IErrors) => {
    toast.error(`Post reading failed, see error list`);
    setErrors(apiErrors);
  }

  const handleReturn = () => {
    navigate('/post');  
  }

  const getDateString = (date: Date): string => {
    if (date) {
      return toLocalDateString(date)!;
    } else {
      return "no date provided"
    }
  }

    return (
      //   <section className="post-area">
      //   {errors && <ListErrors errors={errors} />}
      //   <div className="container">
      //     <div className="row">
      //       <div className="col-lg-1 col-md-0" />
      //       <div className="col-lg-10 col-md-12">
      //         {post && 
      //         (
      //           <div className="main-post">
      //             <div className="post-top-area">
      //               {PostImage(post)}
      //                <h5 className="pre-title">This post belongs to: {post.user!.username}</h5>
      //               <div>
      //                 <br/>
      //                 <h4 className="title">
      //                   <span>
      //                     Date posted:&nbsp;{getDateString(post.publishDate!)}
      //                   </span>
      //                 </h4>
      //                 <br/>
      //                 <h4 className="category">
      //                   <span>
      //                     Category:
      //                   </span>
      //                 </h4>
      //                 <h5>{post.category ? post.category.title : 'No category assigned'}</h5>
      //                 <br/>
      //                 <h4 className="title">
      //                   <span>
      //                     Title:
      //                   </span>
      //                 </h4>
      //                 <h5>{post.title}</h5>
      //                 <br/>
      //                 <h4 className="description">
      //                   <span>
      //                     Description:
      //                   </span>
      //                 </h4>
      //                 <h5>{post.description}</h5>
      //                 <br/>
      //                 <h4 className="body">
      //                   <p className="para">
      //                     {post.body}
      //                   </p>
      //                 </h4>
      //               </div>
      //             </div>
      //             <div className="form-group row-md-2 pull-right">
      //               <button className="btn ml-2 btn-secondary"  onClick={ () => handleReturn() } >
      //                 Return
      //               </button>
      //               {isLoading &&
      //                 <span className="fa fa-circle-o-notch fa-spin" />
      //               }
      //               {isAuthenticated && !isLoading && (isAdministrator() || user!.email === post.user!.email) &&
      //                 (
      //                   <Link to={`/post/edit/${post.id}`} className="btn ml-2 btn-primary">Edit Post</Link>                  
      //                 )
      //               }
      //               {isAuthenticated && !isLoading && (isAdministrator() || user!.email === post.user!.email) && 
      //                 (               
      //                     <DeleteButton message={deletePostMessage(post)} onClick={() => handleDeletePost(post.id!)} className="btn ml-2 btn-danger">Delete</DeleteButton>
      //                 )
      //               }
      //             </div>
      //           </div>               
      //           )           
      //         }
      //       </div>
      //     </div>
      //   </div>
      // </section>

      <div className="Home"> 
        <div className="container-fluid">
          {post && 
          (
            <div>
              <div className="row">
                <div className="col-md-4">
                  {PostImage(post)}
                </div>
                <div className="col-md-7">
                  <h4 className="date">
                    <span>
                      Date posted:&nbsp;{getDateString(post.publishDate!)}
                    </span>
                  </h4>
                  <br/>
                  <h4 className="title">
                    <span>
                      Title:&nbsp;{post.title}
                    </span>
                  </h4>
                  <br/>
                  <h4 className="category">
                    <span>
                      Category:&nbsp;{post.category ? post.category.title : 'No category assigned'}
                    </span>
                  </h4>
                  <br/>
                </div>
              </div>
              <div className="row">
                <p className="para">
                  {parseHtml(post.body)}
                </p>                
              </div>
              <div className="row">
                <div className="form-group row-md-2 pull-right">
                  <button className="btn ml-2 btn-secondary"  onClick={ () => handleReturn() } >
                     Return
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                  {isAuthenticated && !isLoading && (isAdministrator() || user!.email === post.user!.email) &&
                    (
                      <Link to={`/post/edit/${post.id}`} className="btn ml-2 btn-primary">Edit Post</Link>                  
                    )
                  }
                  {isAuthenticated && !isLoading && (isAdministrator() || user!.email === post.user!.email) && 
                    (               
                      <DeleteButton message={deletePostMessage(post)} onClick={() => handleDeletePost(post.id!)} className="btn ml-2 btn-danger">Delete</DeleteButton>
                    )
                  }
                </div>
              </div>
              <div className="row">
                {errors && <ListErrors errors={errors} />}
              </div>
            </div>
          )
          }
        </div>
      </div>
    );
}

export default ViewPost;