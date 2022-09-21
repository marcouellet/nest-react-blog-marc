import React from 'react';
import {Container ,Card } from 'react-bootstrap';

import { ImageSizeProps } from "types";
import { Image, ImageResize, DisplayModalButton, DisplayTooltip } from 'components/common';
import { PostDto } from "shared/dtos";
import { ImageData } from "shared/interfaces";

import ViewUserInfo from '../user/ViewUserInfo';


type ViewBlogCardProps = React.HTMLProps<HTMLElement> & {
  post: PostDto,
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

  const PostFullSizeImage = () => {
    if(post.image) {
      return <Image imageData={post.image} className="blog-content-image"/>;
    }  else {
      return  defaultPostImage && <Image imageData={defaultPostImage} className="blog-content-image"/> 
    }
  }

  const onClickCard = () => {
    onViewBlog(post.id!);
  }

  const userInfo =                     
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
                <div className="row">
                  <DisplayTooltip toolTip="Display post content">
                    <button style={{ border: "none", outline:"none", backgroundColor: "transparent" }}>
                      <img 
                        className="post-image"
                        src="/consult.ico"
                        alt="content icon not found" 
                        onClick={onClickCard}
                      /> 
                    </button>
                  </DisplayTooltip>
   
                  <DisplayModalButton  
                    toolTip="Display user info"
                    className="display-user-info-button" 
                    contentToDisplay={userInfo}
                  >
                      {post.user?.username}               
                  </DisplayModalButton> 
                </div>  
                <DisplayModalButton  
                    toolTip="Display post image"
                    className="display-post-image-button" 
                    contentToDisplay={PostFullSizeImage()}
                >
                  {PostImage()}            
                </DisplayModalButton>       
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