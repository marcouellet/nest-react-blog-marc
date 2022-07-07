import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {CardDeck } from 'react-bootstrap';
import { IPost, ImageData } from "../../types";
import { useNavigate } from 'react-router-dom';
import ViewBlogCard, { onViewBlog } from './ViewBlogCard';

type ViewBlogCardsProps = React.HTMLProps<HTMLElement> & {
  posts: IPost[],
  defaultPostImage: ImageData
}

const ViewPostCards: React.FC<ViewBlogCardsProps> = ({className, posts, defaultPostImage}) => {

  const navigate = useNavigate();

  const handleViewBlog: onViewBlog = (postId: string)=>{
    navigate(`/blog/${postId}`);
  }

  return (  
    <CardDeck style={{display: 'flex', flexDirection: 'row'}}>
      {
        posts && posts.map((post: IPost) =>    
        (
          <div className="col-lg-4 col-md-4" key={post.id}>
            <ViewBlogCard style={{flex: 1}} post={post} defaultPostImage={defaultPostImage} className={className} onViewBlog={handleViewBlog}/>
          </div>
        ))
      }
    </CardDeck>
  );  
};

export default ViewPostCards;