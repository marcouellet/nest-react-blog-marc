import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {CardDeck } from 'react-bootstrap';
import { IPost } from "../../types";
import { useNavigate } from 'react-router-dom';
import ViewPostCard, { onViewPostDetail } from '../post/ViewPostCard';

type ViewPostCardsProps = React.HTMLProps<HTMLElement> & {
  posts: IPost[],
}

const ViewPostCards: React.FC<ViewPostCardsProps> = ({className, posts}) => {

  const navigate = useNavigate();

  const handleViewCardDetail: onViewPostDetail = (postId: string)=>{
    navigate(`/post/${postId}`);
  }

  return (  
    <CardDeck style={{display: 'flex', flexDirection: 'row'}}>
      {
        posts && posts.map((post: IPost) =>    
        (
          <div className="col-lg-4 col-md-4" key={post.id}>
            <ViewPostCard style={{flex: 1}} post={post} className={className} onViewPostDetail={handleViewCardDetail}/>
          </div>
        ))
      }
    </CardDeck>
  );  
};

export default ViewPostCards;