import { CanvasDraw } from "@/utils/CanvasClass";
import { useCallback, useEffect, useRef, useState } from "react";

export function useCanvasDraw(imageUrl: string) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasDraw, setCanvasDraw] = useState<CanvasDraw | null>(null);

    const loadImage = useCallback((url: string) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
            if (canvasDraw) {
                canvasDraw.setImage(image);
                canvasDraw.drawImage();
            }
        };
    }, [canvasDraw]);

    useEffect(() => {
        if (canvasRef.current) {
            const draw = new CanvasDraw(canvasRef.current);
            setCanvasDraw(draw);
        }
    }, []);

    useEffect(() => {
        if (imageUrl) {
            loadImage(imageUrl);
        }
    }, [imageUrl, loadImage]);

    return canvasRef;
}