import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IPost } from "../../types";
import { PostApiService } from "../../services/api/PostApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';

const Post = () => {

  const { postId } = useParams<{ postId: string }>();
  const { dispatch } = useAuth();
  const [post, setPost] = useState<IPost>();
  const [errors, setErrors] = React.useState<IErrors | null>();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      dispatch(createActionLoading(true));
      await PostApiService.getPostById(Number.parseInt(postId!))
      .then((post) => setPost(post.data))
      .catch((error) => handleFetchPostError(error))
      dispatch(createActionLoading(false));
    }
    fetchData();
  }, [postId, dispatch]);

  const handleFetchPostError = (error: any) => {
    console.log(error);
    setErrors(error.data.errors);
  }

    return (
        <section className="post-area">
        {errors && <ListErrors errors={errors} />}
        <div className="container">
          <div className="row">
            <div className="col-lg-1 col-md-0" />
            <div className="col-lg-10 col-md-12">
              {post && 
                <div className="main-post">
                  <div className="post-top-area">
                    <h5 className="pre-title">Nest React Blog</h5>
                    <h3 className="title">
                      <span>
                        <b>{post.title}</b>
                      </span>
                    </h3>

                    <p className="para">
                      {post.body}
                    </p>
                  </div>
                </div>              
              }
            </div>

          </div>
        </div>
      </section>
    );
}

export default Post;