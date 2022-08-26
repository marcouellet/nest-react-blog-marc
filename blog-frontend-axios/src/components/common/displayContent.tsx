import React from "react";

type DisplayContentProps = React.HTMLProps<HTMLElement> & {
    content: string,
    onClose: onClose,
}

export type onClose = () => void;

export const DisplayContent: React.FC<DisplayContentProps> = ({className, content, onClose}) => {

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
    return (
      <div className="container-fluid page">
        <button className="btn btn-secondary pull-right" onClick={handleClose} >
          Close 
       </button>                 
        <div dangerouslySetInnerHTML={{__html: content}} />           
      </div>
     );
}
