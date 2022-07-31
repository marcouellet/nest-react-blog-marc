import React, {useContext, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";

import { useModalShow } from './useModalShow';

type ModalContextType = {
    showModal: (content: string | JSX.Element) => Promise<boolean>;
};

type ModalContextProviderProps = {
    children: string | JSX.Element
}

const ModalContext = React.createContext<ModalContextType>({} as ModalContextType);

const ModalContextProvider: React.FC<ModalContextProviderProps> = (props) => {
    const {setShow, show, onHide} = useModalShow();
    const [modalContent, setModalContent] = useState<{content:string | JSX.Element} | null>();
    const resolver = useRef<Function>();

    const handleShow = (content: string | JSX.Element): Promise<boolean> => {
        setModalContent({content});
        setShow(true);
        return new Promise(function (resolve) {
            resolver.current = resolve;
        });
    };

    const modalContext: ModalContextType = {
        showModal: handleShow
    };

    const handleClose = () => {
        resolver.current && resolver.current(true);
        onHide();
    };

    return (
        <ModalContext.Provider value={modalContext}>
            {props.children}

            {modalContent && 
            (               
                <Modal show={show} onHide={onHide} centered dialogClassName={`modal-md`}>
                    <Modal.Body>
                        <div>
                            {modalContent} 
                        </div>                  
                    </Modal.Body>
                        <Modal.Footer>
                        <button className="btn btn-default" onClick={handleClose}>Close</button>
                    </Modal.Footer>
                </Modal>
            )
            }
        </ModalContext.Provider>      
    )
};

const useModalContext = (): ModalContextType => useContext(ModalContext);

export {
    useModalShow,
    useModalContext,
}

export default ModalContextProvider;