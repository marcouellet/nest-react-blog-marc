import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { PostApiService } from "../services/api/PostApiService";
import { IPost } from "../models/post";
import { usePassport } from '../contexts/passport-context';
//import { useAuth0 } from '../contexts/auth0-context';

function Home(): JSX.Element {
  let history = useHistory()
  const { isAuthenticated, getIdTokenClaims, user } = usePassport();

  const [posts, setPosts] = useState<IPost[]>([]);

  const deletePost = async(id: number) => {
    //const accessToken = await getIdTokenClaims();
    await PostApiService.deletePost(id);
    _removePostFromView(id);
    history.push('/');
  }

  const _removePostFromView = (id: number) => {
    const index = posts.findIndex((post: { id: number; }) => post.id === id);
    posts.splice(index, 1);
  }

  useEffect(() => {
    const fetchPosts = async (): Promise<any> => {
      const posts = await PostApiService.getAllPosts();
      setPosts(posts.data);
    }
    fetchPosts();
  }, [])

    return (
        <section className="blog-area section">
        <div className="container">
          <div className="row">
            {posts && posts.map((post: IPost) => (
              <div className="col-lg-4 col-md-6" key={post.id}>
              <div className="card h-100">
                <div className="single-post post-style-1">

                  <div className="blog-image">
                    <img src="https://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1563149789/blog-image_psvipq.jpg" alt="Blog" />
                  </div>

                  <span className="avatar">
                    <img src="http://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1513770253/WEB_FREAK_50PX-01_yaqxg7.png" alt="Profile" />
                  </span>

                  <div className="blog-info">

                    <h4 className="title">
                      <span>
                        <b>{post.title}</b>
                      </span>
                    </h4>
                  </div>
                </div>

                <ul className="post-footer">
                  <li>
                    <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline-secondary">View Post </Link>
                  </li>
                  <li>
                    {
                      isAuthenticated && (user.email === post.user.email) &&
                      <Link to={`/post/edit/${post.id}`} className="btn btn-sm btn-outline-secondary">Edit Post </Link>
                    }
                  </li>
                  <li>
                    {
                      isAuthenticated && (user.email === post.user.email) &&
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => deletePost(post.id)}>Delete Post</button>
                    }
                  </li>
                </ul>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default Home;
