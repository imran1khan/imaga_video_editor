"use client"
import { debounce } from '@/lib/utils';
import { FineTuneAtom, FineTuneKey } from '@/packages/store/atoms/FinetuneAtom';
import { ShowMenuElement } from '@/packages/store/atoms/ShowMenu';
import { Blend, BoxSelect, Circle, CircleDashed, CircleSlash2, Droplets, Gem, Palette, Rainbow, Sun } from 'lucide-react'
import React, { ChangeEvent, useCallback, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { Button } from '../ui/button';

function FineTuneImage() {
    const showMenu = useRecoilValue(ShowMenuElement);
    const [color, setColor] = useRecoilState(FineTuneAtom);
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
            inputID: "Saturate",
            inputName: "Saturate",
            inputIcon: <CircleDashed strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.saturate,
            min: 0,
            max: undefined
        },
        {
            uuid: "b273df65-d810-41cc-8138-a563096b9828",
            inputID: "Blur",
            inputName: "Blur",
            inputIcon: <Droplets strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.blur,
            min: 0,
            max: undefined
        },
        {
            uuid: "1da8a420-9ca7-42fe-891e-671e8eed19fd",
            inputID: "Contrast",
            inputName: "Contrast",
            inputIcon: <Circle strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.contrast,
            min: 0,
            max: undefined
        },
        {
            uuid: "14f21a7f-bb58-48c6-b57e-7b0749c4798b",
            inputID: "Opacity",
            inputName: "Opacity",
            inputIcon: <Blend strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.opacity,
            min: 0,
            max: 100
        },
        {
            uuid: "5928597c-9706-4c59-805d-658003fd8ea6",
            inputID: "Grayscale",
            inputName: "Grayscale",
            inputIcon: <BoxSelect strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.grayscale,
            min: 0,
            max: 100
        },
        {
            uuid: "e6f816b9-5290-4c90-b99e-c428bf4f9eea",
            inputID: "Sepia",
            inputName: "Sepia",
            inputIcon: <Gem strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.sepia,
            min: 0,
            max: 100
        },
        {
            uuid: "9425058d-ff2f-4744-8c00-f4ce24c4dea3",
            inputID: "hue-rotate",
            inputName: "Hue",
            inputIcon: <Rainbow strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.hue_rotate,
            min: 0,
            max: 360
        },
        {
            uuid: "9425058d-ff2f-4744-8c99-f4ce24c4dea3",
            inputID: "Invert",
            inputName: "Invert",
            inputIcon: <CircleSlash2 strokeWidth={`1px`} size={20} />,
            type: "number",
            defaultValue: color.invert,
            min: 0,
            max: 100
        },
        {
            uuid: "9425058d-ff2f-4744-8c99-f5ae24c4cae3",
            inputID: "Color",
            inputName: "Color",
            inputIcon: <Palette strokeWidth={`1px`} size={20} />,
            type: "color",
            defaultValue: color.color,
            min: undefined,
            max: undefined
        },
    ];
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
    const onChangeHandeler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case "Brightness":
                setValueFun("brightness", e.target.value);
                break;
            case "Saturate":
                setValueFun("saturate", e.target.value);
                break;
            case "Blur":
                setValueFun("blur", e.target.value);
                break;
            case "Contrast":
                setValueFun("contrast", e.target.value);
                break;
            case "Opacity":
                setValueFun("opacity", e.target.value);
                break;
            case "Grayscale":
                setValueFun("grayscale", e.target.value);
                break;
            case "Sepia":
                setValueFun("sepia", e.target.value);
                break;
            case "hue-rotate":
                setValueFun("hue_rotate", e.target.value);
                break;
            case "Invert":
                setValueFun("invert", e.target.value);
                break;
            case "Color":
                setColorValue(e.target.value);
                break;
            default:
                console.log('unkown value', e.target.name, e.target.value);
                break;
        }

    }, [setValueFun, setColorValue]);
    const MainDivRef = useRef<HTMLDivElement | null>(null);

    const resetInput=useCallback(()=>{
        if (!MainDivRef.current) {
            return;
        }
        const Allinputs = MainDivRef.current.querySelectorAll(`input`);
        Allinputs.forEach(v=>{
            switch (v.name) {
                case "Brightness":
                    v.value = "100";
                    break;
                case "Saturate":
                    v.value = "100"
                    break
                case "Blur":
                    v.value = "0"
                    break
                case "Contrast":
                    v.value = "100";
                    break;
                case "Opacity":
                    v.value = "100";
                    break;
                case "Grayscale":
                    v.value = "0";
                    break;
                case "Sepia":
                    v.value = "0";
                    break;
                case "hue-rotate":
                    v.value = "0";
                    break;
                case "Invert":
                    v.value = "0";
                    break;
                case "Color":
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
    },[setColor]);
    return (
        <div ref={MainDivRef} hidden={showMenu.imageMenu} className="absolute h-[50%] w-60 top-12 left-4 bg-slate-400 text-white dark:bg-slate-800 rounded-md space-y-1 px-1 pt-2">
            {colorEffectArr.map((v) => {
                return (
                    <div key={v.uuid} className="flex justify-between">
                        <span className=''>{v.inputIcon}</span>
                        <span className="font-extralight text-sm w-[50%] ml-1">{v.inputName}</span>
                        <input onChange={onChangeHandeler} className={`w-[50%] ${v.inputName === 'Color' ? `bg-[#00000000]` : `bg-[#0b1e35a7]`} text-sm font-extralight`} min={v.min} max={v.max} value={v.defaultValue} type={v.type} name={v.inputID} id='' />
                    </div>
                )
            })}
            <div>
                <Button className='text-black dark:text-white' variant={`outline`} onClick={()=>resetInput()}>reset</Button>
            </div>
        </div>
    )
}

export default FineTuneImage