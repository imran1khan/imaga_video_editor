"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Image from "next/image"
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import "./ContentScreen.css"
import { Button } from "./ui/button"

let brightness=100
let saturate=100
let blur=0

function ContentScreen() {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const onChangeHandeler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!imgRef || !imgRef.current) {
            console.log(`imgRef is ${imgRef}`)
            return;
        }
        switch (e.target.name) {
            case "Brightness":
                brightness=parseFloat(e.target.value);
                break;
            case "saturate":
                saturate=parseFloat(e.target.value);
                break;
            case "blur":
                blur=parseFloat(e.target.value);
                break;
            default:
                break;
        }
        const styleStr = `brightness(${brightness}%) saturate(${saturate}%) blur(${blur}px)`;
        imgRef.current!.style.filter = styleStr;
        console.log(styleStr)
    }, []);

    const resetFunction = () => {
        imgRef.current!.style.filter = `brightness(100%) saturate(100%) blur(0px)`;
    }
    return (
        <div className="h-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] border w-full"
            >
                <ResizablePanel defaultSize={75}>
                    <div className="flex h-full items-center justify-center p-6">
                        <img ref={imgRef} src="https://raw.githubusercontent.com/ziadevcom/colorz-picker/main/demo.jpg" alt="" />
                        {/* <Image alt="" width={100} height={100} src={`https://raw.githubusercontent.com/ziadevcom/colorz-picker/main/demo.jpg`}/> */}
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={10} defaultSize={15} maxSize={20}>
                    <form className="flex h-full items-center justify-center p-6">
                        <div className="flex-1 space-y-3">
                            <Button onClick={(e) => { e.preventDefault(); resetFunction() }} variant={`outline`}>reset</Button>
                            <br />
                            <div className="bg-slate-800 rounded-sm">
                                <div className="flex justify-center my-2">brightness</div>
                                <input className="text-black w-full" type="number" name="Brightness" min={0} defaultValue={100} onChange={(e) => onChangeHandeler(e)} id="" />
                            </div>
                            <div className="bg-slate-800 rounded-sm">
                                <div className="flex justify-center my-2">saturate</div>
                                <input className="text-black w-full" type="number" name="saturate" min={0} defaultValue={100}  onChange={(e) => onChangeHandeler(e)} id="" />
                            </div>
                            <div className="bg-slate-800 rounded-sm">
                                <div className="flex justify-center my-2">blur</div>
                                <input className="text-black w-full" type="number" name="blur" min={0} defaultValue={0} onChange={(e) => onChangeHandeler(e)} id="" />
                            </div>
                        </div>
                    </form>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ContentScreen

const valueArray = {
    inputList: [
        {

        }
    ]
}