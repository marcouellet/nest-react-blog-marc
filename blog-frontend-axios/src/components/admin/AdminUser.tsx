import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApiService } from "../../services/api/UserApiService";
import { IUser } from "../../types";
import useAuth from '../../contexts/auth';
import ViewUserCard, { onViewUserDetail } from '../user/ViewUserCard';

const AdminUser = () => {
  
  const navigate = useNavigate();

  const { state: { isLoading, isAuthenticated } } = useAuth();

  const [users, setUsers] = useState<IUser[]>([]);

  const handleViewCardDetail: onViewUserDetail = (userId: string)=>{
    navigate(`/user/${userId}`);
  }

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      UserApiService.getAllUsers()
        .then(users => setUsers(users));
    }
    fetchUsers();
  }, [])

    return (
        <section className="blog-area section">
        <div className="container">
          <div>
            {
              isAuthenticated && !isLoading && 
              (
                <Link to={`/user/create`} className="btn btn-sm btn-primary">Create User</Link>
              )
            }
          </div>
          <br/>
          <div className="row">
            {users && users.map((user: IUser) => (
              <div className="col-lg-4 col-md-6" key={user.id}>
                <ViewUserCard user={user} onViewUserDetail={handleViewCardDetail}/>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default AdminUser;
