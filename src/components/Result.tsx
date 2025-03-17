import { FC } from "react";
import React from "react";

type Props = {
    result: string;
}

export const Result: FC<Props> = ({result}) =>{
    return(
        <input className = "result-field" type = "text" value = {result} disabled/>
    )
}