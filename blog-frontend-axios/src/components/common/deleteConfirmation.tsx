import React from 'react';
import {useConfirmationModalContext} from "../../contexts/modalConfirmationContext";

type DeleteButtonProps = React.HTMLProps<HTMLButtonElement> & {
    message: string
}

const DeleteButton: React.FC<DeleteButtonProps> = ({children, className, message, onClick}) => {
    const modalContext = useConfirmationModalContext();

    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const result = await modalContext.showConfirmation(
            'Delete Confirmation!',
            <div style={{border: "2px solid blue", padding: "10px"}}>
                <p>
                    Are you sure you want to delete
                    <span style={{fontSize: "18px"}}><i> {message}</i></span> ?

                </p>
             </div>
        );
        result && onClick && onClick(event);
    };

    return (
        <button className={className} onClick={handleOnClick}>
            {children}
        </button>
    )
};

export default DeleteButton;