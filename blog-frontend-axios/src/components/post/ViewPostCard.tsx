import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card, Button} from 'react-bootstrap';
import { IPost, ImageSizeProps } from "../../types";
import ImageResize from '../common/ImageResize';

type ViewCardProps = React.HTMLProps<HTMLElement> & {
  post: IPost,
  onViewPostDetail: onViewPostDetail,
}

export type onViewPostDetail = (postId: string) => void;

const ViewPostCard: React.FC<ViewCardProps> = ({className, post, onViewPostDetail}) => {

  const imageMaxSize: ImageSizeProps = {maxWidth:120, maxHeight:90};

  return (  
    <div className="ViewCard">  
      <Container className='p-4'>  
          <Card>  
            <Card.Body className="image-container">
              <Card.Header>
                <h5>{post.user?.username}</h5>
                {post.image && <ImageResize imageData={post.image} resize={imageMaxSize}/>}
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
                <Button onClick={() => onViewPostDetail(post.id!)}>View</Button>
            </Card.Body>  
          </Card>  
      </Container>  
    </div>  
  );  
};

export default ViewPostCard;