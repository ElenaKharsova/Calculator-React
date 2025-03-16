import { FC, ReactElement } from "react";
import React from "react";

type Props = {
    value: string,
    handleClick: () => void;
}

export const Button: FC<Props> = ({value, handleClick}) => {
    return(
        <button className = {`calculator-button-${value}`} onClick = {handleClick}>{value}</button>
    )
}