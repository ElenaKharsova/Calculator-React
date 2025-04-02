
import { FC, use, useEffect, useRef, useState } from "react";
import { Result } from './Result'
import { Button } from './Button';
import React from "react";
import { validateHeaderValue } from "node:http";


export const Field: FC = () => {
    const [intermediateResult, setIntermediateResult] = useState<string>("");
    const [result, setResult] = useState<string>('0');
    const [outputNumber, setOutputNumber] = useState<string>("0");
    const [sign, setSign] = useState("");
    const isFirstRender = useRef(true);


    const NUMBER_BUTTONS: string[] = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];
    const ARITHMETIC_BUTTONS: string[] = ["/", "*", "-", "+"];
    const CLEAR_BUTTON: string = "AC"
    const EQUAL_BUTTON: string = "="
    const DOT_BUTTON: string = ".";
    const SIGN_BUTTON: string = "±";

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
                if (b === 0){
                    setOutputNumber("NaN");
                    setSign("");
                    setResult("0");
                    setIntermediateResult("");
                    return "";
                }
                return a / b;
        } 
    }

    const handleArithmeticButtonClick = (value: string) => {

        if(intermediateResult !== ""){
            const resultNew: string | number = arithmeticAction(sign, result, intermediateResult);
            setResult(resultNew === "" ? intermediateResult : resultNew.toString());
            if (result === resultNew.toString()) {
                setOutputNumber(resultNew.toString());
            }
        }

        setIntermediateResult(""); 
        setSign(value); 
    }

    const handleNumberButtonClick = (value: string) => {
        setIntermediateResult(prev => prev + value);
    }

    const handleClearButtonClick = () => {
        setResult("0"); 
        setIntermediateResult("");
        setOutputNumber("0");
    }

    const handleDotButtonClick = () => {
    }

    const handleSignButtonClick = () => {
        
    }

    const handleEqualButtonClick = () => {
        const resultNew: number = arithmeticAction(sign, result, intermediateResult) as number;
        setResult(resultNew.toString());
        if (result === resultNew.toString()) {
            setOutputNumber(resultNew.toString());
        }
        setIntermediateResult("");
        setSign("");
    }

    useEffect(()=>{
        if(intermediateResult || result){
            setOutputNumber(result);
        }
    },[result])


    useEffect(()=>{
        if (isFirstRender.current){
            isFirstRender.current = false;
            return;
        }
        
        if(intermediateResult !== ""){
            setOutputNumber(intermediateResult);
        }
        
    }, [intermediateResult]);

    useEffect(()=>{
        setIntermediateResult('');
    }, [sign])

    return(
    <div className="field">
        <Result result = { outputNumber }/>
        <div className = "buttons-wrap">
            <div className = "main-block-wrap">
                <div className="functional-buttons-wrap">
                    <Button className = "functional-button" key = {CLEAR_BUTTON} value = {CLEAR_BUTTON} handleClick = {() => handleClearButtonClick}/>
                    <Button className = "functional-button" key = {SIGN_BUTTON} value = {SIGN_BUTTON} handleClick = {() => handleSignButtonClick}/>
                </div>
                <div className="number-buttons-wrap">
                {
                    NUMBER_BUTTONS.map((value: string, index: number)=>{
                        if (index !== NUMBER_BUTTONS.length - 1){
                            return (
                            <Button className = "number-button" key = {value} value = {value} handleClick = {() => handleNumberButtonClick(value)}/>)
                        } else {
                            console.log("value", value)
                            return (
                            <Button className = "number-button last-button" key = {value} value = {value} handleClick = {() => handleArithmeticButtonClick(value)}/>)
                        }  
                    })
                }
                <Button className = "number-button" key = {DOT_BUTTON} value = {DOT_BUTTON} handleClick={() => handleDotButtonClick}/>
                </div>
            </div>
            <div className = "operations-block-wrap">
                <div className = "arithmetic-buttons-wrap">
                {
                    ARITHMETIC_BUTTONS.map((value: string)=>{
                        return (
                            <Button className = "arithmetic-button" key = {value} value = {value} handleClick = {() => handleArithmeticButtonClick(value)}/>)
                        
                    })        
                }
                </div>
                <Button className = "arithmetic-button" key = {EQUAL_BUTTON} value = {EQUAL_BUTTON} handleClick={() => handleEqualButtonClick}/>
            </div>
        </div>
    </div>)
}