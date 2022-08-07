import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { CategoryApiService } from "../../services/api/CategoryApiService";
import { ICategory, UserRole } from "../../types";
import useSessionContext from '../../contexts/session.context';
import useUIContext from '../../contexts/ui.context';
import { createActionSessionExpired } from '../../reducers/session.reducer';
import { createActionLoading } from '../../reducers/ui.reducer';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';

const ListCategories = () => {
  
  const { sessionState: { user, isAuthenticated }, dispatchSession } = useSessionContext();
  const { uiState: { isLoading }, dispatchUI } = useUIContext();

  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const [categories, setCategorys] = useState<ICategory[]>([]);

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  useEffect(() => {
    (async () => {
      const fetchCategories = async (): Promise<void> => {
        dispatchUI(createActionLoading(true));
        CategoryApiService.getAllCategories()
          .then(cats => setCategorys(cats))
          .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Categories reading'))
          .finally(() => dispatchUI(createActionLoading(false)));
      }
      await fetchCategories();
    })().finally(() => dispatchUI(createActionLoading(false))); 
  // eslint-disable-next-line 
  }, [])

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

  return (
    <section className="blog-area section">
      {errorList && <ListErrors errors={errorList} />}
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
