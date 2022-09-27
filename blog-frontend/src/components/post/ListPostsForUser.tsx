import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { DropdownButton, Dropdown, Table, Container } from 'react-bootstrap';

import { PostApiService, CategoryApiService } from 'services/api';
import { useUIContext, useSessionContext } from 'contexts';
import { createActionSessionExpired, createActionLoading, createActionSetCategoryFilter, 
        createActionSetPostTitleFilter } from 'reducers';
import { ListErrors, ImageResize, Image } from 'components/common';
import { IErrors, ImageSizeProps } from 'types';
import { PostDto, CategoryDto } from "shared/dtos";
import { checkUnauthorized, checkSessionExpired, checkTimeout, resizeImage } from 'utils';
import { ImageData } from "shared/interfaces";

const ListPostsForUser = () => {

  const { sessionState: { user, isAuthenticated }, dispatchSession } = useSessionContext();
  const { uiState: { isLoading, categoryFilter, postTitleFilter }, dispatchUI } = useUIContext();
  const [errorList, setErrorList] = useState<IErrors | null>();
  const [selectedPosts, setSelectedPosts] = useState<PostDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>();
  const [category, setCategory] = useState<CategoryDto>();
  const [categoryTitle, setCategoryTitle] = useState<string>('All');
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();

  useEffect(() => {
    (async () => {
      // alert('ListPostsForUser useEffet called');
      const fetchCategories = async (): Promise<void> => {
      await CategoryApiService.getAllCategories()
        .then(categories => {
          const all: CategoryDto = {id:'all', title: 'All', description: ''};
          const noCategory: CategoryDto = {id:'no_category', title: 'No category', description: ''};
          const allCategories = [all, noCategory].concat(categories);
          setCategories(allCategories);
          if (categoryFilter) {
            selectCategory(allCategories, categoryFilter.id!, false);
          } else {
            selectCategory(allCategories, 'all', false);
          }            
        })
        .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors))
      }
      await fetchCategories();
    })().finally(() => dispatchUI(createActionLoading(false)));
 // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      dispatchUI(createActionLoading(true));
      await getDefaultPostImage()
      .then(imageData => { setpostDefaultImage(imageData);})
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => dispatchUI(createActionLoading(false)));
      if (category) {
        dispatchUI(createActionLoading(true));
        let fetchedPosts: PostDto[] = [];
        await PostApiService.finManyPostsForUser(user!.id!, postTitleFilter)
        .then(posts => fetchedPosts = posts)
        .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors))
        .finally(() => dispatchUI(createActionLoading(false)));
        if ( category.id === 'all') {
          setSelectedPosts(fetchedPosts);
        } 
        else if (category.id === 'no_category') {
          setSelectedPosts(fetchedPosts.filter(post => !post.category));
        } 
        else {
          setSelectedPosts(fetchedPosts.filter(post => post.category && post.category.id === (category.id)));
        }
      }
    }
    fetchPosts();
  // eslint-disable-next-line
  }, [category, postTitleFilter, user])

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

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors, 'Categories reading');
  }

  const handleFetchPostError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors, 'Post reading');
  }

  const getDefaultPostImage = (): Promise<ImageData> => {
    return resizeImage('/default-post-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const PostImage = (post: PostDto) => {
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

  const selectCategory = (categories: CategoryDto[], categoryId: string, setDirty: boolean)=>{
    const category = categories?.find(category => category.id === categoryId);
    setCategoryTitle(category!.title!);
    setCategory(category);
    dispatchUI(createActionSetCategoryFilter(category!));
  }

  const handlePostTitleFilterChange = (filter: string)=>{
    dispatchUI(createActionSetPostTitleFilter(filter));
  }

  return (
    <section className="blog-area section">
      {errorList && <ListErrors errors={errorList} />}
      <Container  className="col-md-10">
        <div className="form-group ">
          <div className="row">
            <DropdownButton title="Select Category" onSelect={handleCategorySelect} className="col-md-2">
                {categories && categories.map((category: CategoryDto) => 
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
          !isLoading && selectedPosts && selectedPosts.map((post: PostDto) =>    
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
                  <th className="col-md-2">
                      Category
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
                  {post.category ? post.category.title : 'No category assigned'}
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

export default ListPostsForUser;
