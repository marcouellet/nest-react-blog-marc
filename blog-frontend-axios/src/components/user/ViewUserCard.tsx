import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card, Button} from 'react-bootstrap';
import { IUser, ImageSizeProps } from "../../types";
import ImageResize from '../common/ImageResize';

type ViewCardProps = React.HTMLProps<HTMLElement> & {
  user: IUser,
  onViewUserDetail: onViewUserDetail,
}

export type onViewUserDetail = (userId: string) => void;

const ViewUserCard: React.FC<ViewCardProps> = ({className, user, onViewUserDetail}) => {

  const imageMaxSize: ImageSizeProps = {maxWidth:260, maxHeight:260};

  return (  
    <div className="ViewCard">  
      <Container className='p-4'>  
          <Card>  
            <Card.Body className="image-container">
              <Card.Header>
                <span>{user?.username}</span>
              </Card.Header> 
              { user.image && <ImageResize imageData={user.image} resize={imageMaxSize}/> }
              <Card.Title>
                <br/>
                {user.username}
              </Card.Title>
              <Card.Subtitle>
                <br/>
                <span>Email:</span> 
              </Card.Subtitle>    
              <Card.Text>
                <br/>
                {user.email}
              </Card.Text>  
              <Button className={className} onClick={() => onViewUserDetail(user.id!)}>View</Button>  
            </Card.Body>  
          </Card>  
      </Container>  
    </div>  
  );  
};

export default ViewUserCard;