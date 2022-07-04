import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { IPost, ICategory, ImageData } from "../../types";
import useAuth from '../../contexts/auth';
import { createActionLoading } from '../../reducers/auth';
import { resizeImage } from '../../utils/image.utils';
import ListErrors from '../common/ListErrors';
import { IErrors, ImageSizeProps } from '../../types';
import { PostApiService } from '../../services/api/PostApiService';
import { DropdownButton, Dropdown, Table, Container } from 'react-bootstrap';
import { createActionSetCategoryFilter, createActionSetPostTitleFilter } from '../../reducers/auth';
import ImageResize from '../common/ImageResize';
import Image from '../common/Image';

const ListPosts = () => {

  const { state: { user, isLoading, categoryFilter, isAuthenticated }, dispatch } = useAuth();
  const [errors, setErrors] = React.useState<IErrors | null>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [categoryTitle, setCategoryTitle] = useState<string>('All');
  const [postTitleFilter, setPostTitleFilter] = useState<string>('');
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();

  useEffect(() => {
    (async () => {
      dispatch(createActionLoading(true));
      if (!categories) {
        const fetchCategories = async (): Promise<void> => {
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
      await getDefaultPostImage()
      .then(imageData => { setpostDefaultImage(imageData);})
      .catch(error => {
        throw new Error(error);
      });
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
  }, [category, postTitleFilter, user])

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    setErrors(apiErrors);
    toast.error(`Categories reading failed, see error list`);
  }

  const handleFetchPostError = (apiErrors: IErrors) => {
    setErrors(apiErrors);
    toast.error(`Post reading failed, see error list`);
  }

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

  const imageMaxSize: ImageSizeProps = {maxWidth:40, maxHeight:40};

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
      <Container  className="col-md-10">
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
            <div className="col-md-2 pull-right">
              {
                !isLoading && isAuthenticated &&
                (
                  <Link to={`/post/create`} className="btn btn-sm btn-primary">Create Post</Link>
                )
              }
            </div>
          </div>
        </div>
        {
          !isLoading && posts && posts.map((post: IPost) =>    
          (
            <div key={post.id}>
              <Table striped bordered hover>
                <thead>
                  <th className="col-auto"/>
                  <th className="col-md-2">
                      Name
                  </th>
                  <th className="col-md-2">
                      Owner
                  </th>
                  <th className="col-md-10">
                    Description
                  </th>
                  <th className="col-md-2">
                    Actions
                  </th>
                </thead>
                <tr>
                  <td>
                    {PostImage(post)}
                  </td>
                  <td>
                      {post.title}
                  </td>
                  <td>
                      {post.user!.username}
                  </td>
                  <td>
                      {post.description}
                  </td>
                  <td>
                      <Link to={`/post/${post.id}`} className="btn btn-sm btn-info">View</Link>
                  </td>
              </tr>
            </Table>
          </div>
          ))
        }
      </Container>
    </section>
  );
}

export default ListPosts;
