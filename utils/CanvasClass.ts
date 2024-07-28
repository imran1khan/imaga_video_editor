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
type Mode = 'none' | 'drag' | 'drawTriangle';
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
    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private filter: FineTuneTypes | null = null;
    public dragStartX: number = 0;
    public dragStartY: number = 0;
    public mode: Mode = `none`;
    public scale:number=1;
    private showBorder=false;
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
        this.addEventListeners();
    };
    addEventListeners() {
        window.addEventListener(`resize`,(e)=>{});
        this.canvas.addEventListener(`mousedown`, this.mouseDown.bind(this));
        this.canvas.addEventListener(`mousemove`, this.mouseMove.bind(this))
        this.canvas.addEventListener(`mouseup`, this.mouseUp.bind(this))
        this.canvas.addEventListener(`mouseout`, (e) => { })
        this.canvas.addEventListener(`wheel`, this.onWheel.bind(this))
    }
    mouseDown(e: MouseEvent) {
        const mousePos = this.getMousePostion(e);
        if (this.IsMouseOverImage(mousePos.x, mousePos.y)) { // if mouse is over the image and left mouse click is pressed then we assume that user want to drag the image
            this.mode = `drag`;
            this.dragStartX = mousePos.x - this.imageData.dx;
            this.dragStartY = mousePos.y - this.imageData.dy;
        }
    }
    mouseMove(e: MouseEvent) {
        this.showSelection(e);
        if (this.mode === `drag`) {
            this.dragMoveImage(e);
        }
        if (this.filter?.color !==`` && this.filter) {
            this.applyTintColor(this.filter);
        }
    }
    mouseUp() {
        this.mode = `none`;
    }
    onWheel(e: WheelEvent) {
        if (e.ctrlKey) {
            e.preventDefault();
            const mousePos = this.getMousePostion(e);
            const zoom = e.deltaY < 0 ? 1.1 : 0.9;
            this.zoom(mousePos.x,mousePos.y,zoom);
        }
    }
    zoom(mouseX:number,mouseY:number,zoom:number) {
        if (this.scale>20000 && zoom===1.1) {
            return;
        }
        else if (this.scale<0.04 && zoom===0.9) {
            return;
        }
        const previousScale = this.scale;
        this.scale *=zoom;
        this.imageData.dx = mouseX-((mouseX-this.imageData.dx)*this.scale/previousScale)
        this.imageData.dy = mouseY-((mouseY-this.imageData.dy)*this.scale/previousScale)
        this.drawImage();
    }
    dragMoveImage(e: MouseEvent) {
        const mousePos = this.getMousePostion(e);
        // we are minus the new mouse position to the difference between old mouse position it's just a way to preserve the distnace between new mouse position and the image left top corner
        this.imageData.dx = mousePos.x - this.dragStartX;
        this.imageData.dy = mousePos.y - this.dragStartY;
        this.drawImage();
    }
    showSelection(e: MouseEvent) {// basically this function show all the element which can be selected via mouse if mouse is above an element the mouse style is going to get change
        const mousePos = this.getMousePostion(e);
        if (this.IsMouseOverImage(mousePos.x, mousePos.y)) {
            const target = e.target as HTMLElement;
            target.style.cursor = `move`
            this.ctx!.strokeStyle = `#976cf5`
            this.showBorder=true;
        }
        else {
            const target = e.target as HTMLElement;
            target.style.cursor = `default`
            this.ctx!.strokeStyle = `transparent`
            this.showBorder=false
        }
        this.drawImage();
    }
    IsMouseOverImage(x: number, y: number) {
        return (
            x >= this.imageData.dx &&
            x <= this.imageData.dx + this.imageData.dWidth*this.scale &&
            y >= this.imageData.dy &&
            y <= this.imageData.dy + this.imageData.dHeight*this.scale
        )
    }
    setBorder() {
        if (!this.ctx || !this.imageData.image) {
            return;
        }
        this.ctx.save();
        this.ctx.translate(this.imageData.dx, this.imageData.dy);
        this.ctx.scale(this.scale,this.scale);
        if (this.ctx.strokeStyle !== 'transparent') {
            this.ctx.lineWidth = 2 / this.ctx.getTransform().a;
            this.ctx.strokeStyle = '#976cf5';
            this.ctx.strokeRect(0, 0, this.imageData.image.width, this.imageData.image.height);
            // this.ctx.strokeRect(this.imageData.dx, this.imageData.dy, this.imageData.dWidth, this.imageData.dHeight);
        }
        this.ctx.restore();
    }
    getMousePostion(e: MouseEvent | WheelEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
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

        this.imageData.dx = (this.canvas.width - image.width) / 2;
        this.imageData.dy = (this.canvas.height - image.height) / 2;
        this.imageData.sWidth = image.width;
        this.imageData.sHeight = image.height;
        this.imageData.dWidth = image.width;
        this.imageData.dHeight = image.height;
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
        const DataUrl = this.getSectionDataURL(this.imageData.dx, this.imageData.dy, this.imageData.dWidth*this.scale, this.imageData.dHeight*this.scale);
        return DataUrl;
    }
    getDataUrl2(type: string) {
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
        return tempCanvas.toDataURL(`image/${type}`);
    };
    getDataUrl3(image: HTMLImageElement) {
        let tempCanvas = document.createElement(`canvas`);
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        let temp_ctx = tempCanvas.getContext(`2d`);
        if (!temp_ctx || !this.ctx) {
            return;
        }
        temp_ctx.filter = this.ctx.filter;
        temp_ctx.drawImage(image, 0, 0);
        if (this.filter) {
            this.applyTintColorOnCanvas(tempCanvas, this.filter);
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
        let imagedata = this.ctx.getImageData(this.imageData.dx, this.imageData.dy, this.imageData.dWidth*this.scale, this.imageData.dHeight*this.scale);
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
        this.ctx.save();
        this.ctx.translate(this.imageData.dx, this.imageData.dy);
        this.ctx.scale(this.scale,this.scale);
        this.ctx.drawImage(this.imageData.image, 0, 0, this.imageData.image.width, this.imageData.image.height);
        this.ctx.restore();
        if (this.showBorder) {
            this.setBorder();
        }
    };
    adjustCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height= window.innerHeight;
    };

    clear(): void {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}
