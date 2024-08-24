import { Blend, BoxSelect, Circle, CircleDashed, CircleSlash2, Droplets, Gem, Maximize, Minimize, Palette, PenOff, PlusIcon, Rainbow, Sun } from 'lucide-react';
import React, { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { canvasScreenToggel, FineTuneAtom, FineTuneKey, HoldFineTuneAtom } from '@/packages/store/atoms/FinetuneAtom';

import { debounce } from '@/lib/utils';

function FineTune() {
    const [color, setColor] = useRecoilState(FineTuneAtom);
    const color2 = useRecoilValue(FineTuneAtom);
    const [holdData,setHoldData]=useRecoilState(HoldFineTuneAtom);
    const [canvasScreen , toggelCanvasSceen] = useRecoilState(canvasScreenToggel);
    const check = useRef(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const inputListdiv = useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        console.log(color2)
    },[color2]);
    const colorEffectArr = [
        {
            uuid: "8563d075-eb32-4252-a8f9-49d72b3e0bb8",
            inputID: "Brightness",
            inputName: "Brightness",
            inputIcon: <Sun strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.brightness,
            min: 0,
            max: undefined
        },
        {
            uuid: "ce5aaa7f-6110-4ced-82f1-577209b85c43",
            inputID: "saturate",
            inputName: "saturate",
            inputIcon: <CircleDashed strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.saturate,
            min: 0,
            max: undefined
        },
        {
            uuid: "b273df65-d810-41cc-8138-a563096b9828",
            inputID: "blur",
            inputName: "blur",
            inputIcon: <Droplets strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.blur,
            min: 0,
            max: undefined
        },
        {
            uuid: "1da8a420-9ca7-42fe-891e-671e8eed19fd",
            inputID: "contrast",
            inputName: "contrast",
            inputIcon: <Circle strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.contrast,
            min: 0,
            max: undefined
        },
        {
            uuid: "14f21a7f-bb58-48c6-b57e-7b0749c4798b",
            inputID: "opacity",
            inputName: "opacity",
            inputIcon: <Blend strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.opacity,
            min: 0,
            max: 100
        },
        {
            uuid: "5928597c-9706-4c59-805d-658003fd8ea6",
            inputID: "grayscale",
            inputName: "grayscale",
            inputIcon: <BoxSelect strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.grayscale,
            min: 0,
            max: 100
        },
        {
            uuid: "e6f816b9-5290-4c90-b99e-c428bf4f9eea",
            inputID: "sepia",
            inputName: "sepia",
            inputIcon: <Gem strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.sepia,
            min: 0,
            max: 100
        },
        {
            uuid: "9425058d-ff2f-4744-8c00-f4ce24c4dea3",
            inputID: "hue-rotate",
            inputName: "hue",
            inputIcon: <Rainbow strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.hue_rotate,
            min: 0,
            max: 360
        },
        {
            uuid: "9425058d-ff2f-4744-8c99-f4ce24c4dea3",
            inputID: "invert",
            inputName: "invert",
            inputIcon: <CircleSlash2 strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.invert,
            min: 0,
            max: 100
        },
        {
            uuid: "9425058d-ff2f-4744-8c99-f5ae24c4cae3",
            inputID: "color",
            inputName: "color",
            inputIcon: <Palette strokeWidth={`1px`} size={20} />,
            type: "color",
            defaultValue: `#fff`,
            min: undefined,
            max: undefined
        },
    ];
    const resetFunction = useCallback(() => {
        if (!inputListdiv || !inputListdiv.current) {
            console.log(`inputListdiv is null`);
            console.log(inputListdiv);
            return;
        }
        const allinputs = inputListdiv.current.querySelectorAll(`input`);
        allinputs.forEach(v => {
            switch (v.name) {
                case "Brightness":
                    v.value = "100";
                    break;
                case "saturate":
                    v.value = "100"
                    break
                case "blur":
                    v.value = "0"
                    break
                case "contrast":
                    v.value = "100";
                    break;
                case "opacity":
                    v.value = "100";
                    break;
                case "grayscale":
                    v.value = "0";
                    break;
                case "sepia":
                    v.value = "0";
                    break;
                case "hue-rotate":
                    v.value = "0";
                    break;
                case "invert":
                    v.value = "0";
                    break;
                case "color":
                    v.value = "";
                    break;
                default:
                    break;
            }
        });
        setColor({
            brightness: 100,
            saturate: 100,
            opacity: 100,
            blur: 0,
            contrast: 100,
            grayscale: 0,
            sepia: 0,
            hue_rotate: 0,
            invert: 0,
            color: ``
        });
    }, [setColor])
    const setColorValue = useCallback(
        debounce((value: string) => {
            setColor((p) => {
                return { ...p, color: value }
            })
        }, 500),
    [setColor]);
    const setValueFun = useCallback((key: FineTuneKey, value: string) => {
        setColor((prev) => ({
            ...prev,
            [key]: Number(value),
        }));
    }, [setColor]);
    useEffect(() => {
        return () => {
            setColorValue.cancel();
        }
    }, [setColorValue]);
    const onChangeHandeler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case "Brightness":
                setValueFun("brightness", e.target.value);
                break;
            case "saturate":
                setValueFun("saturate", e.target.value);
                break;
            case "blur":
                setValueFun("blur", e.target.value);
                break;
            case "contrast":
                setValueFun("contrast", e.target.value);
                break;
            case "opacity":
                setValueFun("opacity", e.target.value);
                break;
            case "grayscale":
                setValueFun("grayscale", e.target.value);
                break;
            case "sepia":
                setValueFun("sepia", e.target.value);
                break;
            case "hue-rotate":
                setValueFun("hue_rotate", e.target.value);
                break;
            case "invert":
                setValueFun("invert", e.target.value);
                break;
            case "color":
                setColorValue(e.target.value);
                break;
            default:
                console.log('unkown value', e.target.name, e.target.value);
                break;
        }

    }, [setValueFun, setColorValue]);
    const fileInputFunction = useCallback(() => {
        if (!fileInputRef.current || !fileInputRef) {
            return;
        }
        const fileinput = fileInputRef.current;
        console.log('click')
        fileinput.click();
        fileinput.onchange = () => {
            if (!fileinput.files || fileinput.files.length < 1) {
                console.log(`file is either null or no value ${fileinput.files}`);
                return;
            }
            const file = fileinput.files[0];
            if (!file) {
                console.log(`no fil found ${file}`);
                return;
            }
            resetFunction();
        }
    }, [resetFunction]);
    const check_uncheck= useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        if (!check.current) {
            setHoldData(color);
            setColor({
                brightness: 100,
                saturate: 100,
                opacity: 100,
                blur: 0,
                contrast: 100,
                grayscale: 0,
                sepia: 0,
                hue_rotate: 0,
                invert: 0,
                color: ``
            });
        }
        else{
            setColor(holdData);
            setHoldData({
                brightness: 100,
                saturate: 100,
                opacity: 100,
                blur: 0,
                contrast: 100,
                grayscale: 0,
                sepia: 0,
                hue_rotate: 0,
                invert: 0,
                color: ``
            });
        }
        check.current = !check.current
    },[check,color,setColor,setHoldData,holdData]);
    const togleScreen=useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        toggelCanvasSceen(p=>!p)
    },[toggelCanvasSceen]);
    return (
        <form className="flex h-full items-center justify-center">
            <div ref={inputListdiv} id="inputListDiv" className=" flex-grow space-y-3">
                <div className="ml-1 space-y-2">
                    <input ref={fileInputRef} type="file" accept="image/*" src="" alt="" hidden />
                    <Button className="" onClick={(e) => { e.preventDefault(); fileInputFunction() }} variant={`outline`}>
                        <PlusIcon />Add image
                    </Button>
                    <br />
                    <Button onClick={(e) => { e.preventDefault(); resetFunction() }} variant={`outline`}>reset</Button>
                    <br />
                    <Button onClick={check_uncheck} variant={`outline`}><PenOff strokeWidth={`1px`}
                        size={20} />check</Button>
                    <br />
                    <Button onClick={togleScreen} variant={`outline`}>
                        {canvasScreen ? <><Minimize strokeWidth={`1px`} size={20} />min image</>:<><Maximize strokeWidth={`1px`} size={20} />max image</>}
                    </Button>
                </div>
                <div className="space-y-2">
                    {
                        colorEffectArr.map((v, i) => {
                            return (
                                <div key={v.uuid} className="bg-slate-800 flex justify-between items-center">
                                    <span>{v.inputIcon}</span>
                                    <span>{v.inputName}</span>
                                    <input className="text-white bg-[#25303d] w-[4rem]" type={v.type} name={v.inputID} min={v.min} max={v.max}
                                        defaultValue={v.defaultValue} onChange={(e) => onChangeHandeler(e)} id="" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </form>
    )
}

const MemoFineTune = memo(FineTune);
export { MemoFineTune, FineTune }