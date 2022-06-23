import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { PostApiService } from "../services/api/PostApiService";
import { CategoryApiService } from "../services/api/CategoryApiService";
import { IPost, UserRole } from "../types";
import useAuth from '../contexts/auth';
import { createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { ICategory, IErrors } from '../types';
import DeleteButton from './common/deleteConfirmation';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { checkUnauthorized, checkForbidden } from '../utils/response';
import { createActionSessionExpired, createActionSetCategoryFilter } from '../reducers/auth';

const Home = () => {
  
  const navigate = useNavigate();

  const { state, dispatch } = useAuth();
  const [errors, setErrors] = React.useState<IErrors | null>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [categoryTitle, setCategoryTitle] = useState<string>('All');

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
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else {
      toast.error(`Post delete failed, see error list`);
      setErrors(apiErrors);      
    }
  }

  useEffect(() => {
    (async () => {
      dispatch(createActionLoading(true));
      if (!categories) {
        const fetchCategories = async (): Promise<void> => {
          CategoryApiService.getAllCategories()
          .then(categories => {
            const all: ICategory = {id:'all', title: 'All', description: ''};
            const noCategory: ICategory = {id:'no_category', title: 'No category', description: ''};
            const allCategories = [all, noCategory].concat(categories);
            setCategories(allCategories);
            if (state.categoryFilter) {
              selectCategory(allCategories, state.categoryFilter.id!, false);
            } else {
              selectCategory(allCategories, 'all', false);
            }            
          })
          .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors));
        }
        await fetchCategories();
      }
      if (!posts) {
        const fetchPosts = async (): Promise<void> => {
          PostApiService.getAllPosts()
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        }
        await fetchPosts();
      }
      dispatch(createActionLoading(false));
    })();
 // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      if (category) {
        if ( category.id === 'all') {
          PostApiService.getAllPosts()
          .then(posts => setPosts(posts));
        } 
        else if (category.id === 'no_category') {
          PostApiService.getAllPostsWithoutCategory()
            .then(posts => setPosts(posts));
        } 
        else {
          PostApiService.getAllPostsForCategory(category.id!)
            .then(posts => setPosts(posts));        
        }
      }
    }
    fetchPosts();
  }, [category])

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    toast.error(`Categories reading failed, see error list`);
  }

  const handleFetchPostError = (apiErrors: IErrors) => {
    toast.error(`Post reading failed, see error list`);
  }

  const handleCategorySelect=(e: any)=>{
    selectCategory(categories!, e, true);
  }

  const selectCategory = (categories: ICategory[], categoryId: string, setDirty: boolean)=>{
    const category = categories?.find(category => category.id === categoryId);
    setCategoryTitle(category!.title!);
    setCategory(category);
    dispatch(createActionSetCategoryFilter(category!));
  }

    return (
        <section className="blog-area section">
        {errors && <ListErrors errors={errors} />}
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
              type="text" disabled  placeholder="no category selected" value={categoryTitle}        
            />
          </div>
        </div>

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
