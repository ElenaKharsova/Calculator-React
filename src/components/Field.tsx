
import { FC, use, useEffect, useRef, useState } from "react";
import { Result } from './Result'
import { Button } from './Button';
import React from "react";


export const Field: FC = () => {
    const [intermediateResult, setIntermediateResult] = useState<string>('');
    const [result, setResult] = useState<string>('0');
    const [outputNumber, setOutputNumber] = useState<string>('0');
    const [sign, setSign] = useState('');
    const isFirstRender = useRef(true);


    const NUMBER_BUTTONS: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const FUNCTION_BUTTONS: string[] = ["=", "C"];
    const ARITHMETIC_BUTTONS: string[] = ["+", "-", "*", "/"];

    function arithmeticAction(sign: string, member1: string, member2: string): number | string{
        const a = Number(member1);
        const b = Number(member2);
        switch(sign){
            case "":
                return "";
            case "+": 
                return a + b;
            case "-":
                return a - b;
            case "*":
                return a * b;
            case "/":
                return a / b;
        } 
    }

    const handleArithmeticButtonClick = (value: string) => {
        console.log("Click arithmetic Button. Sign, intermediateResult, result:", value, intermediateResult, result)
        const resultNew: string | number = arithmeticAction(sign, result, intermediateResult);

        setResult(resultNew === "" ? intermediateResult : resultNew.toString());
        setSign(value); 
    }

    const handleNumberButtonClick = (value: string) => {
        setIntermediateResult(prev => prev + value);
        console.log("Click number button. value, intermediateResultPrev, result", value, intermediateResult, result);
    }

    const handleFunctionButtonClick = (value: string) => {
        console.log("Click function button. Value, intermediateResult, result", value, intermediateResult, result);

        action(value);
        
        function action(value:string): void{
            switch (value){
                case "C":
                    setResult("0"); 
                    setIntermediateResult("");
                    setOutputNumber("0");
                    break;
                case "=":
                    const resultNew: number = arithmeticAction(sign, result, intermediateResult) as number;
                    setResult(resultNew.toString());
                    setIntermediateResult("");
                    //setOutputNumber(resultNew.toString());
                    setSign("");
                    //setIntermediateResult('');
                    return;                    
            }            
        }
    }

    useEffect(()=>{
        console.log("Change result", result);

        // if(result === "0"){
        //     setIntermediateResult("");
        //     setOutputNumber("0");
        //     console.log("Set setIntermediateResult='', setOutputNumber=0")
        // } else {
        //     setOutputNumber(result)
        // }

        if(intermediateResult !== ""){
            setOutputNumber(result);
        }
    },[result])


    useEffect(()=>{
        console.log("Change intermediateResult", intermediateResult);
        if (isFirstRender.current){
            isFirstRender.current = false;
            return;
        }
        
        if(intermediateResult !== ""){
            setOutputNumber(intermediateResult);
        }
        
    }, [intermediateResult]);

    useEffect(()=>{
        console.log("Change sign. Sign, result", sign, result);
        setIntermediateResult('');
    }, [sign])

    
    

    return(<>
    <Result result = { outputNumber }/>
    <div className = "buttons-wrap">
        <div className = "arithmetic-buttons-wrap">
        {
            ARITHMETIC_BUTTONS.map((value: string)=>{
                return (
            <Button key = {value} value = {value} handleClick = {() => handleArithmeticButtonClick(value)}/>)
            })        
        }
        </div>
        <div className="number-buttons-wrap">
        {
            NUMBER_BUTTONS.map((value: string)=>{
                return (
            <Button key = {value} value = {value} handleClick = {() => handleNumberButtonClick(value)}/>)
            })        
        }
        </div>
        <div className="function-buttons-wrap"> 
        {
            FUNCTION_BUTTONS.map((value: string)=>{
                return (
            <Button key = {value} value = {value} handleClick = {() => handleFunctionButtonClick(value)}/>)
            })        
        }
        </div>
    </div>
    </>)
}