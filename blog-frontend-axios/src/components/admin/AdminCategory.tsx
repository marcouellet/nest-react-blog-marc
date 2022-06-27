import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { ICategory } from "../../types";
import useAuth from '../../contexts/auth';
import { createActionLoading } from '../../reducers/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import DeleteButton from '../common/deleteConfirmation'
import { checkUnauthorized } from '../../utils/html.response.utils';
import { createActionSessionExpired } from '../../reducers/auth';
import { PostApiService } from '../../services/api/PostApiService';

const AdminCategory = () => {
  
  const navigate = useNavigate();

  const { state, dispatch } = useAuth();

  const [errors, setErrors] = React.useState<IErrors | null>();

  const [categories, setCategorys] = useState<ICategory[]>([]);

  const _removeCategoryFromView = (id: string) => {
    const index = categories.findIndex((category: ICategory) => category.id! === id);
    categories.splice(index, 1);
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
      _removeCategoryFromView(id);
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

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      CategoryApiService.getAllCategories()
        .then(users => setCategorys(users));
    }
    fetchCategories();
  }, [])

    return (
        <section className="blog-area section">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div>
            {
              state.isAuthenticated && !state.isLoading && 
              (
                  <Link to={`/category/create`} className="btn btn-sm btn-primary">Create Category</Link>
              )
            }
          </div>
          <br/>
          <div className="row">
            {categories && categories.map((category: ICategory) => (
              <div className="col-lg-4 col-md-6" key={category.id}>
              <div className="card h-100">
                <div className="single-user user-style-1">

                  <div className="blog-info">

                    <h4 className="title">
                      <span>
                        <b>{category.title}</b>
                      </span>
                    </h4>
                 </div>
                </div>

                <ul className="user-footer">
                  {
                    !state.isLoading &&
                    (
                      <li>
                      {
                        <p>
                          <Link to={`/category/${category.id}`} className="btn btn-sm btn-info">View Category </Link>
                        </p>
                      }
                      </li>
                    )
                  }
                  {
                    state.isAuthenticated && !state.isLoading && 
                    (
                      <li>
                      {
                        <p>
                          <Link to={`/category/edit/${category.id}`} className="btn btn-sm btn-primary">Edit Category</Link>
                        </p>

                      }
                      </li>
                    )
                  }
                  {
                    state.isAuthenticated && !state.isLoading &&  
                    (                   
                      <li>
                      {
                        <DeleteButton message={deleteCategoryMessage(category)} onClick={() => handleDeleteCategory(category.id!)} className="btn btn-danger">Delete Category</DeleteButton>
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

export default AdminCategory;
