import { FC, useState } from "react";
import { Result } from './Result'
import { Button } from './Button';
import React from "react";


export const Field: FC = () => {

    const [result, setResult] = useState<number>(0);
    const [buttons, setButtons] = 
    useState<string[]>(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "=", "+", "-", "*", "/", "C"]);

    const handleClick = (value: string) => {
        console.log("Click button", value)
    }

    return(<>
    <Result result = { result }/>
    <div className = "buttons-wrap">
    {
        buttons.map((value: string)=>{
            return (
        <Button key = {value} value = {value} handleClick = {() => handleClick(value)}/>)
        })
    }
    </div>
    </>)
}