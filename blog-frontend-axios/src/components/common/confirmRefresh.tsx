import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type DisplayModalConfirmProps = React.HTMLProps<HTMLButtonElement> & {
    show: boolean,
    logout: () => void,
    refresh: () => void,
    onExit: () => void,
}

const ConfirmRefresh: React.FC<DisplayModalConfirmProps> = ({children, show, logout, refresh, onExit, className}) => {

    return (
        <>           
            <Modal show={show} onExit={onExit} centered dialogClassName={`modal-md`}>
                <Modal.Body>
                    <div style={{border: "2px solid blue", padding: "10px"}}>
                        <p>
                            Session expired, do you want to extend the session?
                        </p>
                    </div>               
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-primary" onClick={logout}>Logout</Button>
                    <Button className="btn btn-primary" onClick={refresh}>Refresh</Button>
                </Modal.Footer>
            </Modal>
        </>
)
};

export default ConfirmRefresh;