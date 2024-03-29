import React, { useState, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { IErrors } from "types";
import { PostApiService } from "services/api";
import { useUIContext, useSessionContext } from 'contexts';
import { DisplayContent, ListErrors } from 'components/common';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from 'utils';
import { createActionSessionExpired, createActionLoading } from 'reducers';
import { PostDto } from "shared/dtos";

const ViewBlog = () => {

  const { postId } = useParams<{ postId: string }>();
  const { dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [post, setPost] = useState<PostDto>();
  const [errorList, setErrorList] = useState<IErrors | null>();

  const navigate = useNavigate();

  useLayoutEffect(() => {
    (async () => {
      // alert('ViewBlog useEffet called');
      const fetchData = async (): Promise<void> => {
        dispatchUI(createActionLoading(true));
        await PostApiService.getPostById(postId!)
        .then((post) => setPost(post))
        .catch((apiErrors: IErrors) => handleApiErrors(apiErrors,'Post reading'))
        .finally(() => dispatchUI(createActionLoading(false)));
      }
      await fetchData(); 
   })().finally(() => dispatchUI(createActionLoading(false))); 
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