import { hexToRgb } from "@/lib/utils";
import { FineTuneTypes } from "@/packages/store/atoms/FinetuneAtom";

interface ImageValue {
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

export class CanvasDraw {
    private imageData: ImageValue = {
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
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private filter: FineTuneTypes | null = null;
    constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
        this.canvas = canvas
        const ctx = canvas.getContext(`2d`);
        this.ctx = ctx
        if (!this.ctx) {
            console.log(`something went wrong in the CanvasDraw class ctx=${ctx}`)
            return;
        }
        this.adjustCanvas();
        this.setImage(image);
        this.drawImage();
    };

    setImage(image: HTMLImageElement, drawFullCanvas: boolean = false) {
        this.imageData.image = image;
        const hRatio = this.canvas.height / image.height;
        const wRatio = this.canvas.width / image.width;
        let ratio: number
        if (drawFullCanvas) {
            ratio = Math.max(hRatio, wRatio);
        } else {
            ratio = Math.min(hRatio, wRatio);
        }
        this.imageData.dx = (this.canvas.width - (image.width * ratio)) / 2;
        this.imageData.dy = (this.canvas.height - (image.height * ratio)) / 2;
        this.imageData.sWidth = image.width;
        this.imageData.sHeight = image.height;
        this.imageData.dWidth = image.width * ratio;
        this.imageData.dHeight = image.height * ratio;
    };
    applyFilter(colorFilter: FineTuneTypes) {
        if (!this.ctx || !this.imageData.image) {
            return;
        }
        this.filter = colorFilter;
        this.ctx.filter = `brightness(${colorFilter.brightness}%) contrast(${colorFilter.contrast}%) grayscale(${colorFilter.grayscale}%) 
            blur(${colorFilter.blur}px) opacity(${colorFilter.opacity}%) saturate(${colorFilter.saturate}%) sepia(${colorFilter.sepia}%) invert(${colorFilter.invert}%)
            hue-rotate(${colorFilter.hue_rotate}deg)`;
        this.drawImage();
    }
    getdataUrl() {
        if (!this.imageData.image) {
            return;
        }
        const DataUrl = this.getSectionDataURL(this.imageData.dx, this.imageData.dy, this.imageData.dWidth, this.imageData.dHeight);
        return DataUrl;
    }
    getDataUrl2() {
        let tempCanvas = document.createElement(`canvas`);
        if (!this.imageData.image) {
            return;
        }
        tempCanvas.width = this.imageData.image.width;
        tempCanvas.height = this.imageData.image.height;
        const tempCtx = tempCanvas.getContext(`2d`);
        if (!tempCtx || !this.ctx) {
            return;
        }
        tempCtx.filter = this.ctx.filter;
        tempCtx.drawImage(this.imageData.image, 0, 0);
        if (this.filter) {
            this.applyTintColorOnCanvas(tempCanvas, this.filter);
        }
        return tempCanvas.toDataURL();
    };
    getDataUrl3(image:HTMLImageElement){
        let tempCanvas = document.createElement(`canvas`);
        tempCanvas.width = image.width;
        tempCanvas.height=image.height;
        let temp_ctx = tempCanvas.getContext(`2d`);
        if (!temp_ctx || !this.ctx) {
            return;
        }
        temp_ctx.filter = this.ctx.filter;
        temp_ctx.drawImage(image,0,0);
        if (this.filter) {
            this.applyTintColorOnCanvas(tempCanvas,this.filter);
        }
        return tempCanvas.toDataURL();
    }
    getSectionDataURL(sx: number, sy: number, sw: number, sh: number) {
        if (!this.imageData.image || !this.ctx) {
            return;
        }
        const tempCanvas = document.createElement(`canvas`);
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        const tempCtx = tempCanvas.getContext(`2d`);
        if (!tempCtx) {
            return
        }
        tempCtx.drawImage(this.canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        return tempCanvas.toDataURL();
    }
    applyTintColorOnCanvas(canvas: HTMLCanvasElement, colorFilter: FineTuneTypes) {
        const tempCtx = canvas.getContext(`2d`);
        if (!tempCtx) {
            return;
        }
        const rgb = hexToRgb(colorFilter.color);
        let imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        this.AddTintColor(imgData, rgb);
        tempCtx.putImageData(imgData, 0, 0);
        // this.ctx.putImageData(imagedata,this.imageData.dx, this.imageData.dy,0,0,this.imageData.dWidth,this.imageData.dHeight); this is another way to slove this
    }
    AddTintColor(imageData: ImageData, rgb: {
        r: number;
        g: number;
        b: number;
    }) {
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = Math.min(255, imageData.data[i] + rgb.r);
            imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + rgb.g);
            imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + rgb.b);
        }
        return imageData;
    }
    applyTintColor(colorFilter: FineTuneTypes) {
        if (!this.ctx || !this.imageData.image || colorFilter.color === "") {
            return;
        }
        const rgb = hexToRgb(colorFilter.color);
        let imagedata = this.ctx.getImageData(this.imageData.dx, this.imageData.dy, this.imageData.dWidth, this.imageData.dHeight);
        this.AddTintColor(imagedata, rgb);
        this.ctx.putImageData(imagedata, this.imageData.dx, this.imageData.dy);
    }
    drawImage() {
        if (!this.ctx || !this.imageData.image) {
            console.error(`cannot draw image: contex or image is not set`);
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imageData.image, this.imageData.sx, this.imageData.sx, this.imageData.sWidth, this.imageData.sHeight, this.imageData.dx, this.imageData.dy, this.imageData.dWidth, this.imageData.dHeight);
    };
    adjustCanvas() {
        const { width, height } = this.canvas.getBoundingClientRect();
        if (this.canvas.width !== width || this.canvas.height !== height) {
            const ratio = window.devicePixelRatio || 1;
            this.canvas.width = width * ratio;
            this.canvas.height = height * ratio;
            if (this.ctx) {
                this.ctx.scale(ratio, ratio);
            }
        }
    };

    clear(): void {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}
