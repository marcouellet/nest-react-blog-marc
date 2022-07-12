import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { IPostEditingState } from '../../types';
import DisplayContent from '../common/displayContent';

type ViewPostContentProps = React.HTMLProps<HTMLElement> & {
}

const ViewPostContent: React.FC<ViewPostContentProps> = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const postState = location.state as IPostEditingState;

  const handleClose = () => {
    navigate(postState.postUrl,{ state: postState});
  };
  
  return (
    <div className="container-fluid">
      {postState.content && 
      (
        <div className="view-blog">
          <div className="row">
            <DisplayContent content={postState.content} onClose={handleClose}/>         
          </div>
        </div>
      )
      }
    </div>
  );}

export default ViewPostContent;