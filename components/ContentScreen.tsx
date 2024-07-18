"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef} from "react"

import "./ContentScreen.css"
import { FrameIcon, NotebookPen,Scaling, SlidersHorizontal, Sparkles} from "lucide-react"
import { MemoFineTune } from "./sidebars/Finetune"
import {MemoCanvas} from "./canvas/Canvas"
import Filter from "./sidebars/Filter"


function ContentScreen() {
    const hiddenPanelAdjustRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelFinetuneRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelFilterRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelAnnotateRef = useRef<HTMLDivElement | null>(null);
    const hiddenPanelResizeRef = useRef<HTMLDivElement | null>(null);

    const sidePanel = useMemo(() => [
        {
            uuid: "87b04ef2-799b-4cf5-8d4a-7d23939ba1fc",
            sidePanelname: "Adjust",
            content: <div>Adjust</div>,
            sidepanelRef: hiddenPanelAdjustRef,
        },
        {
            uuid: "b8e2c4d2-4e2d-432d-b1f8-c504e6ae9837",
            sidePanelname: "Finetune",
            content: <MemoFineTune />,
            sidepanelRef: hiddenPanelFinetuneRef,
        },
        {
            uuid: "ffa8c705-212e-4e69-8d95-8a0874b60c5d",
            sidePanelname: "Filter",
            content: <Filter/>,
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
    ], [hiddenPanelAdjustRef, hiddenPanelFinetuneRef, hiddenPanelFilterRef, hiddenPanelAnnotateRef, hiddenPanelResizeRef]);

    const showDivFun = useCallback((id: string) => {
        if (id === "") {
            console.log('pass id');
            return;
        }
        const currectDiv = document.querySelector(`#${id}`) as HTMLDivElement;


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
    }, [sidePanel])

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
    return (
        <div className="h-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] border w-full"
            >
                <ResizablePanel defaultSize={75}>
                    <div className="flex justify-center items-center h-full relative">
                        <MemoCanvas/>
                        {
                            sidePanel.map((v) => (
                                <div key={v.uuid} ref={v.sidepanelRef} id={v.sidePanelname} className="bg-slate-900 h-full absolute right-0 
                                w-[12%] hidden">
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

const ContentScreenMemo = React.memo(ContentScreen);
export default ContentScreenMemo;


//menubar section
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


