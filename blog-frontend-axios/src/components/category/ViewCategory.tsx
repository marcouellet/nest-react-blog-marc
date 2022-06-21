import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ICategory } from "../../types";
import { toast } from "react-toastify";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';

const ViewCategory = () => {

  const { categoryId } = useParams<{ categoryId: string }>();
  const { state: { isLoading }, dispatch } = useAuth();
  const [category, setCategory] = useState<ICategory>();
  const [errors, setErrors] = React.useState<IErrors | null>();

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

export default ViewCategory;