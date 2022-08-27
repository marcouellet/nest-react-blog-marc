import React from 'react';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type DisplayTooltipProps = React.HTMLProps<HTMLButtonElement> & {
    toolTip?: string
}

export const DisplayTooltip: React.FC<DisplayTooltipProps> = ({children, toolTip, className}) => {

    const renderTooltip = (props: any) => {
        return (
            <Tooltip {...props}>
                <div style={{color: 'bisque'}}>
                    {toolTip ? toolTip : 'no tooltip'}
                </div>
            </Tooltip> 
        ) 
    };

    return (
        <>
             <OverlayTrigger placement="top" overlay={renderTooltip}>
                <div>
                    {children}
                </div>
             </OverlayTrigger>
        </>
)
};
