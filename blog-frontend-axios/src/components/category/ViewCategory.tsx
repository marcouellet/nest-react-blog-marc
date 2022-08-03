import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { ICategory } from "../../types";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { PostApiService } from '../../services/api/PostApiService';
import { createActionLoading, createActionSessionExpired } from '../../reducers/session.reducer';
import useSessionContext from '../../contexts/session.context';
import ListErrors from '../common/ListErrors';
import { IErrors, UserRole } from '../../types';
import DeleteButton from '../common/deleteConfirmation';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';

const ViewCategory = () => {

  const { categoryId } = useParams<{ categoryId: string }>();
  const { sessionState: { isLoading, isAuthenticated, user }, dispatchSession } = useSessionContext();
  const [category, setCategory] = useState<ICategory>();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      const fetchData = async (): Promise<void> => {
        dispatchSession(createActionLoading(true));
        await CategoryApiService.getCategoryById(categoryId!)
        .then(user => setCategory(user))
        .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Category reading'))
        .finally(() => dispatchSession(createActionLoading(false)));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

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

  const handleReturn = () => {
    navigate('/category');  
  }

  const deleteCategoryMessage = (category: ICategory) => `${category.title} Category`;

  const handleDeleteCategory = async (id: string) => {
    dispatchSession(createActionLoading(true));
    const postscount = await PostApiService.getNumberOfPostsForCategory(id);
    if (postscount) {
      toast.error(`Category has linked posts, delete them first`);
      dispatchSession(createActionLoading(false));
    } else {
      await CategoryApiService.deleteCategory(id)
      .then(() => handleDeleteCategorySuccess())
      .catch((apiErrors: IErrors) => handleDeleteCategoryError(apiErrors))
      .finally(() => dispatchSession(createActionLoading(false)));
      navigate('/category'); 
    }
  }

  const handleDeleteCategorySuccess = () => {
    toast.success(`Category deleted successfully...`);
  }

  const handleDeleteCategoryError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'Category delete');
  }

    return (
      <div className="container">
        {category && 
        (
          <div>
            <div className="row">
              <div>
                <br/>
                  <h4 className="title">
                  <span>
                    Title:
                  </span>
                </h4>
                <h5>{category.title}</h5>
                <br/>
                <h4 className="description">
                  <span>
                    Description:
                  </span>
                </h4>
                <h5>{category.description}</h5>
              </div>
            </div> 
            <div className="row">
              <div className="col-lg-16 col-md-12">
                <div className="form-group col-md-5 pull-right">
                  <button className="btn ml-2 btn-secondary"  onClick={handleReturn} >
                    Return
                  </button>
                  {!isLoading && isAdministrator() &&
                    (
                      <Link to={`/category/edit/${category.id}`} className="btn ml-2 btn-primary">Edit Category</Link>                  
                    )
                  }
                  {!isLoading && isAdministrator() && 
                    (               
                        <DeleteButton message={deleteCategoryMessage(category)} onClick={() => handleDeleteCategory(category.id!)} className="btn ml-2 btn-danger">Delete Category</DeleteButton>
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

export default ViewCategory;