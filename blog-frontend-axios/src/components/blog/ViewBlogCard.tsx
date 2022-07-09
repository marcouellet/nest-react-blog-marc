import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card } from 'react-bootstrap';
import { IPost, ImageSizeProps, ImageData } from "../../types";
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';
import DisplayModalButton from '../common/displayModal';
import ViewUserInfo from '../user/ViewUserInfo';

type ViewBlogCardProps = React.HTMLProps<HTMLElement> & {
  post: IPost,
  defaultPostImage: ImageData,
  defaultUserImage: ImageData,
  onViewBlog: onViewBlog,
}

export type onViewBlog = (postId: string) => void;

const ViewBlogCard: React.FC<ViewBlogCardProps> = ({className, post, defaultPostImage, defaultUserImage, onViewBlog}) => {

  const imageMaxSize: ImageSizeProps = {maxWidth:120, maxHeight:120};

  const PostImage = () => {
    if(post.image) {
      return <ImageResize imageData={post.image} resize={imageMaxSize} className="blog-content-image"/>;
    }  else {
      return  defaultPostImage && <Image imageData={defaultPostImage} className="blog-content-image"/> 
    }
  }

  const onClickCard = () => {
    onViewBlog(post.id!);
  }

  const modalContent =                     
    (
      <div>
        <ViewUserInfo user={post.user!} defaultUserImage={defaultUserImage}/>
      </div>
    );

  return (  
    <div className="view-blog-card">  
      <Container>  
          <Card style={{width: '12.5rem'}} >  
            <Card.Body>
              <Card.Header>
                {/* <h5>{post.user?.username}</h5> */}
                <DisplayModalButton className="display-user-info-button" contentToDisplay={modalContent}>{post.user?.username}</DisplayModalButton>
                <div style={{cursor:"zoom-in", marginTop: "1rem"}} onClick={onClickCard}>
                  {PostImage()}
                </div>
              </Card.Header> 
              <Card.Title>
                <div >
                <h6>{post.title}</h6>
                </div>
              </Card.Title>
            </Card.Body>  
          </Card>  
      </Container>  
    </div>  
  );  
};

export default ViewBlogCard;