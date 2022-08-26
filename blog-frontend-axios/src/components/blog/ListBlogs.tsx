import React, { useState, useLayoutEffect } from 'react';
import { toast } from "react-toastify";
import { DropdownButton, Dropdown, Container } from 'react-bootstrap';

import { CategoryApiService, PostApiService } from '@Services';
import { IPost, ICategory, IErrors, ImageSizeProps, ImageData } from '@Types';
import { ListErrors } from '@Common';
import { useUIContext, useSessionContext } from '@Contexts';
import { createActionSessionExpired, createActionLoading, createActionSetCategoryFilter, 
        createActionSetPostTitleFilter } from '@Reducers';
import { checkUnauthorized, checkSessionExpired, checkTimeout, resizeImage } from '@Utils';

import ViewBlogCards from './ViewBlogCards';

const ListBlogs = () => {

  const { sessionState: { user }, dispatchSession } = useSessionContext();
  const { uiState: { isLoading, categoryFilter, postTitleFilter }, dispatchUI } = useUIContext();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const [category, setCategory] = useState<ICategory>();
  const [categoryTitle, setCategoryTitle] = useState<string>('All');
  const [postDefaultImage, setpostDefaultImage] = useState<ImageData>();
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();

  const imageMaxSize: ImageSizeProps = {maxWidth:120, maxHeight:120}

  useLayoutEffect(() => {
    (async () => {
      // alert('listBlogs useEffet called');
      dispatchUI(createActionLoading(true));
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
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Categories reading'));
        }
      await fetchCategories();  
    })().finally(() => dispatchUI(createActionLoading(false)));
 // eslint-disable-next-line
  }, []);

  useLayoutEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      if (category) {
        dispatchUI(createActionLoading(true));
        if ( category.id === 'all') {
          await PostApiService.findManyPosts(postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Posts reading'));
        } 
        else if (category.id === 'no_category') {
          await PostApiService.findManyPostsWithoutCategory(postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Posts reading'));
        } 
        else {
          await PostApiService.findManyPostsForCategory(category.id!, postTitleFilter)
          .then(posts => setPosts(posts))
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Posts reading'));
        }
        dispatchUI(createActionLoading(false));
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

  const handleCategorySelect=(e: any)=>{
    selectCategory(categories!, e, true);
  }

  const selectCategory = (categories: ICategory[], categoryId: string, setDirty: boolean)=>{
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
              className="float-right col-md-2"   
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
