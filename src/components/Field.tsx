
import { FC, useEffect, useRef, useState, useCallback } from "react";
import { Result } from './Result'
import { Button } from './Button';
import React from "react";

export const Field: FC = () => {
    const [intermediateResult, setIntermediateResult] = useState<string>("");
    const [result, setResult] = useState<string>('0');
    const [sign, setSign] = useState<string>("");

    const intermediateResultRef = useRef(intermediateResult);
    const resultRef = useRef(result);
    const signRef = useRef(sign);

    const [outputNumber, setOutputNumber] = useState<string>("0");
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
        let result: number;

        switch(sign){
            case "+": 
                result = a + b;
                break;
            case "-":
                result = a - b;
                break;
            case "*":
                result = a * b;
                break;
            case "/":
                if (b === 0){
                    setOutputNumber("NaN");
                    setSign("");
                    setResult("0");
                    setIntermediateResult("");
                    return "NaN";
                }
                result = a / b;
                break;
            default:
                return "";
        } 
        return Number.isInteger(result) ? result : Number(result.toFixed(5));
    }

    const handleArithmeticButtonClick = useCallback((value: string) => {      
        const currentIntermediaResult = intermediateResultRef.current;
        const currentResult = resultRef.current;
        const currentSign = signRef.current;

        if(currentIntermediaResult !== ""){
            const resultNew: string | number = 
                arithmeticAction(
                    currentSign, currentResult, currentIntermediaResult);
            const newResult = resultNew === "" ? currentIntermediaResult : resultNew.toString()
            setResult(newResult);    
            setOutputNumber(newResult);
        }

        setIntermediateResult(""); 
        setSign(value); 
    }, []);

    const handleArithmeticButtonClickRef = useRef(handleArithmeticButtonClick);

    const handleNumberButtonClick = useCallback((value: string) => {        
        const newValue = intermediateResultRef.current === "0" ? value : intermediateResultRef.current + value;
        intermediateResultRef.current = newValue;

        setIntermediateResult(newValue);

        if(newValue !== ""){
            setOutputNumber(newValue);
        }              
    },[]);

    const handleClearButtonClick = useCallback(() => {     
        setResult("0"); 
        setIntermediateResult("");
        setOutputNumber("0");
        setSign("");
    }, [])

    const handleDotButtonClick = useCallback(() => {
        let newValue;

        if (!intermediateResultRef.current.includes(".")){
            newValue = intermediateResultRef.current === "" ? "0." : intermediateResultRef.current + ".";
        } else {
            newValue = intermediateResultRef.current;
        }

        intermediateResultRef.current = newValue;
        setIntermediateResult(newValue);

        if(intermediateResultRef.current !== ""){
            setOutputNumber(newValue);
        }
    }, [])

    const handleSignButtonClick = useCallback(() => {
        if (intermediateResultRef.current !== "") {
            const newValue = (Number(intermediateResultRef.current) * -1).toString();
            intermediateResultRef.current = newValue;
            setIntermediateResult(newValue);       
            setOutputNumber(newValue);
        } else if (resultRef.current !== "") {
            const newResult = (Number(resultRef.current) * -1).toString();
            setResult(newResult);
            setOutputNumber(newResult);
        }        
    }, [])

    const handleEqualButtonClick = useCallback(() => {
        const secondOperand = intermediateResultRef.current !== "" 
            ? intermediateResultRef.current 
            : resultRef.current;
        const currentSign = signRef.current;

        if (!secondOperand) {
            return;
        }

        if (!currentSign) {
            return;
        }

        const resultNew: string = arithmeticAction(currentSign, resultRef.current, secondOperand)?.toString();

        setResult(resultNew);
        setOutputNumber(resultNew);
        setIntermediateResult("");
        setSign("");
    }, []);

    const handleEqualButtonClickRef = useRef(handleEqualButtonClick);

    useEffect(()=>{
        handleArithmeticButtonClickRef.current = handleArithmeticButtonClick;
        handleEqualButtonClickRef.current = handleEqualButtonClick;
    },[handleArithmeticButtonClick, handleEqualButtonClick])

    useEffect(()=>{
        if (isFirstRender.current){
            isFirstRender.current = false;
            return;
        }

        intermediateResultRef.current = intermediateResult;
    }, [intermediateResult]);

    useEffect(()=>{
        signRef.current = sign;
    }, [sign]);

    useEffect(()=>{
        resultRef.current = result;
    },[result])

    useEffect(()=>{
        const handleKeyDown = (event: KeyboardEvent) => {
            switch(event.key){
                case "Enter":
                    handleEqualButtonClickRef.current();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                    handleArithmeticButtonClickRef.current(event.key);
                    break;
                case ".":
                    handleDotButtonClick();
                    break;
                case "Backspace":
                    handleClearButtonClick();
                    break;
                default:
                    if(!isNaN(Number(event.key))){
                        handleNumberButtonClick(event.key)
                    }
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return ()=>{
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [handleDotButtonClick, handleClearButtonClick, handleNumberButtonClick]);

    return(
    <div className="field">
        <Result result = { outputNumber }/>
        <div className = "buttons-wrap">
            <div className = "main-block-wrap">
                <div className="functional-buttons-wrap">
                    <Button 
                        className = "functional-button" 
                        key = {CLEAR_BUTTON} 
                        value = {CLEAR_BUTTON} 
                        handleClick = {() => handleClearButtonClick()}/>
                    <Button 
                        className = "functional-button" 
                        key = {SIGN_BUTTON} 
                        value = {SIGN_BUTTON} 
                        handleClick = {() => handleSignButtonClick()}/>
                </div>
                <div className="number-buttons-wrap">
                {
                    NUMBER_BUTTONS.map((value: string, index: number)=>{
                        if (index !== NUMBER_BUTTONS.length - 1){
                            return (
                            <Button 
                                className = "number-button" 
                                key = {value} 
                                value = {value} 
                                handleClick = {() => handleNumberButtonClick(value)}/>)
                        } else {
                            return (
                            <Button 
                                className = "number-button last-button" 
                                key = {value} 
                                value = {value} 
                                handleClick = {() => handleNumberButtonClick(value)}/>)
                        }  
                    })
                }
                <Button 
                    className = "number-button" 
                    key = {DOT_BUTTON} 
                    value = {DOT_BUTTON} 
                    handleClick={() => handleDotButtonClick()}/>
                </div>
            </div>
            <div className = "operations-block-wrap">
                <div className = "arithmetic-buttons-wrap">
                {
                    ARITHMETIC_BUTTONS.map((value: string)=>{
                        return (
                            <Button 
                                className = "arithmetic-button" 
                                key = {value} 
                                value = {value} 
                                handleClick = {() => handleArithmeticButtonClick(value)}/>)
                        
                    })        
                }
                </div>
                <Button 
                    className = "arithmetic-button" 
                    key = {EQUAL_BUTTON} 
                    value = {EQUAL_BUTTON} 
                    handleClick = {() => handleEqualButtonClick()}
                    />
            </div>
        </div>
    </div>)
}