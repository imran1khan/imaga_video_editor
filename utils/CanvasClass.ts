import { hexToRgb, RandomInt } from "@/lib/utils";
import { FineTuneTypes } from "@/packages/store/atoms/FinetuneAtom";
import { ImageEffect } from "./ImageEffect";
import { arc, arc2, pointsArray, point, point2, rectangle, RGBA, shape } from "./Interface";
import { ShapeManager } from "./ShapeManger";


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
interface ImagePosition {
    px: null | number,
    py: null | number,
    index: null | number,
    w:null|number,
    h:null|number
}
type Mode = 'none'|'drag'|'dragCustomShape'|'drawTriangle'|'InteractiveRactangle'|'imageResize'|'rotate'|'resize';
export type drawingMode = `none`|`ractangle`|`arc`|'line'|'pen';
interface imageEffectObject {
    px: number
    py: number
    width: number,
    height: number
    imageEffectObj: ImageEffect
}

export class CanvasDraw {
    public StaticCanvas: HTMLCanvasElement;
    public InteractiveCanvas:HTMLCanvasElement;
    public InteractiveCtx:CanvasRenderingContext2D|null;
    private ctx: CanvasRenderingContext2D | null = null;
    private filter: FineTuneTypes | null = null;
    public dragStartX: number = 0;
    public dragStartY: number = 0;
    public mode: Mode = `none`;
    public drawMode:drawingMode=`none`;
    public scale: number = 1;
    private showBorder = false;
    public imageEffectObj: imageEffectObject[] = [];
    private SelectedImage: ImagePosition = { px: null, py: null, index: null,w:null,h:null };
    private Origin = { x: 0, y: 0 };
    private InterativeRectangle={x:0,y:0};
    private FrameCodinate:{cornerRact:point[],size:number,circlePoint:{x:number,y:number,radius:number}}={cornerRact:[],size:0,circlePoint:{y:0,x:0,radius:0}};//this is for showng
    // for resize image
    private corner:null|number=null;
    public changeAspect:boolean=false;
    //draw ractangle
    public startPoint:point={x:null,y:null};
    public startDrawing:boolean=false;
    // array of objects
    public ShapeManger;
    public shapesArray:shape[]=[];
    public currentShape:shape|null=null;
    public StaticCanvasColor:string='';
    public MoveShape:{index:number,dx:number,dy:number}|null=null;
    public resizeShape:{index:number,dx:number,dy:number,closePoint:point2}|null=null;
    // for roating he shape
    public startAngle:{angle:number,center:point2}|null=null;
    public selectedShape:{shape:shape,index:number}|null=null;
    //show frame
    public showFrame:boolean=true;
    // handdrawn shape
    public customeShape:pointsArray|null=null;
    constructor(canvas: HTMLCanvasElement,interactiveCanvas:HTMLCanvasElement, image?: HTMLImageElement) {
        this.StaticCanvas = canvas
        this.InteractiveCanvas=interactiveCanvas;
        this.ctx = canvas.getContext(`2d`);
        this.InteractiveCtx = interactiveCanvas.getContext(`2d`);
        if (!this.ctx) {
            console.log(`something went wrong in the CanvasDraw class ctx=${this.ctx}`)
            return;
        }
        // setting the initial color of the static canvas
        this.ShapeManger = new ShapeManager(this.ctx)
        this.StaticCanvasColor = '#020617'
        this.adjustCanvas();
        if (image) {
            this.addImage(image)
            this.drawCanvas();
        }
    };
    addEventListinerInterative(){
        this.InteractiveCanvas.addEventListener(`mousedown`,this.mouseDownInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`mousemove`,this.mouseMoveInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`mouseup`,this.mouseUpInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`click`,this.mouseClickInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`wheel`,this.onWheel.bind(this));
    }
    removeEventListinerInterative(){
        this.InteractiveCanvas.removeEventListener(`mousedown`,this.mouseDownInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`mousemove`,this.mouseMoveInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`mouseup`,this.mouseUpInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`click`,this.mouseClickInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`wheel`,this.onWheel.bind(this));
    }
    addEventListeners_Static() {
        window.addEventListener(`resize`, (e) => { });
    }
    removeEventListiner_Static() {
        window.removeEventListener(`resize`, (e) => { });
    }
    mouseClickInteractive(e:MouseEvent){
        const mousePos = this.getMousePostion2(e).InteractiveCanvas;
        const imagePos = this.IsMouseOverImage(mousePos.x,mousePos.y);
        const shapeIndex = this.ShapeManger?.isMouseOverTheShape(mousePos.x,mousePos.y);
        if (shapeIndex!==null && shapeIndex!==undefined) {
            const shape = this.ShapeManger!.shapesArray[shapeIndex];
            this.selectedShape={shape:shape,index:shapeIndex};
            this.clearInteractive();
            if (this.showFrame) {
                this.FrameAround_Shape(shape);
            }
        }
        if (imagePos.index!==null && imagePos.px!==null && imagePos.py!==null) {
            // const image = this.imageEffectObj[imagePos.index];
            const {AdjustedImageCordinate}=this.getAllCordinate(imagePos.index);
            this.clearInteractive();
            if (this.showFrame) {
                this.drawFrame(AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.topLeft.y,AdjustedImageCordinate.bottomRight.x-AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.bottomRight.y-AdjustedImageCordinate.topLeft.y);
            }
        }
    }
    mouseDownInteractive(e:MouseEvent){
        const mousePos = this.getMousePostion2(e).InteractiveCanvas;
        //mouse position of the drawing canvas and the intercative canvas is going to be same
        const imagePos = this.IsMouseOverImage(mousePos.x,mousePos.y);
        const check = this.checkForFrameCorner(e);
        const index = this.ShapeManger?.isMouseOverTheShape(mousePos.x,mousePos.y);
        const customeShapeIndex = this.ShapeManger!.isMouseOverCustomShape(mousePos.x,mousePos.y);
        if (customeShapeIndex>-1) {
            const shape=this.ShapeManger!.penShapes[customeShapeIndex];
            this.MoveShape={index:customeShapeIndex,dx:e.clientX-shape[0].x,dy:e.clientY-shape[0].y};
            this.mode='dragCustomShape';
        }
        else if (index!==null && index!==undefined && this.drawMode==='none') {
            const shape = this.ShapeManger!.shapesArray[index];
            this.mode='drag';
            const {startPoint} = this.ShapeManger!.shapesArray[index];
            this.MoveShape={index:index,dx:e.clientX-startPoint.x!,dy:e.clientY-startPoint.y!};
            if (shape.type==='line') {
                const {startPoint,endPoint}=shape;
                const mousePointer={x:e.clientX,y:e.clientY};
                const ds1=this.ShapeManger!.calculateDistance(startPoint,mousePointer);
                const ds2=this.ShapeManger!.calculateDistance(endPoint,mousePointer);
                const MinDist = ds1<ds2?ds1:ds2;
                const closePoint = MinDist===ds1?startPoint:endPoint;
                if (MinDist<=5) {
                    this.mode='resize';
                    this.resizeShape={index:index,dx:e.clientX-closePoint.x!,dy:e.clientY-closePoint.y!,closePoint:closePoint};
                }
            }
        }
        else if (check!==null && check<4 && this.SelectedImage.index!==null) {
            this.mode='imageResize';
            this.corner=check
        }
        else if (check===4) {
            this.mode='rotate';
            if (this.selectedShape?.shape?.type==='rectangle2') {
                const {startPoint,endPoint}=this.selectedShape.shape;
                const w = endPoint.x-startPoint.x;
                const h = endPoint.y-startPoint.y;
                const cx = startPoint.x!+(w)/2;
                const cy = startPoint.y!+(h)/2;
                const angle = Math.atan2(e.clientY-cy,e.clientX-cx);
                this.startAngle={angle:angle,center:{x:cx,y:cy}};
            }

        }
        else if (imagePos.index!==null && imagePos.px!==null && imagePos.py!==null) {
            this.mode='drag';
            this.dragStartX = (mousePos.x - this.Origin.x) / this.scale - imagePos.px;
            this.dragStartY = (mousePos.y - this.Origin.y) / this.scale - imagePos.py;
            this.SelectedImage = imagePos;
        }
        else {
            this.mode = `InteractiveRactangle`;
            this.InterativeRectangle={x:mousePos.x,y:mousePos.y}
        }
        if (this.drawMode==='ractangle') {
            this.startDrawing = true;
            this.startPoint = {x:e.clientX,y:e.clientY};
        }
        if (this.drawMode === 'arc') {
            this.startDrawing=true;
            this.startPoint = {x:e.clientX,y:e.clientY};
        }
        if (this.drawMode==='line') {
            this.startDrawing=true;
            this.startPoint = {x:e.clientX,y:e.clientY};
        }
        if (this.drawMode === 'pen') {
            this.customeShape=[{x:e.clientX,y:e.clientY}];
            this.startDrawing=true;
        }
    }
    mouseMoveInteractive(e:MouseEvent){
        if (this.mode==='InteractiveRactangle' && !this.startDrawing) {
            this.clearInteractive();
            this.drawRectangle(this.InterativeRectangle.x,this.InterativeRectangle.y,e.clientX-this.InterativeRectangle.x,e.clientY-this.InterativeRectangle.y);
        }
        if (this.mode==='rotate') {
            const {center,angle}=this.startAngle!;
            const currentAngle = Math.atan2(e.clientY-center.y,e.clientX-center.x);
            const New_Angle = currentAngle-angle;
            const {shape,index}=this.selectedShape!;
            if (shape.type==='rectangle2') {
                this.drawCanvas();
                this.currentShape={...shape,angle:New_Angle}
                this.ShapeManger?.drawRectangleWithArc(shape.startPoint.x,shape.startPoint.y,shape.endPoint.x-shape.startPoint.x,shape.endPoint.y-shape.startPoint.y,{rotation:New_Angle});
            };
        }
        if (this.mode === `drag`) {
            if (this.MoveShape) {
                this.drawCanvas()
                this.dragMoveShape(e);
            }
            else {
                this.dragMoveImage2(e);
            }
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawShapes();
        }
        if (this.mode==='dragCustomShape' && this.MoveShape) {
            const {index,dx,dy}=this.MoveShape;
            const shape = this.ShapeManger!.penShapes[index];
            const newFirstPoint = {x:e.clientX-dx,y:e.clientY-dy};
            const deltaX = newFirstPoint.x-shape[0].x;
            const deltaY = newFirstPoint.y-shape[0].y;
            for (let i = 1; i < shape.length; i++) {
                shape[i].x+=deltaX;
                shape[i].y+=deltaY;
            }
            shape[0]=newFirstPoint;
            this.ShapeManger!.penShapes[index]=shape;
            this.ShapeManger?.drawCustomShape();
        }
        else if (this.mode==='resize' && this.resizeShape) {
            const shape = this.ShapeManger!.shapesArray[this.resizeShape.index];
            if (shape.type === 'line') {
                const {closePoint,dx,dy}=this.resizeShape;
                const {endPoint,startPoint}=shape;
                if (startPoint.x===closePoint.x && startPoint.y===closePoint.y) {
                    const X = e.clientX-dx;
                    const Y = e.clientY-dy;
                    this.currentShape = {type:'line',startPoint:{x:X,y:Y},endPoint}
                }
                else{
                    const X = e.clientX-dx;
                    const Y = e.clientY-dy;
                    this.currentShape = {type:'line',startPoint,endPoint:{x:X,y:Y}};
                }
                this.drawCanvas();
                this.ShapeManger?.drawShapes();
                this.ShapeManger?.drawLine(this.currentShape.startPoint,this.currentShape.endPoint);
            }
        }
        else if (this.mode==='imageResize'){
            if (this.corner!==null) {
                this.resizeImage(e,this.corner,this.changeAspect);
                this.clear();
                this.clearInteractive();
                const {AdjustedImageCordinate}=this.getAllCordinate(this.SelectedImage.index!);
                this.drawFrame(AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.topLeft.y,AdjustedImageCordinate.bottomRight.x-AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.bottomRight.y-AdjustedImageCordinate.topLeft.y);
                this.drawCanvas();
            }
        }
        if (this.drawMode==='ractangle' && this.startDrawing){
            if (!this.startPoint.x || !this.startPoint.y) {
                return;
            }
            const w = e.clientX-this.startPoint.x;
            const h = e.clientY-this.startPoint.y;
            
            const p1={x:this.startPoint.x,y:this.startPoint.y}
            const p2={x:e.clientX,y:e.clientY}
            this.currentShape={type:'rectangle2',startPoint:p1,endPoint:p2,angle:0}
            this.drawCanvas();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawRectangleWithArc(this.startPoint.x,this.startPoint.y,w,h,{rotation:this.currentShape.angle});
        }
        if (this.drawMode==='arc' && this.startDrawing) {
            if (!this.startPoint.x || !this.startPoint.y) {
                return;
            }
            const radius = this.ShapeManger!.calculateDistance({x:this.startPoint.x,y:this.startPoint.y},{x:e.clientX,y:e.clientY});
            this.currentShape = {type:'arc',startPoint:{x:this.startPoint.x,y:this.startPoint.y},radius:radius,startAngle:0,endAngle:2*Math.PI,counterClockWise:false};
            this.drawCanvas();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawLine({x:this.startPoint.x,y:this.startPoint.y},{x:e.clientX,y:e.clientY},{setLineDesh:[5,3]});
            this.ShapeManger?.drawArc(this.currentShape);
        }
        if (this.drawMode==='line' && this.startDrawing) {
            if (!this.startPoint.x || !this.startPoint.y) {
                return;
            }
            const startPoint={x:this.startPoint.x,y:this.startPoint.y};
            const endpoint = {x:e.clientX,y:e.clientY};
            this.currentShape={type:'line',startPoint:startPoint,endPoint:endpoint};
            this.drawCanvas();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawLine(startPoint,endpoint);
        }
        if (this.drawMode==='pen' && this.startDrawing && this.customeShape) {
            this.customeShape=[...this.customeShape,{x:e.clientX,y:e.clientY}];
            this.ShapeManger?.drawPenShape(this.customeShape);
        }
        const check = this.checkForFrameCorner(e);
        if (check===null) {
            this.showSelection(e);
        }
    }
    mouseUpInteractive(e:MouseEvent){
        const ctx = this.InteractiveCanvas.getContext(`2d`);
        if (this.mode === "InteractiveRactangle") {
            ctx?.clearRect(0,0,this.InteractiveCanvas.width,this.InteractiveCanvas.height);
            this.mode='none';   
        }
        if (this.mode===`drag` || this.mode ==='dragCustomShape') {
            this.mode='none'
            this.MoveShape=null
        }
        if (this.mode==='resize' && this.currentShape && this.resizeShape) {
            this.ShapeManger?.shapesArray.splice(this.resizeShape.index,1);
            this.ShapeManger?.shapesArray.push(this.currentShape);
            this.mode='none';
            this.resizeShape=null;
            this.currentShape=null;
        }
        if (this.mode===`imageResize`) {
            this.corner=null;
            this.mode='none'
        }
        if (this.startDrawing && this.currentShape) {
            if (this.currentShape.type === 'rectangle2' || this.currentShape.type === 'line') {
                const {startPoint,endPoint}=this.currentShape;
                const {minPoint,maxPoint}=this.ShapeManger!.findMaxMinPoints(startPoint,endPoint);
                this.currentShape.startPoint=minPoint;
                this.currentShape.endPoint=maxPoint;
            }
            this.ShapeManger?.shapesArray.push(this.currentShape);
            this.startPoint={x:null,y:null};
            this.currentShape=null;
        }
        if (this.mode==='rotate' && this.selectedShape) {
            const {index,shape}=this.selectedShape;
            if (this.currentShape?.type==='rectangle2' && shape.type==='rectangle2') {
                this.ShapeManger!.shapesArray[index]={...shape,angle:this.currentShape.angle}
            }
            this.mode='none';
        }
        if (this.drawMode==='pen' && this.customeShape) {
            this.ShapeManger?.penShapes.push(this.customeShape);
            this.customeShape=null;
        }
        this.startDrawing = false;
    }
    onWheel(e: WheelEvent) {
        if (e.ctrlKey) {
            e.preventDefault();
            const mousePos = this.getMousePostion(e);
            const zoom = e.deltaY < 0 ? 1.1 : 0.9;
            // this.zoom(mousePos.x,mousePos.y,zoom);
            this.zoom2(mousePos.x, mousePos.y, zoom);
        }
    }
    // zoom(mouseX: number, mouseY: number, zoom: number) {
    //     if (this.scale > 20000 && zoom === 1.1) {
    //         return;
    //     }
    //     else if (this.scale < 0.04 && zoom === 0.9) {
    //         return;
    //     }
    //     const previousScale = this.scale;
    //     this.scale *= zoom;
    //     this.imageData.dx = mouseX - ((mouseX - this.imageData.dx) * this.scale / previousScale);
    //     this.imageData.dy = mouseY - ((mouseY - this.imageData.dy) * this.scale / previousScale);
    //     // this.drawImage();
    // }
    zoom2(mouseX: number, mouseY: number, zoom: number) {
        const previousScale = this.scale;
        this.scale *= zoom;

        const scaledWidth = this.StaticCanvas.width * this.scale;
        const scaledHeight = this.StaticCanvas.height * this.scale;

        if (scaledWidth < this.StaticCanvas.width || scaledHeight < this.StaticCanvas.height) {
            this.scale = previousScale;
            return;
        }
        const dx = (mouseX - this.Origin.x) * (this.scale - previousScale) / this.scale;
        const dy = (mouseY - this.Origin.y) * (this.scale - previousScale) / this.scale;
        this.Origin.x -= dx;
        this.Origin.y -= dy;
        this.clear();
        this.ctx?.setTransform(1, 0, 0, 1, 0, 0);
        this.drawCanvas();
    }
    resizeImage(e: MouseEvent, corner: number, maintainAspectRatio: boolean) {
        if (this.SelectedImage.index === null) {
            return;
        }
    
        const ImageCorner = [
            { x: this.SelectedImage.px!, y: this.SelectedImage.py! }, // top-left
            { x: this.SelectedImage.px! + this.SelectedImage.w!, y: this.SelectedImage.py! }, // top-right
            { x: this.SelectedImage.px! + this.SelectedImage.w!, y: this.SelectedImage.py! + this.SelectedImage.h! }, // bottom-right
            { x: this.SelectedImage.px!, y: this.SelectedImage.py! + this.SelectedImage.h! } // bottom-left
        ];
    
        let newWidth = this.SelectedImage.w!;
        let newHeight = this.SelectedImage.h!;
    
        switch (corner) {
            case 0: // top-left
                newWidth = ImageCorner[2].x - e.clientX;
                newHeight = ImageCorner[2].y - e.clientY;
                this.SelectedImage.px = e.clientX;
                this.SelectedImage.py = e.clientY;
                break;
            case 1: // top-right
                newWidth = e.clientX - ImageCorner[3].x;
                newHeight = ImageCorner[3].y - e.clientY;
                this.SelectedImage.px = ImageCorner[3].x;
                this.SelectedImage.py = e.clientY;
                break;
            case 2: // bottom-right
                newWidth = e.clientX - this.SelectedImage.px!;
                newHeight = e.clientY - this.SelectedImage.py!;
                break;
            case 3: // bottom-left
                newWidth = ImageCorner[1].x - e.clientX;
                newHeight = e.clientY - this.SelectedImage.py!;
                this.SelectedImage.px = e.clientX;
                break;
            default:
                break;
        }
    
        // Maintain aspect ratio if required
        if (maintainAspectRatio) {
            const aspectRatio = this.SelectedImage.w! / this.SelectedImage.h!;
            if (newWidth / newHeight > aspectRatio) {
                newHeight = newWidth / aspectRatio;
            } else {
                newWidth = newHeight * aspectRatio;
            }
        }

        this.SelectedImage.w = newWidth;
        this.SelectedImage.h = newHeight;
    
        // Update the position of the image after aspect ratio adjustment
        switch (corner) {
            case 0:
                this.SelectedImage.px = e.clientX;
                this.SelectedImage.py = e.clientY;
                break;
            case 1:
                this.SelectedImage.px = ImageCorner[3].x;
                this.SelectedImage.py = e.clientY;
                break;
            case 2:
                // No need to update px and py here as they are already set
                break;
            case 3:
                this.SelectedImage.px = e.clientX;
                this.SelectedImage.py = this.SelectedImage.py! + (this.SelectedImage.h! - newHeight);
                break;
            default:
                break;
        }
    
        // Update the effect object
        this.imageEffectObj[this.SelectedImage.index].px = this.SelectedImage.px!;
        this.imageEffectObj[this.SelectedImage.index].py = this.SelectedImage.py!;
        this.imageEffectObj[this.SelectedImage.index].width = this.SelectedImage.w!;
        this.imageEffectObj[this.SelectedImage.index].height = this.SelectedImage.h!;
    }
    
    dragMoveImage2(e: MouseEvent) {
        if (this.SelectedImage.px === null || this.SelectedImage.py === null || this.SelectedImage.index === null) {
            return;
        }
        const mousePos = this.getMousePostion(e);
        this.imageEffectObj[this.SelectedImage.index].px=(mousePos.x-this.Origin.x)/this.scale-this.dragStartX;
        this.imageEffectObj[this.SelectedImage.index].py=(mousePos.y-this.Origin.y)/this.scale-this.dragStartY;
        const image = this.imageEffectObj[this.SelectedImage.index];
        this.SelectedImage.px=image.px;
        this.SelectedImage.py=image.py;
        const {AdjustedImageCordinate}=this.getAllCordinate(this.SelectedImage.index);
        // this.clear();
        // this.setBackgroundColorHex(this.StaticCanvasColor);
        this.clearInteractive();
        this.drawCanvas();
        this.drawFrame(AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.topLeft.y,AdjustedImageCordinate.bottomRight.x-AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.bottomRight.y-AdjustedImageCordinate.topLeft.y);
    }
    dragMoveShape(e:MouseEvent){
        if (!this.MoveShape) {
            return;   
        }
        const {index,dx,dy}=this.MoveShape;
        const shape = this.ShapeManger?.shapesArray[index];
        let newX:number;
        let newY:number;
        if (shape?.type==='arc') {
            newX = e.clientX-dx;
            newY = e.clientY-dy;
            this.ShapeManger?.setStartPosition(index,newX,newY);
        }
        else if (shape?.type==='rectangle2') {
            newX = e.clientX-dx;
            newY = e.clientY-dy;
            const {endPoint,startPoint}=shape;
            const w = endPoint.x-startPoint.x;
            const h = endPoint.y-startPoint.y;
            const newEndPoint={x:newX+w,y:newY+h};
            this.ShapeManger!.shapesArray[index]={...shape,startPoint:{x:newX,y:newY},endPoint:newEndPoint}
        }
        else if (shape?.type==='line') {
            newX = e.clientX-dx;
            newY = e.clientY-dy;
            const {endPoint,startPoint}=shape;
            const deltaX = newX-startPoint.x;
            const deltaY = newY-startPoint.y;
            endPoint.x+=deltaX;
            endPoint.y+=deltaY;
            this.ShapeManger!.shapesArray[index]={...shape,startPoint:{x:newX,y:newY},endPoint};
        }
    }
    drawCircle(x:number,y:number,radius:number){
        if (!this.InteractiveCtx) {
            return;
        }
        this.InteractiveCtx.save();
        this.InteractiveCtx.beginPath();
        this.InteractiveCtx.arc(x,y,radius,0,2*Math.PI);
        this.InteractiveCtx.stroke();
        this.InteractiveCtx.restore();
    }
    drawRectangle(x: number, y: number, w: number, h: number, color:{fillStyle:string,strokeStyle:string}={fillStyle:"rgba(255, 147, 203, 0.04)",strokeStyle:'rgba(248, 110, 181, 1)'}) {
        const ctx = this.InteractiveCanvas.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.fillStyle = color.fillStyle; // Set fill style before drawing
        ctx.strokeStyle = color.strokeStyle; // Set stroke style before drawing
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill(); // Fill the rectangle
        ctx.stroke(); // Stroke the rectangle
        ctx.closePath();
    }
    drawRectangleWithArc(
        x: number,
        y: number,
        w: number,
        h: number,
        obj: {
            fillStyle?: string;
            strokeStyle?: string;
            radii?: number;
        } = {}
    ) {
        const fillStyle = obj.fillStyle || "rgba(255, 147, 203, 0.04)";
        const strokeStyle = obj.strokeStyle || 'rgba(248, 110, 181, 1)';
        const radii = obj.radii || 0;
    
        const validatedRadii = Math.max(radii, 0);
    
        if (!this.InteractiveCtx) {
            return;
        }
    
        this.InteractiveCtx.save();
        this.InteractiveCtx.fillStyle = fillStyle;
        this.InteractiveCtx.strokeStyle = strokeStyle;
        this.InteractiveCtx.beginPath();
        this.InteractiveCtx.roundRect(x, y, w, h, validatedRadii);
        this.InteractiveCtx.fill();
        this.InteractiveCtx.stroke();
        this.InteractiveCtx.restore();
    }
    drawReactWithArc2(
        ctx:CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        obj: {
            fillStyle?: string;
            strokeStyle?: string;
            radii?: number;
        } = {}
    ){
        const fillStyle = obj.fillStyle || "rgba(255, 147, 203, 0.04)";
        const strokeStyle = obj.strokeStyle || 'rgba(248, 110, 181, 1)';
        const radii = obj.radii || 0;
    
        const validatedRadii = Math.max(radii, 0);

        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, validatedRadii);
        ctx.fill();
        ctx.stroke();

    }
    drawLine(pointA:point,pointB:point){
        if (pointA.x===null||pointB.x===null||pointA.y===null||pointB.y===null) {
            return;
        }
        const ctx = this.InteractiveCanvas.getContext(`2d`);
        ctx?.beginPath();
        ctx?.moveTo(pointA.x,pointA.y);
        ctx?.lineTo(pointB.x,pointB.y);
        ctx?.stroke();
        ctx?.closePath();
    }
    getAllCordinate(index: number) {
        const image = this.imageEffectObj[index];
        const imageCordinate = {
            topLeft: { x: image.px, y: image.py },
            topRight: { x: image.px + image.width, y: image.py },
            bottomLeft: { x: image.px + image.width, y: image.py + image.height },
            bottomRight: { x: image.px, y: image.py + image.height }
        };

        const PointArr = [{ x: image.px, y: image.py },{ x: image.px + image.width, y: image.py },{ x: image.px + image.width, y: image.py + image.height },{ x: image.px, y: image.py + image.height }]
        const {minPoints,maxPoints}=this.getMaxMin_points(PointArr);
    
        const AdjustedImageCordinate = {
            topLeft: minPoints,
            topRight: { x: maxPoints.x, y: minPoints.y },
            bottomLeft: { x: minPoints.x, y: maxPoints.y },
            bottomRight: maxPoints
        };
    
        return { imageCordinate, AdjustedImageCordinate };
    };
    getMaxMin_points(pointsArr:point2[]){
        const all_X=pointsArr.map(v=>v.x);
        const all_Y=pointsArr.map(v=>v.y);
        const maxX=Math.max(...all_X);
        const maxY=Math.max(...all_Y);
        const minX=Math.min(...all_X);
        const minY=Math.min(...all_Y);
        return {minPoints:{x:minX,y:minY},maxPoints:{x:maxX,y:maxY}}; 
    }
    FrameAround_Shape(shape:shape){
        if (shape.type==='arc') {
            const {startPoint,radius}=shape;
            const x1 = startPoint.x!-radius!;
            const y1 = startPoint.y!-radius!;
            const w=2*radius!;
            const h=2*radius!;
            this.drawFrame(x1,y1,w,h,{space:5,squareSize:10});
        }
        else if (shape.type === 'rectangle2') {
            const {startPoint,endPoint}=shape
            this.drawFrame(startPoint.x,startPoint.y,endPoint.x-startPoint.x,endPoint.y-startPoint.y);
        }
    }    
    drawFrame(x: number, y: number, w: number, h: number, obj: { squareSize: number, space: number } = { squareSize: 10, space: 10 }) {
        // Calculate the new frame position with the given space
        const newX = x - obj.space;
        const newY = y - obj.space;
        const lastX = x + w + obj.space;
        const lastY = y + h + obj.space;
    
        // Draw the four small rectangles (corners)
        const corners = [
            { x: newX, y: newY }, // top-left
            { x: lastX - obj.squareSize, y: newY }, // top-right
            { x: lastX - obj.squareSize, y: lastY - obj.squareSize }, // bottom-right
            { x: newX, y: lastY - obj.squareSize }, // bottom-left
        ];
        corners.forEach(corner => {
            this.drawRectangle(corner.x, corner.y, obj.squareSize, obj.squareSize);
        });
        // draw a circle on the top
        const mx = newX+(lastX-newX)/2;
        const my = newY-20;
        this.drawCircle(mx,my,5);
        // Draw the outer rectangle
        this.drawRectangle(newX, newY, lastX - newX, lastY - newY, { fillStyle: 'rgba(0, 0, 0, 0)', strokeStyle: 'rgba(248, 110, 181, 1)' });
        this.FrameCodinate.cornerRact = corners,
        this.FrameCodinate.size=obj.squareSize;
        this.FrameCodinate.circlePoint={x:mx,y:my,radius:5};
    }
    showSelection(e: MouseEvent) {// basically this function show all the element which can be selected via mouse if mouse is above an element the mouse style is going to get change
        const mousePos = this.getMousePostion(e);
        const adjustedMouseX = (mousePos.x - this.Origin.x) / this.scale;
        const adjustedMouseY = (mousePos.y - this.Origin.y) / this.scale;

        const imagePos = this.IsMouseOverImage(adjustedMouseX, adjustedMouseY);
        // const imagePos = this.IsMouseOverImage(mousePos.x, mousePos.y);// this is not working but above one is working a little bit
        if (imagePos.px !== null && imagePos.py !== null && imagePos.index !== null) {
            const target = e.target as HTMLElement;
            target.style.cursor = `move`
        }
        else {
            const target = e.target as HTMLElement;
            target.style.cursor = `default`
        }
    }
    IsMouseOverImage(x: number, y: number) {
        let ImagePosition: ImagePosition = { px: null, py: null, index: null,w:null,h:null }
        for (let i = 0; i < this.imageEffectObj.length; i++) {
            const maxX = Math.max(this.imageEffectObj[i].px + this.imageEffectObj[i].width * this.scale,this.imageEffectObj[i].px);
            const minX = Math.min(this.imageEffectObj[i].px + this.imageEffectObj[i].width * this.scale,this.imageEffectObj[i].px);
            const maxY =Math.max(this.imageEffectObj[i].py + this.imageEffectObj[i].height * this.scale,this.imageEffectObj[i].py);
            const minY=Math.min(this.imageEffectObj[i].py + this.imageEffectObj[i].height * this.scale,this.imageEffectObj[i].py);
            if (x<=maxX && x>=minX && y<=maxY && y>=minY) {
                ImagePosition = { px: this.imageEffectObj[i].px, py: this.imageEffectObj[i].py, index: i,w:this.imageEffectObj[i].width,h:this.imageEffectObj[i].height }
                break;
            }
        }
        return ImagePosition;
    }
    IsMouseInsideReact(mousePos:{x:number,y:number},React:{x:number,y:number,w:number,h:number}){
        if (
            mousePos.x>=React.x &&
            mousePos.y>=React.y &&
            mousePos.x<=React.x+React.w &&
            mousePos.y<=React.y+React.h
        ) {
            return true;
        }
        return false;
    }
    checkForFrameCorner(e:MouseEvent){
        let chack:null|number=null;
        const target = e.target as HTMLElement;
        if (this.FrameCodinate.size>0) {
            for (let i = 0; i < this.FrameCodinate.cornerRact.length; i++) {
                if (this.IsMouseInsideReact({x:e.clientX,y:e.clientY},{x:this.FrameCodinate.cornerRact[i].x!,y:this.FrameCodinate.cornerRact[i].y!,w:this.FrameCodinate.size,h:this.FrameCodinate.size})) {
                    chack=i;
                    break;
                }
            }
        }
        const {x,y,radius}=this.FrameCodinate.circlePoint;// circle
        const dist = Math.hypot(e.clientX-x,e.clientY-y);
        if (dist<=radius) {
            chack=4;
            return chack;
        }
        //[0:top-left,1:top-right,2:bottom-right,3:bottom-left]
        if (chack===1 || chack===3) {
            target.style.cursor = `nesw-resize`
        }
        else if (chack===0 || chack===2){
            target.style.cursor = `nwse-resize`
        }
        else{
            target.style.cursor = `default`
        }
        return chack;
    }

    checkImageCorner(x:number,y:number,obj:{cornerRadius:number}={cornerRadius:20}){
        if (this.SelectedImage.index===null) {
            return -1;
        }
        const ImageCorner = [
            {x:this.SelectedImage.px!,y:this.SelectedImage.py!},//top-left
            {x:this.SelectedImage.px!+this.SelectedImage.w!,y:this.SelectedImage.h!},//top-right
            {x:this.SelectedImage.px!+this.SelectedImage.w!,y:this.SelectedImage.py!+this.SelectedImage.h!},//bottom-right
            {x:this.SelectedImage.px!,y:this.SelectedImage.py!+this.SelectedImage.h!}//bottom-left
        ];
        for (let i = 0; i < ImageCorner.length; i++) {
            const corner = ImageCorner[i];
            const dx=x-corner.x;
            const dy=y-corner.y;
            if (dx*dx+dy*dy<=obj.cornerRadius*obj.cornerRadius) {
                return i;
            }
        }
        return -1;
    }
    // setBorder() {
    //     if (!this.ctx || !this.imageData.image) {
    //         return;
    //     }
    //     this.ctx.save();
    //     this.ctx.translate(this.imageData.dx, this.imageData.dy);
    //     this.ctx.scale(this.scale, this.scale);
    //     if (this.ctx.strokeStyle !== 'transparent') {
    //         this.ctx.lineWidth = 2 / this.ctx.getTransform().a;
    //         this.ctx.strokeStyle = '#976cf5';
    //         this.ctx.strokeRect(0, 0, this.imageData.image.width, this.imageData.image.height);
    //         // this.ctx.strokeRect(this.imageData.dx, this.imageData.dy, this.imageData.dWidth, this.imageData.dHeight);
    //     }
    //     this.ctx.restore();
    // }
    getMousePostion(e: MouseEvent | WheelEvent) {
        const rect = this.StaticCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    getMousePostion2(e: MouseEvent | WheelEvent){
        const InteractiveCanvas=this.InteractiveCanvas.getBoundingClientRect();
        const DrawingCanvas=this.StaticCanvas.getBoundingClientRect();
        return {
            InteractiveCanvas:{
                x:e.clientX-InteractiveCanvas.left,
                y:e.clientY-InteractiveCanvas.top
            },
            Canvas:{
                x:e.clientX-DrawingCanvas.left,
                y:e.clientY-DrawingCanvas.top
            }
        }
    }
    //new applyFilter
    applyFilter(colorFilter: FineTuneTypes){
        if (this.SelectedImage.px === null || this.SelectedImage.py === null || this.SelectedImage.index === null) {
            return;
        }
        this.imageEffectObj[this.SelectedImage.index].imageEffectObj.applyFilter(colorFilter);
        this.clear();
        this.drawCanvas();
    }
    // getdataUrl() {
    //     if (!this.imageData.image) {
    //         return;
    //     }
    //     const DataUrl = this.getSectionDataURL(this.imageData.dx, this.imageData.dy, this.imageData.dWidth * this.scale, this.imageData.dHeight * this.scale);
    //     return DataUrl;
    // }
    // getDataUrl2(type: string) {
    //     let tempCanvas = document.createElement(`canvas`);
    //     if (!this.imageData.image) {
    //         return;
    //     }
    //     tempCanvas.width = this.imageData.image.width;
    //     tempCanvas.height = this.imageData.image.height;
    //     const tempCtx = tempCanvas.getContext(`2d`);
    //     if (!tempCtx || !this.ctx) {
    //         return;
    //     }
    //     tempCtx.filter = this.ctx.filter;
    //     tempCtx.drawImage(this.imageData.image, 0, 0);
    //     if (this.filter) {
    //         this.applyTintColorOnCanvas(tempCanvas, this.filter);
    //     }
    //     return tempCanvas.toDataURL(`image/${type}`);
    // };
    getDataUrl(){
        return this.StaticCanvas.toDataURL();
    }
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
        const tempCanvas = document.createElement(`canvas`);
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        const tempCtx = tempCanvas.getContext(`2d`);
        if (!tempCtx) {
            return
        }
        tempCtx.drawImage(this.StaticCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
        return tempCanvas.toDataURL();
    }
    getStaticCanvasImageData(x:number,y:number,w:number,h:number){
        if (!this.isPointsWithinCanvas(x,y)) {
            return;
        }
        if (!this.ctx) {
            return;
        }
        const value = this.ctx.getImageData(x,y,w,h);
        return value;
    }
    isPointsWithinCanvas(x:number,y:number){
        if (
            x<=this.StaticCanvas.width && x>=0
            && y<=this.StaticCanvas.height && y>=0
        ) {
            return true;
        }
        return false
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
    applyTintColor(colorFilter: FineTuneTypes){
        if (colorFilter.color === "" || this.SelectedImage.index === null) {
            return;
        }
        this.imageEffectObj[this.SelectedImage.index].imageEffectObj.applyTint(colorFilter.color);
        this.drawCanvas();
    }
    addImage(image: HTMLImageElement) {
        const px = 100;
        const py = 100;
        const ImageObj = new ImageEffect(image);
        const width = ImageObj.canvas.width;
        const height = ImageObj.canvas.height;
        this.imageEffectObj.push({
            px, py, width, height, imageEffectObj: ImageObj
        });
    }
    drawCanvas() {
        if (!this.ctx || !this.imageEffectObj) {
            return;
        }
        this.ctx.save();
        this.ctx.translate(this.Origin.x, this.Origin.y);
        this.ctx.scale(this.scale, this.scale);
        // this.clear();
        this.setBackgroundColorHex(this.StaticCanvasColor);
        this.drawImage2();
        this.ctx.restore();
    }
    drawImage2() {
        if (!this.ctx || this.imageEffectObj.length===0) {
            return;
        }
        for (let i = 0; i < this.imageEffectObj.length; i++) {
            const canvas = this.imageEffectObj[i].imageEffectObj.canvas;
            this.ctx.drawImage(canvas, this.imageEffectObj[i].px, this.imageEffectObj[i].py,this.imageEffectObj[i].width,this.imageEffectObj[i].height);
        }
    }
    adjustCanvas() {
        this.StaticCanvas.width = window.innerWidth;
        this.StaticCanvas.height = window.innerHeight;
        this.InteractiveCanvas.width=window.innerWidth;
        this.InteractiveCanvas.height=window.innerHeight;
    };
    setBackgroundColorRGB(rgba: RGBA = { r: 0, g: 0, b: 0, a: 1 }) {
        if (!this.ctx) {
          return;
        }
        const { r, g, b, a = 1 } = rgba;
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
          throw new Error('Invalid RGBA values');
        }
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        this.ctx.fillRect(0, 0, this.StaticCanvas.width, this.StaticCanvas.height);
    }
    setBackgroundColorHex(hex:string){
        if (!this.ctx) {
            return;
        }
        this.ctx.fillStyle = hex;
        this.ctx.fillRect(0, 0, this.StaticCanvas.width,this.StaticCanvas.height);
    }
    deleteImage(){
        if (this.SelectedImage.index===null) {
            return;
        }
        this.imageEffectObj.splice(this.SelectedImage.index,1);
        this.SelectedImage={index:null,px:null,py:null,w:null,h:null}
        this.clear();
        this.drawCanvas();
    }
    clearInteractive(){
        if(this.InteractiveCtx){
            this.InteractiveCtx.clearRect(0,0,this.InteractiveCanvas.width,this.InteractiveCanvas.height);
        }
    }
    clear(): void {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.StaticCanvas.width, this.StaticCanvas.height);
        }
    }
}
