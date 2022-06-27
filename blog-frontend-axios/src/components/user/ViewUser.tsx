import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IUser } from "../../types";
import { toast } from "react-toastify";
import { UserApiService } from "../../services/api/UserApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { toLocalDateString } from '../../utils/local.storage.utils';

const ViewUser = () => {

  const { userId } = useParams<{ userId: string }>();
  const { state: { isLoading }, dispatch } = useAuth();
  const [user, setUser] = useState<IUser>();
  const [errors, setErrors] = React.useState<IErrors | null>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await UserApiService.getUserById(userId!)
        .then(user => setUser(user))
        .catch((apiErrors: IErrors) => handleFetchUserError(apiErrors))
        dispatch(createActionLoading(false));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

  const handleFetchUserError = (apiErrors: IErrors) => {
    toast.error(`User reading failed, see error list`);
    setErrors(apiErrors);
  }

  const handleReturn = () => {
    navigate('/user');  
  }

    return (
        <section className="user-area">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div className="row">
            <div className="col-lg-1 col-md-0" />
            <div className="col-lg-10 col-md-12">
              {user && 
              (
                <div className="main-user">
                  <div className="user-top-area">
                      <div>
                        { user.createdOn &&
                          <h5 className="createdOn">
                            <span>
                              <b>Created on {toLocalDateString(user.createdOn)}</b>
                            </span>
                            <br/> 
                          </h5>                        
                        }
                        <br/>
                         <h4 className="username">
                          <span>
                            Name:
                          </span>
                        </h4>
                        <h5>{user.username}</h5>
                        <br/>
                        <h4 className="email">
                          <span>
                            Email:
                          </span>
                        </h4>
                        <h5>{user.email}</h5>
                        <br/>
                        <h4 className="role">
                          <span>
                            Role: 
                          </span>
                         </h4>
                        <h5>{user.role}</h5>
                       </div>
                  </div>
                  <div className="form-group col-md-1 pull-right">
                    <button className="btn btn-secondary"  onClick={ () => handleReturn() } >
                      Return
                    </button>
                    {isLoading &&
                      <span className="fa fa-circle-o-notch fa-spin" />
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

export default ViewUser;