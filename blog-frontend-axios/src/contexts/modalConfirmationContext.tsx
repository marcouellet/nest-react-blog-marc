import React, {useContext, useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useModalShow } from './useModalShow';

type ModalContextType = {
    showConfirmation: (title: string, message: string | JSX.Element) => Promise<boolean>;
};

type ConfirmationModalContextProviderProps = {
    children: React.ReactNode
}

const ConfirmationModalContext = React.createContext<ModalContextType>({} as ModalContextType);

const ConfirmationModalContextProvider: React.FC<ConfirmationModalContextProviderProps> = (props) => {
    const {setShow, show, onHide} = useModalShow();
    const [content, setContent] = useState<{ title: string, message: string | JSX.Element} | null>();
    const resolver = useRef<Function>();

    const handleShow = (title: string, message: string | JSX.Element): Promise<boolean> => {
        setContent({
            title,
            message
        });
        setShow(true);
        return new Promise(function (resolve) {
            resolver.current = resolve;
        });
    };

    const modalContext: ModalContextType = {
        showConfirmation: handleShow
    };

    const handleOk = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onHide();
        resolver.current && resolver.current(true);
    };

    const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onHide();
        resolver.current && resolver.current(false);
    };

    return (
        <ConfirmationModalContext.Provider value={modalContext}>
            {props.children}

            {content && 
            (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={show} onHide={onHide} centered dialogClassName={`modal-md`} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <label>{content.title}</label>
                    </Modal.Header>
                    <Modal.Body>
                        <label>{content.message}</label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn btn-default" onClick={handleCancel}>Cancel</Button>
                        <Button className="btn btn-primary" onClick={handleOk}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>

            )}
        </ConfirmationModalContext.Provider>
        
    )
};

const useConfirmationModalContext = (): ModalContextType => useContext(ConfirmationModalContext);

export {
    useConfirmationModalContext,
}

export default ConfirmationModalContextProvider;