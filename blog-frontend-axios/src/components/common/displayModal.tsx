import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";

type DisplayButtonProps = React.HTMLProps<HTMLButtonElement> & {
    contentToDisplay: string | JSX.Element,
}

const DisplayModalButton: React.FC<DisplayButtonProps> = ({children, contentToDisplay, className}) => {

    const [isOpen, setIsOpen] = useState(false);

    const showModal = () => {
        setIsOpen(true);  
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button className={className} onClick={showModal}>
                {children}
            </button>
            <Modal show={isOpen} onHide={hideModal} centered dialogClassName={`modal-md`}>
                <Modal.Body>
                    <div>
                        {contentToDisplay} 
                    </div>                  
                </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-default" onClick={hideModal}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
)
};

export default DisplayModalButton;