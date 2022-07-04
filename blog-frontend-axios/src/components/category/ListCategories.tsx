import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { ICategory, UserRole } from "../../types";
import useAuth from '../../contexts/auth';
import { createActionLoading } from '../../reducers/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';

const ListCategories = () => {
  
  const { state: { user, isAuthenticated, isLoading}, dispatch } = useAuth();

  const [errors, setErrors] = React.useState<IErrors | null>();

  const [categories, setCategorys] = useState<ICategory[]>([]);

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      dispatch(createActionLoading(true));
      CategoryApiService.getAllCategories()
        .then(users => setCategorys(users))
        .catch((apiErrors: IErrors) => handleFetchCategoriesError(apiErrors))
      dispatch(createActionLoading(false));
    }
    fetchCategories();
  }, [dispatch])

  const handleFetchCategoriesError = (apiErrors: IErrors) => {
    toast.error(`Categories reading failed, see error list`);
    setErrors(apiErrors);
  }

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
              <th className="col-md-2">
                Name
              </th>
              <th className="col-md-10">
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
                    {category.title}
                  </td>
                  <td>
                    {category.description}
                  </td>
                  <td>
                    <Link to={`/category/${category.id}`} className="btn btn-sm btn-info">View</Link>                  
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
