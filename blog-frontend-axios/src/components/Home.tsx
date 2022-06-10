import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { PostApiService } from "../services/api/PostApiService";
import { IPost, UserRole } from "../types";
import useAuth from '../contexts/auth';
import { createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { IErrors } from '../types';
import DeleteButton from './common/deleteConfirmation'
import { checkForbidden } from '../utils/response';
import { createActionSessionExpired } from '../reducers/auth';

const Home = () => {
  
  const navigate = useNavigate();

  const { state, dispatch } = useAuth();

  const [errors, setErrors] = React.useState<IErrors | null>();

  const [posts, setPosts] = useState<IPost[]>([]);

  const _removePostFromView = (id: string) => {
    const index = posts.findIndex((post: IPost) => post.id! === id);
    posts.splice(index, 1);
  }

  const isAdministrator = () => state.isAuthenticated && state.user?.role === UserRole.ADMIN;

  const deletePostMessage = (post: IPost) => `${post.title} post`;

  const handleDeletePost = async (id: string) => {
    dispatch(createActionLoading(true));
    await PostApiService.deletePost(id)
     .then(() => handleDeletePostSucess())
     .catch((apiErrors: IErrors) => handleDeletePostError(apiErrors))
    dispatch(createActionLoading(false));
    _removePostFromView(id);
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
    } else {
      toast.error(`Post delete failed, see error list`);
      setErrors(apiErrors);      
    }
  }

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      PostApiService.getAllPosts()
        .then(posts => setPosts(posts));
    }
    fetchPosts();
  }, [])

    return (
        <section className="blog-area section">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div className="row">
            {posts && posts.map((post: IPost) => (
              <div className="col-lg-4 col-md-6" key={post.id}>
              <div className="card h-100">
                <div className="single-post post-style-1">
                  <span className="avatar">
                    <span>
                     <h4>User: {post.user!.username} </h4> 
                    </span>
                  </span>

                  <div className="blog-info">

                    <h4 className="title">
                      <span>
                        <b>{post.title}</b>
                      </span>
                    </h4>
                  </div>
                </div>

                <ul className="post-footer">
                  {
                    !state.isLoading &&
                    (
                      <li>
                      {
                        <p>
                          <Link to={`/post/${post.id}`} className="btn btn-sm btn-info">View Post</Link>
                        </p>
                      }
                      </li>
                    )
                  }
                  {
                    state.isAuthenticated && !state.isLoading && (isAdministrator() || state.user!.email === post.user!.email) &&
                    (
                      <li>
                      {
                        <p>
                          <Link to={`/post/edit/${post.id}`} className="btn btn-sm btn-primary">Edit Post</Link>
                        </p>
                      }
                      </li>
                    )
                  }
                  {
                    state.isAuthenticated && !state.isLoading && (isAdministrator() || state.user!.email === post.user!.email) && 
                    (                   
                      <li>
                      {
                        <DeleteButton message={deletePostMessage(post)} onClick={() => handleDeletePost(post.id!)} className="btn btn-danger">Delete</DeleteButton>
                      }
                      </li>
                    )
                  }
                </ul>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default Home;
