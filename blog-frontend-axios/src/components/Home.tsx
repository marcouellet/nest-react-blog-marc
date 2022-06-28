import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { PostApiService } from "../services/api/PostApiService";
import { CategoryApiService } from "../services/api/CategoryApiService";
import { IPost } from "../types";
import useAuth from '../contexts/auth';
import { createActionLoading } from '../reducers/auth';
import ListErrors from './common/ListErrors';
import { ICategory, IErrors } from '../types';
import ViewPostCard, { onViewPostDetail } from './post/ViewPostCard';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { createActionSetCategoryFilter, createActionSetPostTitleFilter } from '../reducers/auth';

const Home = () => {
  
  const navigate = useNavigate();

  const { state, dispatch } = useAuth();
  const [errors, setErrors] = React.useState<IErrors | null>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [categoryTitle, setCategoryTitle] = useState<string>('All');
  const [postTitleFilter, setPostTitleFilter] = useState<string>('');

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
      setPostTitleFilter(state.postTitleFilter);
      dispatch(createActionLoading(false));
    })();
 // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      if (category) {
        if ( category.id === 'all') {
          PostApiService.findManyPosts(postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        } 
        else if (category.id === 'no_category') {
          PostApiService.findManyPostsWithoutCategory(postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        } 
        else {
          PostApiService.findManyPostsForCategory(category.id!, postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        }
      }
    }
    fetchPosts();
  }, [category, postTitleFilter])

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    setErrors(apiErrors);
    toast.error(`Categories reading failed, see error list`);
  }

  const handleFetchPostError = (apiErrors: IErrors) => {
    setErrors(apiErrors);
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

  const handlePostTitleFilterChange = (filter: string)=>{
    setPostTitleFilter(filter);
    dispatch(createActionSetPostTitleFilter(filter));
  }

  const handleViewCardDetail: onViewPostDetail = (postId: string)=>{
    navigate(`/post/${postId}`);
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
            <input style={ {float: 'right'} } className="col-md-2"   
              type="text" disabled  placeholder="no category selected" value={categoryTitle}        
            />
            <h4 className="col-md-1">
              <span>
                Filter:
              </span>
            </h4>
            <input  
              type="text" name="postTitleFilter" value={postTitleFilter} placeholder="enter some part of post title text" 
              className="col-md-2" onChange={e => handlePostTitleFilterChange(e.target.value)}      
            />
          </div>
        </div>
        <div className="container">
          <div className="row">
            {posts && posts.map((post: IPost) => (
              <div className="col-lg-4 col-md-6" key={post.id}>
                <ViewPostCard post={post} onViewPostDetail={handleViewCardDetail}/>
            </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default Home;
