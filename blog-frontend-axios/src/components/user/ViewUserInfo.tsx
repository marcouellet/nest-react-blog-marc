import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import { Container } from 'react-bootstrap';
import { IUser, ImageSizeProps, ImageData } from "../../types";
import Image from '../common/Image';
import ImageResize from '../common/ImageResize';

type ViewUserInfoProps = React.HTMLProps<HTMLElement> & {
  user: IUser,
  defaultUserImage: ImageData,
}

const ViewUserInfo: React.FC<ViewUserInfoProps> = ({className, user, defaultUserImage}) => {

  const imageMaxSize: ImageSizeProps = {maxWidth:400, maxHeight:400};

  const UserImage = () => {
    if(user.image) {
      return <ImageResize imageData={user.image} resize={imageMaxSize}/>;
    }  else {
      return  defaultUserImage && <Image imageData={defaultUserImage}/> 
    }
  }

  return (  
    <div className="view-user-info">  
      <Container>  
        <div className="row">
          <div className="col-md-8">
            {UserImage()}
          </div>
        </div>        
        <div className="row">
          <div className="col-md-8">
            <h5 className="username">
              <span>
                Name:
              </span>
            </h5>
            <h6>{user.username}</h6>
            <h5 className="email">
              <span>
                Email:
              </span>
            </h5>
            <h6>{user.email}</h6>
          </div>
        </div>
      </Container>  
    </div>  
  );  
};

export default ViewUserInfo;