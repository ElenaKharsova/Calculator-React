import { EventEmitterAsyncResource } from "node:stream";
import { FC, ReactElement } from "react";
import React from "react";

type Props = {
    className?: string;
    value: string,
    handleClick: () => void;
}

export const Button: FC<Props> = React.memo(({value, handleClick, className}) => {
    return(
        <button 
            className = {`calculator-button ${className || ""}`} 
            onClick = {handleClick} 
            data-testid = {`Button-${value}`}
            tabIndex={0}>
                {value}
        </button>
    )
});