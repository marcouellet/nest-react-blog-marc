import React from "react";

type ViewPostContentProps = React.HTMLProps<HTMLElement> & {
    content: string,
    onClose: onClose,
}

export type onClose = () => void;

const ViewPostContent: React.FC<ViewPostContentProps> = ({className, content, onClose}) => {

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
    return (
      <div>
        <button className="btn btn-secondary" onClick={() => handleClose()} >
          Close 
       </button>                 
        <div dangerouslySetInnerHTML={{__html: content}} />           
      </div>
     );
}

export default ViewPostContent;