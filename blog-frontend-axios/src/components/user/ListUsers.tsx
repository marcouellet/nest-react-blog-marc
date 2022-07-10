import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import useAuth from '../../contexts/auth';
import { resizeImage } from '../../utils/image.utils';
import { createActionLoading, createActionSetUserNameFilter, createActionSessionExpired } from '../../reducers/auth';
import ListErrors from '../common/ListErrors';
import { IUser, IErrors, ImageSizeProps, ImageData } from '../../types';
import { UserApiService } from "../../services/api/UserApiService";
import { Table, Container } from 'react-bootstrap';
import ImageResize from '../common/ImageResize';
import Image from '../common/Image';
import { checkUnauthorized, checkSessionExpired } from '../../utils/html.response.utils';

const ListUsers = () => {

  const { state: { user, isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [userNameFilter, setuserNameFilter] = useState<string>('');
  const [userDefaultImage, setuserDefaultImage] = useState<ImageData>();

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      dispatch(createActionLoading(true));
      await UserApiService.findManyUsers(userNameFilter)
        .then(users => setUsers(users))
        .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors));
      await getDefaultUserImage()
        .then(imageData => { setuserDefaultImage(imageData);})
        .catch(error => {
          throw new Error(error);
        }) 
      dispatch(createActionLoading(false));
    }
    fetchUsers();
    // eslint-disable-next-line
  }, [user, userNameFilter])
 
  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatch(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const handleFetchUserError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'Users reading');
  }

  const handleUserNameFilterChange = (filter: string)=>{
    setuserNameFilter(filter);
    dispatch(createActionSetUserNameFilter(filter));
  }

  const getDefaultUserImage = (): Promise<ImageData> => {
    return resizeImage('/default-profil-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const UserImage = (user: IUser) => {
    if(user.image) {
      return <ImageResize imageData={user.image} resize={imageMaxSize}/>;
    }  else {
      return  userDefaultImage && <Image imageData={userDefaultImage}/> 
    }
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:40, maxHeight:40};

  return (
    <section className="blog-area section">
      {errorList && <ListErrors errors={errorList} />}
      <Container  className="col-md-10">
        <div className="form-group ">
          <div className="row">
            <h4 className="col-md-1">
              <span>
                Filter:
              </span>
            </h4>
            <input  
              type="text" 
              name="userNameFilter" 
              value={userNameFilter} 
              placeholder="enter some part of user name text" 
              className="col-md-3" 
              onChange={e => handleUserNameFilterChange(e.target.value)}      
            />
            <div className="col-md-2 pull-right">
              {
                !isLoading && 
                (
                  <Link to={`/user/create`} className="btn btn-sm btn-primary">Create User</Link>
                )
              }
            </div>
          </div>
        <br/>
        </div>
        {
          !isLoading && users && users.map((user: IUser) =>    
          (
            <div key={user.id}>
              <Table striped bordered hover>
                <thead>
                  <th className="col-auto"/>
                  <th className="col-md-2">
                      Name
                  </th>
                  <th className="col-md-2">
                      Email
                  </th>
                  <th className="col-md-10">
                    Role
                  </th>
                  <th className="col-md-2">
                    Actions
                  </th>
                </thead>
                <tr>
                  <td>
                    {UserImage(user)}
                  </td>
                  <td>
                      {user.username}
                  </td>
                  <td>
                      {user.email}
                  </td>
                  <td>
                      {user.role}
                  </td>
                  <td>
                      <Link to={`/User/${user.id}`} className="btn btn-sm btn-info">View</Link>
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

export default ListUsers;
