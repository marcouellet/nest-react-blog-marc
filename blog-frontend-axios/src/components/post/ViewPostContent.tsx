import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import DisplayContent from '../common/displayContent';

type ViewPostContentProps = React.HTMLProps<HTMLElement> & {
}

const ViewPostContent: React.FC<ViewPostContentProps> = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { content } = location.state as any;

  const handleClose = () => {
    navigate(-1);
  };
  
  return (
    <div className="container-fluid">
      {content && 
      (
        <div className="view-blog">
          <div className="row">
            <DisplayContent content={content} onClose={handleClose}/>         
          </div>
        </div>
      )
      }
    </div>
  );}

export default ViewPostContent;