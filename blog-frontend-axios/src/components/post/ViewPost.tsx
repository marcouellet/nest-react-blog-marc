import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IPost } from "../../types";
import { toast } from "react-toastify";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { toLocalDateString } from '../../utils/utils';

const ViewPost = () => {

  const { postId } = useParams<{ postId: string }>();
  const { dispatch } = useAuth();
  const [post, setPost] = useState<IPost>();
  const [errors, setErrors] = React.useState<IErrors | null>();

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
    setErrors(apiErrors);
  }

  const getDateString = (date: Date): string => {
    if (date) {
      return toLocalDateString(date)!;
    } else {
      return "no date provided"
    }
  }

    return (
        <section className="post-area">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div className="row">
            <div className="col-lg-1 col-md-0" />
            <div className="col-lg-10 col-md-12">
              {post && 
              (
                <div className="main-post">
                  <div className="post-top-area">
                    <h5 className="pre-title">This post belongs to: {post.user!.username}</h5>
                      <div>
                        <br/>
                        <h4 className="title">
                          <span>
                            Date posted:&nbsp;{getDateString(post.publishDate!)}
                          </span>
                        </h4>
                        <br/>
                       <h4 className="title">
                          <span>
                            Title:
                          </span>
                        </h4>
                        <h5>{post.title}</h5>
                        <br/>
                        <h4 className="description">
                          <span>
                            Description:
                          </span>
                        </h4>
                        <h5>{post.description}</h5>
                        <br/>
                        <h4 className="body">
                          <span>
                            Detail: 
                          </span>
                          <p className="para">
                            {post.body}
                          </p>
                        </h4>
                       </div>
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

export default ViewPost;