import { hexToRgb } from "@/lib/utils";
import { FineTuneTypes } from "@/packages/store/atoms/FinetuneAtom";

interface ImageData {
    image: HTMLImageElement | null;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
}

const imageHtml: ImageData = {
    image: null,
    sx: 0,
    sy: 0,
    sWidth: 0,
    sHeight: 0,
    dx: 0,
    dy: 0,
    dWidth: 0,
    dHeight: 0,
};

export function ZoomImage() {

}
export function moveImage() {

}
export function resetImageToCenter() {

}
export function AddMoreImage() {

}
export function mergeAllImage() {

}
function setCanvas(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    const ctx = canvas.getContext(`2d`);
    if (!ctx) {
        console.log(`ctx might be null`);
        console.log(ctx)
        return;
    }
    if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.scale(ratio, ratio);
    }
}
export function DrawImage(canvas: HTMLCanvasElement, image: HTMLImageElement, drawFullCanvas: boolean = false) {
    setCanvas(canvas);
    const ctx = canvas.getContext(`2d`);
    if (!ctx) {
        console.log(`ctx might be null`);
        console.log(ctx)
        return;
    }
    if (image.complete && image.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const hRatio = canvas.width / image.width;
        const vRatio = canvas.height / image.height;
        let ratio: number
        if (drawFullCanvas) {
            ratio = Math.max(hRatio, vRatio);
        } else {
            ratio = Math.min(hRatio, vRatio);
        }
        const centerX = (canvas.width - (image.width * ratio)) / 2;
        const centerY = (canvas.height - (image.height * ratio)) / 2;
        ctx.drawImage(image, 0, 0, image.width, image.height, centerX, centerY, image.width * ratio, image.height * ratio);
    } else {
        console.log(image);
    }

}

export function ApplyFilter(canvas: HTMLCanvasElement, colorFilter: FineTuneTypes) {
    const ctx = canvas.getContext(`2d`);
    if (!ctx) {
        console.log(`ctx might be null`);
        console.log(ctx)
        return;
    }
    ctx.filter = `brightness(${colorFilter.brightness}%) contrast(${colorFilter.contrast}%) grayscale(${colorFilter.grayscale}%) 
    blur(${colorFilter.blur}px) opacity(${colorFilter.opacity}%) saturate(${colorFilter.saturate}%) sepia(${colorFilter.sepia}%) invert(${colorFilter.invert}%)
    hue-rotate(${colorFilter.hue_rotate}deg)`;
    ctx.drawImage(canvas, 0, 0);
}

export function ApplyTintColor(canvas: HTMLCanvasElement, colorFilter: FineTuneTypes) {
    if (!colorFilter.color || colorFilter.color === '') {
        console.error(`color filter is emplty ${colorFilter.color}`)
        return;
    }
    const ctx = canvas.getContext(`2d`);
    if (!ctx) {
        console.log(`ctx might be null`);
        console.log(ctx)
        return;
    }

    const rgb = hexToRgb(colorFilter.color);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + rgb.r);
        data[i + 1] = Math.min(255, data[i + 1] + rgb.g);
        data[i + 2] = Math.min(255, data[i + 2] + rgb.b);
    }
    ctx.putImageData(imageData, 0, 0);
}