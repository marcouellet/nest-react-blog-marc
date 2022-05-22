import React from 'react';
import {useConfirmationModalContext} from "../../contexts/modalConfirmationContext";

type CancelButtonProps = React.HTMLProps<HTMLButtonElement> & {
    prompt: boolean
    message: string
}

const CancelButton: React.FC<CancelButtonProps> = ({children, className, message, prompt, onClick}) => {

    const modalContext = useConfirmationModalContext();

    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (prompt) {
                const result = await modalContext.showConfirmation(
                'Cancel Confirmation!',
                ( 
                    <div style={{border: "2px solid blue", padding: "10px"}}>
                        <p>
                            Are you sure you want to cancel
                            <span style={{fontSize: "18px"}}><i> {message}</i></span> ?
                        </p>
                    </div>
                )
            );
            result && onClick && onClick(event);
        }
        else {
            onClick && onClick(event);
        }
    };

    return (
        <button className={className} onClick={handleOnClick}>
            {children}
        </button>
    )
};

export default CancelButton;