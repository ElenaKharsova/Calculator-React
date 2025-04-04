
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
        //ToDo: после выполнения арифметической операции вещественным числом возвращать число, округленное до знаков, содержащихся в этом числе
        // если число дробное, выводить не более 5 знаков после запятой
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
                //ToDo: проверить деление на 0
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

    const handleArithmeticButtonClick = useCallback((value: string) => {      
        //ToDo: Проверить результат 0-6 = 6?  
        const currentIntermediaResult = intermediateResultRef.current;
        const currentResult = resultRef.current;
        const currentSign = signRef.current;

        //if(intermediateResult !== ""){
        if(currentIntermediaResult !== ""){
            const resultNew: string | number = 
                arithmeticAction(//sign, result, intermediateResult);
                    currentSign, currentResult, currentIntermediaResult);
            const newResult = resultNew === "" ? currentIntermediaResult : resultNew.toString()
            //setResult(resultNew === "" ? intermediateResult : resultNew.toString());
            setResult(newResult);
            // if (result === resultNew.toString()) {
            //     setOutputNumber(resultNew.toString());
            // }
            //if (result === newResult) {
                setOutputNumber(newResult);
            //}
        }

        setIntermediateResult(""); 
        setSign(value); 
    }, []);

    const handleArithmeticButtonClickRef = useRef(handleArithmeticButtonClick);

    const handleNumberButtonClick = useCallback((value: string) => {
        setIntermediateResult(prev => (prev === "0" ? value : prev + value))
    },[]);

    const handleClearButtonClick = useCallback(() => {
        //ToDo: нажимаем любую цифру, потом арифметическую операйию и С => цифра, орифметическая операция => видим 0
        setResult("0"); 
        setIntermediateResult("");
        setOutputNumber("0");
    }, [])

    const handleDotButtonClick = useCallback(() => {
        if(intermediateResult.indexOf(".") === -1){
            if(Number(intermediateResult) === 0){
                setIntermediateResult("0.");
            } else {
                setIntermediateResult(intermediateResult + ".");
            }
        }
    }, [])

    const handleSignButtonClick = useCallback(() => {
        setIntermediateResult((Number(intermediateResult) * (-1)).toString());
        if (intermediateResult === ""){
        //ToDo: После знака равно, если нажать смену знака, результат сбрасывается на 0
        }
    }, [])

    const handleEqualButtonClick = useCallback(() => {
        //const secondOperand = intermediateResult || result;
        const secondOperand = intermediateResultRef.current || resultRef.current;
        const currentSign = signRef.current;

        if (!secondOperand) {
            console.log("handleEqualButtonClick: No intermediate result, returning early.", intermediateResult);
            return;
        }
    
        console.log("handleEqualButtonClick: Performing calculation with:", {
            sign,
            result,
            intermediateResult,
            secondOperand
        });
        if (!currentSign) {
            console.warn("handleEqualButtonClick: No sign set, returning early.");
            return;
        }

        // setResult(prevResult => {
        //     const resultNew: string = arithmeticAction(sign, prevResult, secondOperand)?.toString();
        //     console.log("New result calculated:", resultNew);

        //     setOutputNumber(resultNew);
        //     return resultNew;
        // })

        const resultNew: string = arithmeticAction(currentSign, resultRef.current, secondOperand)?.toString();

        // const resultNew: number = arithmeticAction(sign, result, intermediateResult) as number;
        // setResult(resultNew.toString());
        // if (result === resultNew.toString()) {
        //     setOutputNumber(resultNew.toString());
        // }
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

    // useEffect(()=>{
    //     setIntermediateResult('');
    //     console.log("Updated sign:", sign);

    // }, [sign])

    useEffect(()=>{
        signRef.current = sign;
    }, [sign]);

    useEffect(()=>{
        resultRef.current = result;
    },[result])

    useEffect(()=>{
        intermediateResultRef.current = intermediateResult;
    },[intermediateResult])

    useEffect(()=>{
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log("Key pressed:", event.key);

            switch(event.key){
                case "Enter":
                    //handleEqualButtonClick();
                    handleEqualButtonClickRef.current();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                    //handleArithmeticButtonClick(event.key);
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

    useEffect(() => {
        // Позволяет проверить состояние из консоли
        (window as any).__debugState = () => ({
            intermediateResult,
            result,
            sign
        });
    }, [intermediateResult, result, sign]);

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
                        //console.log("value", value);
                        if (index !== NUMBER_BUTTONS.length - 1){
                            return (
                            <Button 
                                className = "number-button" 
                                key = {value} 
                                value = {value} 
                                handleClick = {() => handleNumberButtonClick(value)}/>)
                        } else {
                            //console.log("value", value)
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