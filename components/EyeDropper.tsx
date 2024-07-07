"use client"

import { useCallback, useEffect, useRef, useState } from "react"

function EyeDropperJsx() {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const selectedColorList_Div = useRef<HTMLDivElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const newSelectedColor = useRef<HTMLInputElement | null>(null);
    const [pixelColor, setPixelColor] = useState("rgb(125, 141, 168)");
    const [selectedPixel, setSelectedPixel] = useState("");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMouseOver, setIsMouseOver] = useState(false);
    useEffect(() => {
        if (canvasRef.current && imageRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const image = imageRef.current;

            image.crossOrigin = "anonymous";

            image.onload = () => {
                if (context) {
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    setCtx(context);
                }
            };

            image.src = "https://raw.githubusercontent.com/ziadevcom/colorz-picker/main/demo.jpg";
        }
    }, []);
    const showvlue = useCallback((x: number, y: number) => {
        if (!ctx) {
            return;
        }
        const { data } = ctx?.getImageData(x, y, 1, 1);
        const rgb = `rgb(${data[0]},${data[1]},${data[2]},${data[3]})`
        setPixelColor(rgb);
    }, [ctx]);
    useEffect(() => {
        const start = () => {
            if (isMouseOver) {
                showvlue(mousePos.x, mousePos.y);
            }
        };
        start();
    }, [isMouseOver, mousePos, showvlue]);
    const onMouseMoveHandeler = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setMousePos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
    const mouseClickHandeler = () => {
        const all_selected_color = selectedColorList_Div.current?.childNodes
        if (all_selected_color && all_selected_color?.length >= 1) {
            return;
        }
        const newDiv = document.createElement('div');
        newDiv.style.height = '2.5rem'
        newDiv.style.width = '6rem'
        newDiv.style.backgroundColor = `${pixelColor}`;
        newDiv.style.fontSize = '10px'
        newDiv.style.borderRadius = '0.375rem'
        newDiv.innerText = `${pixelColor}`;
        setSelectedPixel(pixelColor);
        selectedColorList_Div.current?.appendChild(newDiv);
    }
    const changeColor = () => {
        if (!newSelectedColor.current || !newSelectedColor || !canvasRef.current) {
            return;
        }
        if (selectedPixel === "") {
            alert('please select some color');
            return;
        }
        const rgb = selectedPixel.match(/\d+/g)?.map(Number);
        if (rgb===undefined) {
            console.log(`rgb is undefined ${rgb}`)
            return;
        }
        const color = newSelectedColor.current.value;
        const rgbcolor = hex2rgb(color);
        let imageData = ctx!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        const dataArray = imageData!.data
        for (let i = 0; i < dataArray.length; i += 4) {
            const r = dataArray[i];
            const g = dataArray[i + 1];
            const b = dataArray[i + 2];            
            if (rgb[0] === r, rgb[1] === g, rgb[2] === b) {
                dataArray[i] = rgbcolor[0];
                dataArray[i+1] = rgbcolor[1];
                dataArray[i+2] = rgbcolor[2];
            }
        }

        const currectCavas = canvasRef.current;
        let currectCtx = currectCavas!.getContext('2d');
        if (!currectCtx) {
            console.log('currectCtx is null')
            return;
        }
        currectCtx!.putImageData(imageData,0,0)
        // console.log(imageData?.data)
    }
    const resetColor = ()=>{
        const canvas = canvasRef.current;
        const image = imageRef.current;
        image!.crossOrigin = "anonymous";
        image!.onload = () => {
            if (ctx) {
                ctx.drawImage(image!, 0, 0, canvas!.width, canvas!.height);
            }
        };
        image!.src = "https://raw.githubusercontent.com/ziadevcom/colorz-picker/main/demo.jpg";
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-3">
                <div className="relative bg-slate-500 w-[500px] h-[334px] ">
                    <picture>
                        <img
                            ref={imageRef}
                            src="https://raw.githubusercontent.com/ziadevcom/colorz-picker/main/demo.jpg"
                            alt="image"
                            className="w-[500px] h-[334px] hidden"
                        />
                    </picture>
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 cursor-crosshair"
                        width="500"
                        height="334"
                        onClick={mouseClickHandeler}
                        onMouseMove={onMouseMoveHandeler}
                        onMouseEnter={() => { setIsMouseOver(true) }}
                        onMouseLeave={() => { setIsMouseOver(false) }}
                    ></canvas>
                </div>
                <div className="flex flex-col gap-3">
                    <input ref={newSelectedColor} type="color" name="" id="" />
                    <button onClick={changeColor} className="bg-blue-700 rounded-md p-2">change</button>
                    <button onClick={resetColor} className="bg-blue-700 rounded-md p-2">reset</button>
                </div>
            </div>
            <div style={{ backgroundColor: pixelColor, }} className={` h-10 w-20 rounded-md`}>
            </div>
            <div ref={selectedColorList_Div} className={` h-auto w-40 rounded-md bg-slate-600`}>
            </div>
        </div>
    )
}

export default EyeDropperJsx

function hex2rgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return [r, g, b];
}

function RGBToHex(r: number, g: number, b: number) {
    let R = r.toString(16);
    let G = g.toString(16);
    let B = b.toString(16);

    if (R.length == 1)
        R = "0" + r;
    if (G.length == 1)
        G = "0" + g;
    if (B.length == 1)
        B = "0" + b;

    return "#" + r + g + b;
}