import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";

import DisplayTooltip from '../common/displayTooltip';

type DisplayButtonProps = React.HTMLProps<HTMLButtonElement> & {
    contentToDisplay: string | JSX.Element,
    toolTip?: string
}

const DisplayModalButton: React.FC<DisplayButtonProps> = ({children, contentToDisplay, toolTip, className}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [hasMouseOver, setHasMouseOver] = useState(false);

    const showModal = () => {
        setIsOpen(true);  
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <DisplayTooltip toolTip={toolTip ? toolTip : 'no tooltip'}>
                <button 
                    style={{
                        border: "none",
                        outline:"none",
                        borderRadius: "10px",
                        backgroundColor: hasMouseOver ? "bisque" : "transparent"
                    }}
                    className={className} 
                    onClick={showModal}
                    onMouseEnter={() => setHasMouseOver(true)}
                    onMouseLeave={() => setHasMouseOver(false)}
                >
                    {children}
                </button>
            </DisplayTooltip>

            <Modal show={isOpen} onHide={hideModal} centered dialogClassName={`modal-md`}>
                <Modal.Body>
                    <div>
                        {contentToDisplay} 
                    </div>                  
                </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-primary" onClick={hideModal}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
)
};

export default DisplayModalButton;