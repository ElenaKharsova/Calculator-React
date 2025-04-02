import { FC, ReactElement } from "react";
import React from "react";

type Props = {
    className?: string;
    value: string,
    handleClick: () => void;
}

export const Button: FC<Props> = ({value, handleClick, className}) => {
    return(
        <button className = {`calculator-button ${className || ""}`} onClick = {handleClick}>{value}</button>
    )
}