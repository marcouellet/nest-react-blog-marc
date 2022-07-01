import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { ICategory, UserRole } from "../../types";
import useAuth from '../../contexts/auth';
import { createActionLoading } from '../../reducers/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import DeleteButton from '../common/deleteConfirmation'
import { checkUnauthorized } from '../../utils/html.response.utils';
import { createActionSessionExpired } from '../../reducers/auth';
import { PostApiService } from '../../services/api/PostApiService';

const ListCategories = () => {
  
  const navigate = useNavigate();

  const { state: { user, isAuthenticated, isLoading}, dispatch } = useAuth();

  const [errors, setErrors] = React.useState<IErrors | null>();

  const [categories, setCategorys] = useState<ICategory[]>([]);

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

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
      dispatch(createActionLoading(true));
      CategoryApiService.getAllCategories()
        .then(users => setCategorys(users));
      dispatch(createActionLoading(false));
    }
    fetchCategories();
  }, [dispatch])

  return (
    <section className="blog-area section">
      {errors && <ListErrors errors={errors} />}
      <div className="container">
        <div>
          {
            isAdministrator() && !isLoading && 
            (
                <Link to={`/category/create`} className="btn btn-sm btn-primary">Create Category</Link>
            )
          }
        </div>
        <br/>
        <div>
          <Table striped bordered hover>
            <thead>
              <th className="col-md-3">
                Name
              </th>
              <th className="col-md-15">
                Description
              </th>
              <th className="col-md-2">
                Actions
              </th>
            </thead>
            {
              categories && categories.map((category: ICategory) => 
              (
                <tr key={category.id}>
                  <td>
                    <b>{category.title}</b>
                  </td>
                  <td>
                    <b>{category.description}</b>
                  </td>
                  <td>
                    <div className="row">
                      {
                          !isLoading &&
                          (
                            <p>
                              <Link to={`/category/${category.id}`} className="btn btn-sm btn-info">View</Link>
                            </p>
                          )
                      }
                      {
                        isAdministrator() && !isLoading && 
                        (
                            <Link to={`/category/edit/${category.id}`} className="btn btn-sm btn-primary">Edit</Link> 
                        )              
                      }
                      {
                        isAdministrator() && !isLoading &&  
                        (                   
                            <DeleteButton message={deleteCategoryMessage(category)} onClick={() => handleDeleteCategory(category.id!)} 
                              className="btn btn-sm btn-danger">Delete</DeleteButton>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))
            }
          </Table>
        </div>
      </div>
    </section>
    );
}

export default ListCategories;
