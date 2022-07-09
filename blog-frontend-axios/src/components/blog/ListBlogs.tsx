import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { IPost, ICategory } from "../../types";
import useAuth from '../../contexts/auth';
import { createActionLoading } from '../../reducers/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, ImageSizeProps, ImageData } from '../../types';
import { PostApiService } from '../../services/api/PostApiService';
import { DropdownButton, Dropdown, Container } from 'react-bootstrap';
import { createActionSetCategoryFilter, createActionSetPostTitleFilter } from '../../reducers/auth';
import ViewBlogCards from './ViewBlogCards';
import { resizeImage } from '../../utils/image.utils';

const ListBlogs = () => {

  const { state: { user, isLoading, categoryFilter }, dispatch } = useAuth();
  const [errors, setErrors] = React.useState<IErrors | null>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [categoryTitle, setCategoryTitle] = useState<string>('All');
  const [postTitleFilter, setPostTitleFilter] = useState<string>('');
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();

  const imageMaxSize: ImageSizeProps = {maxWidth:120, maxHeight:120}

  useEffect(() => {
    (async () => {
      dispatch(createActionLoading(true));
      if (!categories) {
        const fetchCategories = async (): Promise<void> => {
          await getDefaultPostImage()
          .then(imageData => { setpostDefaultImage(imageData);})
          .catch(error => {
            throw new Error(error);
          });   
          await getDefaultUserImage()
          .then(imageData => { setuserDefaultImage(imageData);})
          .catch(error => {
            throw new Error(error);
          });   
         await CategoryApiService.getAllCategories()
          .then(categories => {
            const all: ICategory = {id:'all', title: 'All', description: ''};
            const noCategory: ICategory = {id:'no_category', title: 'No category', description: ''};
            const allCategories = [all, noCategory].concat(categories);
            setCategories(allCategories);
            if (categoryFilter) {
              selectCategory(allCategories, categoryFilter.id!, false);
            } else {
              selectCategory(allCategories, 'all', false);
            }            
          })
          .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors));
        }
        fetchCategories();
      }
      setPostTitleFilter(postTitleFilter);
      dispatch(createActionLoading(false));
    })();
 // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      if (category) {
        dispatch(createActionLoading(true));
        if ( category.id === 'all') {
          await PostApiService.findManyPosts(postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        } 
        else if (category.id === 'no_category') {
          await PostApiService.findManyPostsWithoutCategory(postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        } 
        else {
          await PostApiService.findManyPostsForCategory(category.id!, postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors));
        }
        dispatch(createActionLoading(false));
      }
    }
    fetchPosts();
  // eslint-disable-next-line
  }, [category, postTitleFilter, user])

  const getDefaultPostImage = (): Promise<ImageData> => {
    return resizeImage('/default-post-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const getDefaultUserImage = (): Promise<ImageData> => {
    return resizeImage('/default-user-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

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

  return (
    <section className="blog-area section">
      {errors && <ListErrors errors={errors} />}
      <Container  className="col-md-12">
        <div className="form-group ">
          <div className="row">
            <DropdownButton title="Select Category" onSelect={handleCategorySelect} className="col-md-2">
                {categories && categories.map((category: ICategory) => 
                (
                  <div key={category.id}>
                    <Dropdown.Item eventKey={category.id}>
                      {category.title}
                    </Dropdown.Item>
                  </div>
                ))
              }
            </DropdownButton>
            <input 
              style={{float: 'right'}} 
              className="col-md-2"   
              type="text" 
              disabled  
              placeholder="no category selected" 
              value={categoryTitle}        
            />
            <h4 className="col-md-1">
              <span>
                Filter:
              </span>
            </h4>
            <input  
              type="text" 
              name="postTitleFilter" 
              value={postTitleFilter} 
              placeholder="enter some part of post title text" 
              className="col-md-2" 
              onChange={e => handlePostTitleFilterChange(e.target.value)}      
            />
          </div>
        </div>
        {!isLoading && posts &&  
        (     
          <div className="row">
            <ViewBlogCards
              className="col-lg-3 col-md-4"
              posts={posts}
              defaultPostImage={postDefaultImage!}
              defaultUserImage={userDefaultImage!}
            /> 
          </div>
        )
        }
      </Container>
    </section>
  );
}

export default ListBlogs;
