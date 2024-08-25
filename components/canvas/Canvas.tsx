import { useCanvasClass } from "@/Hooks/useCanvasClass";
import { memo, useId, useRef } from "react";

function Canvas() {
    const id =useId();
    const id2=useId();
    // useCanvas(id);
    useCanvasClass(id,id2);
    return (
        <>
            <canvas id={id} className="w-full h-full"></canvas>
            <canvas id={id2} className="w-full h-full absolute top-0 left-0 z-0"></canvas>
        </>
    )
}
const MemoCanvas = memo(Canvas);
export { Canvas, MemoCanvas }