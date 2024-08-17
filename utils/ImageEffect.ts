import { hexToRgb } from "@/lib/utils";
import { FineTuneTypes } from "@/packages/store/atoms/FinetuneAtom";

export class ImageEffect {
    public canvas: HTMLCanvasElement = document.createElement('canvas');
    public filter: FineTuneTypes | null = null;
    public ImageEle:HTMLImageElement;
    private ctx:CanvasRenderingContext2D|null;
    constructor(image:HTMLImageElement){
        this.ImageEle=image;
        this.ctx = this.canvas.getContext(`2d`);
        this.initializeCanvas(image);
        this.drawImage(image);
    }
    private initializeCanvas(image: HTMLImageElement): void {
        this.canvas.width = image.width;
        this.canvas.height = image.height;
    }
    filterValue(){
        return this.filter;
    }
    drawImage(image:HTMLImageElement){
        this.ctx?.drawImage(image,0,0);
        return this.canvas;
    }
    applyFilter(filter:FineTuneTypes){
        if (!this.ctx) {
            return;
        }
        this.filter=filter;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) grayscale(${filter.grayscale}%) 
            blur(${filter.blur}px) opacity(${filter.opacity}%) saturate(${filter.saturate}%) sepia(${filter.sepia}%) invert(${filter.invert}%)
            hue-rotate(${filter.hue_rotate}deg)`;
        this.drawImage(this.ImageEle);
        return this.canvas;
    }
    applyTint(hex:string){
        if (!this.ctx) {
            return;
        }
        const rgb = hexToRgb(hex);
        let imageData =  this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
        this.addTintColor(imageData,rgb);
        this.ctx.putImageData(imageData,0,0);
    }
    addTintColor(imageData:ImageData,rgb:{
        r: number;
        g: number;
        b: number;
    }){
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = Math.min(255, imageData.data[i] + rgb.r);
            imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + rgb.g);
            imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + rgb.b);
        }
        return imageData;
    }
}