import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card } from 'react-bootstrap';
import { IPost, ImageSizeProps, ImageData } from "../../types";
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';

type ViewBlogCardProps = React.HTMLProps<HTMLElement> & {
  post: IPost,
  defaultPostImage: ImageData,
  onViewBlog: onViewBlog,
}

export type onViewBlog = (postId: string) => void;

const ViewBlogCard: React.FC<ViewBlogCardProps> = ({className, post, defaultPostImage, onViewBlog}) => {

  const imageMaxSize: ImageSizeProps = {maxWidth:120, maxHeight:120};

  const PostImage = () => {
    if(post.image) {
      return <ImageResize imageData={post.image} resize={imageMaxSize}/>;
    }  else {
      return  defaultPostImage && <Image imageData={defaultPostImage}/> 
    }
  }

  const onClickCard = () => {
    onViewBlog(post.id!);
  }

  return (  
    <div className="view-blog-card">  
      <Container>  
          <Card style={{ width: '12.5rem',  cursor: "pointer" }} onClick={onClickCard} >  
            <Card.Body>
              <Card.Header>
                <h5>{post.user?.username}</h5>
                {PostImage()}
              </Card.Header> 
              <Card.Title>
                <h6>{post.title}</h6>
              </Card.Title>
            </Card.Body>  
          </Card>  
      </Container>  
    </div>  
  );  
};

export default ViewBlogCard;