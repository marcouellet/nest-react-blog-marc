import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import {Container ,Card, Col, Button} from 'react-bootstrap';
import { IPost } from "../../types";

type ViewCardProps = React.HTMLProps<HTMLElement> & {
  post: IPost,
}

const ViewCard: React.FC<ViewCardProps> = ({children, className, post, onClick}) => {

  const handleOnClick = async (event: React.MouseEvent<HTMLElement>) => {
   };

   return (  
    <div className="ViewCard">  
   <Container className='p-4'>  
  <Col md="4">  
  <Card>  
  {/* <Card.Img variant="top" src={post.image?.data} />   */}
  <Card.Body>  
    <Card.Title>{post.title}</Card.Title>  
    <Card.Text>  
      {post.description}
    </Card.Text>  
    <Button className={className} onClick={onClick}>View</Button>  
  </Card.Body>  
</Card>  
    </Col>  
</Container>  
    </div>  
  );  
};

export default ViewCard;