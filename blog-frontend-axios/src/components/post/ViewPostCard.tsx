import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card, Button} from 'react-bootstrap';
import { IPost, ImageSizeProps } from "../../types";
import ImageResize from '../common/ImageResize';
import { resizeImage } from '../../utils/image.utils';

type ViewCardProps = React.HTMLProps<HTMLElement> & {
  post: IPost,
  onViewPostDetail: onViewPostDetail,
}

export type onViewPostDetail = (postId: string) => void;

const ViewPostCard: React.FC<ViewCardProps> = ({className, post, onViewPostDetail}) => {

  const imageMaxSize: ImageSizeProps = {maxWidth:260, maxHeight:260};

  return (  
    <div className="ViewCard">  
      <Container className='p-4'>  
          <Card>  
            {/* <Card.Img variant="top" src={post.image?.data} />   */}
            <Card.Body className="image-container">
              <Card.Header>
                <span>{post.user?.username}</span>
              </Card.Header> 
              { post.image && <ImageResize imageData={post.image} resize={imageMaxSize}/> }
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

export default ViewPostCard;