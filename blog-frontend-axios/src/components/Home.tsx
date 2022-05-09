import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { PostApiService } from "../services/api/PostApiService";
import { IPost } from "../types";
import useAuth from '../contexts/auth';
import { createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { IErrors } from '../types';

const Home = () => {
  
  const navigate = useNavigate();

  const { state, dispatch } = useAuth();

  const [errors, setErrors] = React.useState<IErrors | null>();

  const [posts, setPosts] = useState<IPost[]>([]);

  const _removePostFromView = (id: string) => {
    const index = posts.findIndex((post: IPost) => post.id! === id);
    posts.splice(index, 1);
  }

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
    toast.error(`Post delete failed, see error list`);
    setErrors(apiErrors);
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

                  <div className="blog-image">
                    <img src="https://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1563149789/blog-image_psvipq.jpg" alt="Blog" />
                  </div>

                  <span className="avatar">
                    <img src="http://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1513770253/WEB_FREAK_50PX-01_yaqxg7.png" alt="Profile" />
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
                  <li>
                    {
                      !state.isLoading && <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline-secondary">View Post </Link>
                    }
                  </li>
                  <li>
                    {
                      state.isAuthenticated && !state.isLoading && (state.user!.email === post.user!.email) &&
                      <Link to={`/post/edit/${post.id}`} className="btn btn-sm btn-outline-secondary">Edit Post </Link>
                    }
                  </li>
                  <li>
                    {
                      state.isAuthenticated && !state.isLoading && (state.user!.email === post.user!.email) &&
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDeletePost(post.id!)}>Delete Post</button>
                    }
                  </li>
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
