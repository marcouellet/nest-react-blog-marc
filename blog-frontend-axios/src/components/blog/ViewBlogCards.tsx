import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import { CardDeck } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { ImageData } from "@blog-common/interfaces";
import { PostDto } from "@blog-common/dtos";

import ViewBlogCard, { onViewBlog } from './ViewBlogCard';

type ViewBlogCardsProps = React.HTMLProps<HTMLElement> & {
  posts: PostDto[],
  defaultPostImage: ImageData,
  defaultUserImage: ImageData,
}

const ViewPostCards: React.FC<ViewBlogCardsProps> = ({className, posts, defaultPostImage, defaultUserImage}) => {

  const navigate = useNavigate();

  const handleViewBlog: onViewBlog = (postId: string)=>{
    navigate(`/blog/${postId}`);
  }

  return (  
    <CardDeck style={{display: 'flex', flexDirection: 'row'}}>
      {
        posts && posts.map((post: PostDto) =>    
        (
          <div key={post.id}>
            <ViewBlogCard 
              style={{flex: 1}} 
              post={post} 
              defaultPostImage={defaultPostImage}   
              defaultUserImage={defaultUserImage} 
              onViewBlog={handleViewBlog}
            />
          </div>
        ))
      }
    </CardDeck>
  );  
};

export default ViewPostCards;