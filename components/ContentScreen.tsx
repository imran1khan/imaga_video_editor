"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Image from "next/image"
import { ChangeEvent, FormEvent, MutableRefObject, useCallback, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import "./ContentScreen.css"
import { Button } from "./ui/button"
import { FrameIcon, ImageIcon, NotebookPen, PlusIcon, Scaling, SlidersHorizontal, Sparkles, Sun } from "lucide-react"
import { v4 as uuidv4 } from 'uuid';

let brightness = 100, opacity = 100, saturate = 100, blur = 0, contrast = 100, grayscale = 0, sepia = 0, hue_rotate = 0;

function ContentScreen() {
    const hiddenPanelAdjustRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelFinetuneRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelFilterRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelAnnotateRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelResizeRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const showDivFun = (id: string) => {
        if (id === "") {
            console.log('pass id');
            return;
        }
        const currectDiv = document.querySelector(`#${id}`) as HTMLDivElement;
        console.log(currectDiv);

        if (currectDiv.classList.contains('hidden')) {
            currectDiv.classList.remove('hidden');
            currectDiv.classList.add('transition-opacity', 'duration-500', 'opacity-0');
            setTimeout(() => {
                currectDiv.classList.remove('opacity-0');
                currectDiv.classList.add('opacity-100');
            }, 10);

            sidePanel.forEach(v => {
                if (v.sidePanelname === id) {
                    return;
                }
                const panel = v.sidepanelRef.current;
                if (panel && !panel.classList.contains('hidden')) {
                    panel.classList.remove('opacity-100');
                    panel.classList.add('opacity-0');
                    setTimeout(() => {
                        panel.classList.add('hidden');
                    }, 500);
                }
            });
        } else {
            currectDiv.classList.remove('opacity-100');
            currectDiv.classList.add('opacity-0');
            setTimeout(() => {
                currectDiv.classList.add('hidden');
            }, 500);
        }
    }

    const inputListObj = {
        inputListArr: [
            {
                icon: <FrameIcon strokeWidth="1px" size={40} width={40} height={40} />,
                action: "Adjust",
                divId: hiddenPanelAdjustRef
            },
            {
                icon: <SlidersHorizontal strokeWidth="1px" size={40} width={40} height={40} />,
                action: "Finetune",
                divId: hiddenPanelFinetuneRef,
            },
            {
                icon: <Sparkles strokeWidth="1px" size={40} width={40} height={40} />,
                action: "Filter",
                divId: hiddenPanelFilterRef
            },
            {
                icon: <NotebookPen strokeWidth="1px" size={40} width={40} height={40} />,
                action: "Annotate",
                divId: hiddenPanelAnnotateRef,
            },
            {
                icon: <Scaling strokeWidth="1px" size={40} width={40} height={40} />,
                action: "Resize",
                divId: hiddenPanelResizeRef,
            },
        ],
        showDivFun: showDivFun,
    }
    const onChangeHandeler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!imgRef || !imgRef.current) {
            console.log(`imgRef is ${imgRef}`)
            return;
        }
        switch (e.target.name) {
            case "Brightness":
                brightness = parseFloat(e.target.value);
                break;
            case "saturate":
                saturate = parseFloat(e.target.value);
                break;
            case "blur":
                blur = parseFloat(e.target.value);
                break;
            case "contrast":
                contrast = parseFloat(e.target.value);
                break;
            case "opacity":
                opacity = parseFloat(e.target.value);
                break;
            case "grayscale":
                grayscale = parseFloat(e.target.value);
                break;
            case "sepia":
                sepia = parseFloat(e.target.value);
                break;
            case "hue-rotate":
                hue_rotate = parseFloat(e.target.value);
                break;
            default:
                break;
        }
        const styleStr = `brightness(${brightness}%) saturate(${saturate}%) blur(${blur}px) contrast(${contrast}%) opacity(${opacity}%) 
        grayscale(${grayscale}%)  sepia(${sepia}%) hue-rotate(${hue_rotate}deg)`;
        imgRef.current!.style.filter = styleStr;
        console.log(styleStr)
    }, []);

    const resetFunction = () => {
        const inputListDiv = document.querySelector(`#inputListDiv`) as HTMLDivElement;
        const allinputs = inputListDiv.querySelectorAll(`input`);
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
                default:
                    break;
            }
        });
        imgRef.current!.style.filter = `brightness(${brightness = 100}%) saturate(${saturate = 100}%) blur(${blur = 0}px) contrast(${contrast = 100}%)opacity(${opacity = 100}%) grayscale(${grayscale = 0}%) sepia(${sepia = 0}%) hue-rotate(${hue_rotate = 0}deg)`;
    }
    const sidePanel = [
        {
            uuid: "87b04ef2-799b-4cf5-8d4a-7d23939ba1fc",
            sidePanelname: "Adjust",
            content: <div>Adjust</div>,
            sidepanelRef: hiddenPanelAdjustRef,
        },
        {
            uuid: " b8e2c4d2-4e2d-432d-b1f8-c504e6ae9837",
            sidePanelname: "Finetune",
            content: <InputFormSection resetFunction={resetFunction} onChangeHandeler={onChangeHandeler} />,
            sidepanelRef: hiddenPanelFinetuneRef,
        },
        {
            uuid: "ffa8c705-212e-4e69-8d95-8a0874b60c5d",
            sidePanelname: "Filter",
            content: <div>Filter</div>,
            sidepanelRef: hiddenPanelFilterRef,
        },
        {
            uuid: "063dc21f-97d2-4c16-870e-fb75914e55bc",
            sidePanelname: "Annotate",
            content: <div>Annotate</div>,
            sidepanelRef: hiddenPanelAnnotateRef,
        },
        {
            uuid: "47318e56-d50b-4678-bf83-1691ec8e31bc",
            sidePanelname: "Resize",
            content: <div>Resize</div>,
            sidepanelRef: hiddenPanelResizeRef,
        },
    ];
    return (
        <div className="h-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] border w-full"
            >
                <ResizablePanel defaultSize={75}>
                    <div className="flex h-full items-center justify-center p-6 relative">
                        <img ref={imgRef} src="https://raw.githubusercontent.com/ziadevcom/colorz-picker/main/demo.jpg" alt="" />
                        {
                            sidePanel.map((v) => (
                                <div key={v.uuid} ref={v.sidepanelRef} id={v.sidePanelname} className="bg-slate-900 h-full absolute right-0 
                                w-[12%]">
                                    {v.content}
                                </div>
                            ))
                        }
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={10} defaultSize={10} maxSize={10}>
                    <InputFormSection1 inputListObj={inputListObj} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ContentScreen


// input section 1
interface InputFormSectionProps {
    inputListObj: {
        inputListArr: {
            icon: JSX.Element;
            action: string;
            divId: MutableRefObject<HTMLDivElement | null>;
        }[];
        showDivFun: (id: string) => void;
    },
}
const InputFormSection1: React.FC<InputFormSectionProps> = ({ inputListObj }) => {
    return (
        <form className="flex flex-col gap-1 h-full items-center justify-center p-6">
            {inputListObj.inputListArr.map((v, i) => (
                <div key={i + v.action} onClick={() => inputListObj.showDivFun(v.divId.current?.id || "")} className="hover:bg-[#1c1f30] w-[8rem] h-[8rem] cursor-pointer rounded-md flex flex-col justify-center items-center p-2">
                    {v.icon}
                    <div className="self-center">{v.action}</div>
                </div>
            ))}
        </form>
    );
};

// input section 0
function InputFormSection({ resetFunction, onChangeHandeler }: {
    resetFunction: () => void;
    onChangeHandeler: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    const colorEffectArr = [
        {
            inputID: "Brightness",
            inputName: "Brightness",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: brightness,
            min: 0,
            max: undefined
        },
        {
            inputID: "saturate",
            inputName: "saturate",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: saturate,
            min: 0,
            max: undefined
        },
        {
            inputID: "blur",
            inputName: "blur",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: blur,
            min: 0,
            max: undefined
        },
        {
            inputID: "contrast",
            inputName: "contrast",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: contrast,
            min: 0,
            max: undefined
        },
        {
            inputID: "opacity",
            inputName: "opacity",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: opacity,
            min: 0,
            max: 100
        },
        {
            inputID: "grayscale",
            inputName: "grayscale",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: grayscale,
            min: 0,
            max: 100
        },
        {
            inputID:"sepia",
            inputName: "sepia",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: sepia,
            min: 0,
            max: 100
        },
        {
            inputID: "hue-rotate",
            inputName: "hue",
            inputIcon:<Sun strokeWidth={`1px`} size={20}/>,
            type: "number",
            defaultValue: hue_rotate,
            min: 0,
            max: 360
        },
    ];
    return (
        <form className="flex h-full items-center justify-center">
            <div id="inputListDiv" className=" flex-grow space-y-3">
                <div className="ml-1 space-y-2">
                    <Button className="" onClick={(e) => { e.preventDefault(); console.log('still working') }} variant={`outline`}>
                        <PlusIcon />Add image
                    </Button>
                    <br />
                    <Button onClick={(e) => { e.preventDefault(); resetFunction() }} variant={`outline`}>reset</Button>
                </div>
                <div className="space-y-2">
                {
                    colorEffectArr.map((v, i) =>{
                        return (
                        <div key={uuidv4()} className="bg-slate-800 flex justify-between">
                            <span>{v.inputIcon}</span>
                            <span>{v.inputName}</span>
                            <input className="text-white bg-[#25303d] w-[4rem]" type="number" name={v.inputID} min={v.min} max={v.max} 
                            defaultValue={v.defaultValue} onChange={(e) => onChangeHandeler(e)} id="" />
                        </div>
                    )})
                }
                </div>
            </div>
        </form>
    )
}