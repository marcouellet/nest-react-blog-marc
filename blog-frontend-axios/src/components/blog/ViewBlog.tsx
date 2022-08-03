import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { IPost, IErrors } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import useSessionContext from '../../contexts/session.context';
import useUIContext from '../../contexts/ui.context';
import DisplayContent from '../common/displayContent';
import ListErrors from '../common/ListErrors';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';
import { createActionSessionExpired } from '../../reducers/session.reducer';
import { createActionLoading } from '../../reducers/ui.reducer';

const ViewBlog = () => {

  const { postId } = useParams<{ postId: string }>();
  const { dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [post, setPost] = useState<IPost>();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!post) {
      const fetchData = async (): Promise<void> => {
        dispatchUI(createActionLoading(true));
        await PostApiService.getPostById(postId!)
        .then((post) => setPost(post))
        .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Post reading'))
        .finally(() => dispatchUI(createActionLoading(false)));
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

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

  const handleReturn = () => {
    navigate(-1);
  }

    return (
      <div className="container-fluid">
        {post && 
        (
          <div className="view-blog">
            <div className="row">
              <DisplayContent content={post.body} onClose={handleReturn}/>         
            </div>
          </div>
        )
        }
        <div className="row">
          {errorList && <ListErrors errors={errorList} />}
        </div>
      </div>
    );
}

export default ViewBlog;