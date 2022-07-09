import React from 'react';
import Modal from "react-bootstrap/Modal";

const TestModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
  
    const showModal = () => {
      setIsOpen(true);
    };
  
    const hideModal = () => {
      setIsOpen(false);
    };
  
    return (
      <>
        <button onClick={showModal}>Display Modal</button>
        <Modal show={isOpen} onHide={hideModal}>
          <Modal.Header>
            <Modal.Title>Hi</Modal.Title>
          </Modal.Header>
          <Modal.Body>The body</Modal.Body>
          <Modal.Footer>
            <button onClick={hideModal}>Cancel</button>
            <button>Save</button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  export default TestModal;