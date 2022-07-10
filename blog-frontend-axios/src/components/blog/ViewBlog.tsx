import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IPost } from "../../types";
import { toast } from "react-toastify";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';

const ViewBlog = () => {

  const { postId } = useParams<{ postId: string }>();
  const { state: { isLoading }, dispatch } = useAuth();
  const [post, setPost] = useState<IPost>();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!post) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await PostApiService.getPostById(postId!)
        .then((post) => setPost(post))
        .catch((apiErrors: IErrors) => handleFetchPostError(apiErrors))
        dispatch(createActionLoading(false));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

  const handleFetchPostError = (apiErrors: IErrors) => {
    toast.error(`Post reading failed, see error list`);
    setErrorList(apiErrors);
  }

  const handleReturn = () => {
    navigate('/blog');
  }

    return (
      <div className="container-fluid">
        {post && 
        (
          <div className="view-blog">
            <div className="row">
              <div dangerouslySetInnerHTML={{__html: post.body}} />           
            </div>
            <div className="row">
              <div className="col-lg-10 col-md-12">
                <div className="form-group row-md-6 pull-right">
                  <button className="btn ml-2 btn-secondary"  onClick={ () => handleReturn() } >
                    Return
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                 </div>
              </div>
            </div>
            <div className="row">
                {errorList && <ListErrors errors={errorList} />}
            </div>
          </div>
        )
        }
      </div>
    );
}

export default ViewBlog;