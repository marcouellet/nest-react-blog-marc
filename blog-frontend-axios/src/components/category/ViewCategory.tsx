import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ICategory } from "../../types";
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { PostApiService } from '../../services/api/PostApiService';
import { createActionLoading, createActionSessionExpired } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, UserRole } from '../../types';
import DeleteButton from '../common/deleteConfirmation';
import { checkUnauthorized } from '../../utils/html.response.utils';

const ViewCategory = () => {

  const { categoryId } = useParams<{ categoryId: string }>();
  const { state: { isLoading, isAuthenticated, user }, dispatch } = useAuth();
  const [category, setCategory] = useState<ICategory>();
  const [errors, setErrors] = React.useState<IErrors | null>();

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await CategoryApiService.getCategoryById(categoryId!)
        .then(user => setCategory(user))
        .catch((apiErrors: IErrors) => handleFetchCategoryError(apiErrors))
        dispatch(createActionLoading(false));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

  const handleFetchCategoryError = (apiErrors: IErrors) => {
    toast.error(`Category reading failed, see error list`);
    setErrors(apiErrors);
  }

  const handleReturn = () => {
    navigate('/category');  
  }

  const deleteCategoryMessage = (category: ICategory) => `${category.title} Category`;

  const handleDeleteCategory = async (id: string) => {
    dispatch(createActionLoading(true));
    const postscount = await PostApiService.getNumberOfPostsForCategory(id);
    if (postscount) {
      toast.error(`Category has linked posts, delete them first`);
      dispatch(createActionLoading(false));
    } else {
      await CategoryApiService.deleteCategory(id)
      .then(() => handleDeleteCategorySuccess())
      .catch((apiErrors: IErrors) => handleDeleteCategoryError(apiErrors))
      dispatch(createActionLoading(false));
      navigate('/category'); 
    }
  }

  const handleDeleteCategorySuccess = () => {
    toast.success(`Category deleted successfully...`);
  }

  const handleDeleteCategoryError = (apiErrors: IErrors) => {
    if (checkUnauthorized(apiErrors)) {
      toast.error(`Category delete failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/category'); 
    } else {
      toast.error(`Category delete failed, see error list`);
      setErrors(apiErrors);      
    }
  }

    return (
        <section className="user-area">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div className="row">
            <div className="col-lg-1 col-md-0" />
            <div className="col-lg-10 col-md-12">
              {category && 
              (
                <div className="main-user">
                  <div className="user-top-area">
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
                  <div className="form-group col-md-5 pull-right">
                    <button className="btn ml-2 btn-secondary"  onClick={ () => handleReturn() } >
                      Return
                    </button>
                    {isLoading &&
                      <span className="fa fa-circle-o-notch fa-spin" />
                    }
                   {!isLoading && isAdministrator() &&
                      (
                        <Link to={`/category/edit/${category.id}`} className="btn ml-2 btn-primary">Edit Category</Link>                  
                      )
                    }
                    {!isLoading && isAdministrator() && 
                      (               
                          <DeleteButton message={deleteCategoryMessage(category)} onClick={() => handleDeleteCategory(category.id!)} className="btn ml-2 btn-danger">Delete</DeleteButton>
                      )
                    }
                  </div>
                </div>   
                )           
              }
            </div>
          </div>
        </div>
      </section>
    );
}

export default ViewCategory;