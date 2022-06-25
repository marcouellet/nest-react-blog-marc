import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card, Button} from 'react-bootstrap';
import { IPost } from "../../types";

type ViewCardProps = React.HTMLProps<HTMLElement> & {
  post: IPost,
  onViewPostDetail: onViewPostDetail,
}

export type onViewPostDetail = (postId: string) => void;

const ViewCard: React.FC<ViewCardProps> = ({className, post, onViewPostDetail}) => {

  return (  
    <div className="ViewCard">  
      <Container className='p-4'>  
          <Card>  
            {/* <Card.Img variant="top" src={post.image?.data} />   */}
            <Card.Body>
              <Card.Header>
                <span>{post.user?.username}</span>
              </Card.Header> 
              <Card.Title>
                <br/>
                {post.title}
              </Card.Title>
              <Card.Subtitle>
                <br/>
                <span>Description:</span> 
              </Card.Subtitle>    
              <Card.Text>
                <br/>
                {post.description}
              </Card.Text>  
              <Button className={className} onClick={() => onViewPostDetail(post.id!)}>View</Button>  
            </Card.Body>  
          </Card>  
      </Container>  
    </div>  
  );  
};

export default ViewCard;