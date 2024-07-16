import useCanvas from "@/Hooks/useCanvas";
import { useCanvasClass } from "@/Hooks/useCanvasClass";
import { memo, useId, useRef } from "react";

function Canvas() {
    const id = useId();
    // useCanvas(id);
    useCanvasClass(id);
    return (
        <>
            <canvas id={id} className="max-w-full max-h-full w-full"></canvas>
        </>
    )
}
const MemoCanvas = memo(Canvas);
export { Canvas, MemoCanvas }