import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { CategoryApiService } from "services/api";
import { IErrors } from 'types';
import { useUIContext, useSessionContext } from 'contexts';
import { createActionSessionExpired, createActionLoading } from 'reducers';
import { ListErrors } from 'components/common';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from 'utils';
import { CategoryDto } from "shared/dtos";
import { UserRole } from "shared/enum";

const ListCategories = () => {
  
  const { sessionState: { user, isAuthenticated }, dispatchSession } = useSessionContext();
  const { uiState: { isLoading }, dispatchUI } = useUIContext();

  const [errorList, setErrorList] = useState<IErrors | null>();

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  useEffect(() => {
    (async () => {
      // alert('ListCategories useEffet called');
      const fetchCategories = async (): Promise<void> => {
        dispatchUI(createActionLoading(true));
        CategoryApiService.getAllCategories()
          .then(cats => setCategories(cats))
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
              categories && categories.map((category: CategoryDto) => 
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
