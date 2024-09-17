import { hexToRgb, RandomInt } from "@/lib/utils";
import { FineTuneTypes } from "@/packages/store/atoms/FinetuneAtom";
import { ImageEffect } from "./ImageEffect";
import { arc, arc2, pointsArray, point, point2, RGBA, shape, text, ellipse } from "./Interface";
import { ShapeManager } from "./ShapeManger";


interface ImagePosition {
    px: null | number,
    py: null | number,
    index: null | number,
    w:null|number,
    h:null|number
}
interface Frame {
    x:number,
    y:number,
    w:number,
    h:number,
    angle:number
}
type Mode = 'none'|'drag'|'dragPolygon'|'dragCustomShape'|'drawTriangle'|'InteractiveRactangle'|'imageResize'|'rotate'|'resize';
export type drawingMode = `none`|`ractangle`|`arc`|'line'|'pen'|'text'|'eraser'|'pan'|'ellipse';
type shapeType = 'text'|'shape'|'customeShape'|'image'|'polygon';
interface imageEffectObject {
    px: number
    py: number
    width: number,
    height: number,
    angle:number,
    imageEffectObj: ImageEffect
}
export const curserStyle = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAOBJREFUOE9jZKAyYKSyeQzDwMD////7MDAw6EGD5hIjI+MWfMGE08sggz59+jTr5s2bnPv27eMFGeLk5PRZXV39Ox8fXxoug7EaCDLs58+fa0NDQ9k2b96M4iBfX1+G1atX/2JnZw/GZihWAz9+/PgsJiZGEt0wmMkgQ5csWfKcn59fCt37GAaCXHf69OnFZmZmAvjC6tSpUx9MTU1j0V2JzcCqzs7OpoqKCmZ8BnZ0dPwtLy+vY2RkbENWRxcDqetlkPOpGikgA6mebGCGUi1hI8ca1bIeucXaMCi+SPU6AHSTjhWHMn6TAAAAAElFTkSuQmCC") 10 10, auto';
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
    // for roating the shape
    public startAngle:{angle:number,center:point2}|null=null;
    public selectedShape:{shape:shape,index:number}|null=null;
    public selectedShape2:{element:shapeType,index:number}|null=null;
    public selectedPolygon:{polygon:pointsArray,index:number}|null=null;
    //show frame
    public showFrame:boolean=true;
    // handdrawn shape
    public customeShape:pointsArray|null=null;
    // text typeing
    // public isTypeing:boolean=false;
    public text:string='';
    public textPoint:point2|null=null;
    public startText:boolean=false;
    public dragText:{index:number,dx:number,dy:number}|null=null;
    //eraser
    public eraser:boolean=false;
    // current curserStyle
    public curseStyle:string='default';
    // panning
    public panning:boolean=false;
    // image_frameARR --> first start with the image frame then outhers
    // image_FrameArr:Frame[]=[];
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
        this.ShapeManger = new ShapeManager(this.ctx,this)
        this.StaticCanvasColor = '#020617'
        this.adjustCanvas();
        if (image) {
            this.addImage(image)
            this.drawCanvas();
        }
        this.animate = this.animate.bind(this);
        // this.animate();
    };
    animate(){
        this.drawCanvas();
        this.ShapeManger?.drawCustomShape();
        this.ShapeManger?.drawPolygonShapes();
        this.ShapeManger?.drawShapes();
        this.ShapeManger?.drawAlltextContent();
        requestAnimationFrame(this.animate);
    }
    addEventListinerInterative(){
        this.InteractiveCanvas.addEventListener(`mousedown`,this.mouseDownInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`mousemove`,this.mouseMoveInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`mouseup`,this.mouseUpInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`click`,this.mouseClickInteractive.bind(this));
        this.InteractiveCanvas.addEventListener(`wheel`,this.onWheel.bind(this));
        document.addEventListener(`keydown`,this.keyDown.bind(this));
    }
    removeEventListinerInterative(){
        this.InteractiveCanvas.removeEventListener(`mousedown`,this.mouseDownInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`mousemove`,this.mouseMoveInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`mouseup`,this.mouseUpInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`click`,this.mouseClickInteractive.bind(this));
        this.InteractiveCanvas.removeEventListener(`wheel`,this.onWheel.bind(this));
        document.removeEventListener(`keydown`,this.keyDown.bind(this));
    }
    addEventListeners_Static() {
        window.addEventListener(`resize`, (e) => { });
    }
    removeEventListiner_Static() {
        window.removeEventListener(`resize`, (e) => { });
    }
    mouseClickInteractive(e:MouseEvent){
        const mousePos = this.getMousePostion2(e).InteractiveCanvas;
        const imagePos = this.IsMouseOverImage(e.clientX,mousePos.y);
        const shapeIndex = this.ShapeManger!.isMouseOverTheShape(e.clientX,e.clientY);
        const index = this.ShapeManger!.isPointOntheText({x:e.clientX,y:e.clientY});
        const customeShapeIndex = this.ShapeManger!.isMouseOverCustomShape(e.clientX,e.clientY);
        const polygonIndex = this.ShapeManger!.isMouseOnPolygon({x:e.clientX,y:e.clientY});
        if (shapeIndex!==null && shapeIndex!==undefined) {
            const shape = this.ShapeManger!.shapesArray[shapeIndex];
            this.selectedShape={shape:shape,index:shapeIndex};
            this.clearInteractive();
            if (this.showFrame) {
                this.FrameAround_Shape(shape);
            }
            this.selectedShape2={element:'shape',index:shapeIndex};
        }
        if (index!==null && this.showFrame) {
            const {startPoint,height,width}=this.ShapeManger!.textContent[index];
            this.clearInteractive();
            this.drawFrame(startPoint.x,startPoint.y,width,height,{space:9,squareSize:10});
            this.selectedShape2={element:'text',index:index};
        }
        if (imagePos.index!==null && imagePos.px!==null && imagePos.py!==null) {
            const {AdjustedImageCordinate}=this.getAllCordinate(imagePos.index);
            this.clearInteractive();
            if (this.showFrame) {
                // const frame = this.image_FrameArr[imagePos.index];
                // this.drawFrame(frame.x,frame.y,frame.w,frame.h,{angle:frame.angle});
                this.drawFrame(AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.topLeft.y,AdjustedImageCordinate.bottomRight.x-AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.bottomRight.y-AdjustedImageCordinate.topLeft.y);
            }
            this.selectedShape2={element:'image',index:imagePos.index};
        }
        if (customeShapeIndex>-1) {
            const customeShape=this.ShapeManger!.penShapes[customeShapeIndex];
            const {maxPoints,minPoints} = this.getMaxMin_points(customeShape);
            this.clearInteractive();
            this.drawFrame(minPoints.x,minPoints.y,maxPoints.x-minPoints.x,maxPoints.y-minPoints.y);
            this.selectedShape2={element:'customeShape',index:customeShapeIndex};
        }
        if (polygonIndex!==null) {
            const polygonShape = this.ShapeManger!.polygonShapes[polygonIndex];
            const {maxPoints,minPoints} = this.getMaxMin_points(polygonShape);
            this.clearInteractive();
            this.drawFrame(minPoints.x,minPoints.y,maxPoints.x-minPoints.x,maxPoints.y-minPoints.y);
            // this.selectedPolygon={polygon:polygonShape,index:polygonIndex};
            this.selectedShape2={element:'polygon',index:polygonIndex};
        }
        else if (this.drawMode==='text') {
            if (!this.startText) {
                this.startText=true;
            }
        }
    }
    mouseDownInteractive(e:MouseEvent){
        // const mousePos = this.getMousePostion2(e).InteractiveCanvas;
        //mouse position of the drawing canvas and the intercative canvas is going to be same
        const imagePos = this.IsMouseOverImage(e.clientX,e.clientY);
        const check = this.checkForFrameCorner(e);
        const index = this.ShapeManger!.isMouseOverTheShape(e.clientX,e.clientY);
        const customeShapeIndex = this.ShapeManger!.isMouseOverCustomShape(e.clientX,e.clientY);
        const textIndex = this.ShapeManger!.isPointOntheText({x:e.clientX,y:e.clientY});
        const polygonIndex =  this.ShapeManger!.isMouseOnPolygon({x:e.clientX,y:e.clientY});
        
        if (customeShapeIndex>-1) {
            const shape=this.ShapeManger!.penShapes[customeShapeIndex];
            this.MoveShape={index:customeShapeIndex,dx:e.clientX-shape[0].x,dy:e.clientY-shape[0].y};
            this.mode='dragCustomShape';
        }
        else if (polygonIndex!==null) {
            const polygonShape = this.ShapeManger!.polygonShapes[polygonIndex];
            this.MoveShape={index:polygonIndex,dx:e.clientX-polygonShape[0].x,dy:e.clientY-polygonShape[0].y};
            this.mode='dragPolygon';
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
        else if (textIndex!==null) {
            this.mode='drag';
            const {startPoint}=this.ShapeManger!.textContent[textIndex];
            this.dragText = {index:textIndex,dx:e.clientX-startPoint.x,dy:e.clientY-startPoint.y};
        }
        else if (check!==null && check<4 && this.SelectedImage.index!==null) {
            this.mode='imageResize';
            this.corner=check
        }
        else if (check===4 && this.selectedShape2) {
            this.mode='rotate';
            const { element,index } = this.selectedShape2;
            if (element==='customeShape') {                
                const customeShape = this.ShapeManger!.penShapes[index];
                const {maxPoints,minPoints}=this.getMaxMin_points(customeShape);
                const centerPoint = {x:minPoints.x+(maxPoints.x-minPoints.x)/2,y:minPoints.y+(maxPoints.y-minPoints.y)/2};
                const angle = Math.atan2(e.clientY-centerPoint.y,e.clientX-centerPoint.x);
                this.startAngle={angle:angle,center:centerPoint};
            }
            else if (element==='polygon') {
                const polygon = this.ShapeManger!.polygonShapes[index]
                const {maxPoints,minPoints}=this.getMaxMin_points(polygon);
                const centerPoint = {x:minPoints.x+(maxPoints.x-minPoints.x)/2,y:minPoints.y+(maxPoints.y-minPoints.y)/2};
                const angle = Math.atan2(e.clientY-centerPoint.y,e.clientX-centerPoint.x);
                this.startAngle={angle:angle,center:centerPoint}
            }
            else if (element==='image') {
                const image = this.imageEffectObj[index];
                const centerPoint={x:image.px+image.width/2,y:image.py+image.height/2}
                const angle = Math.atan2(e.clientY-centerPoint.y,e.clientX-centerPoint.x);
                this.startAngle={angle:angle,center:centerPoint}
            }
        }
        else if (imagePos.index!==null && imagePos.px!==null && imagePos.py!==null) {
            this.mode='drag';
            this.dragStartX = e.clientX-imagePos.px
            this.dragStartY = e.clientY-imagePos.py
            this.SelectedImage = imagePos;
        }
        else if (this.drawMode==='pan') {
            this.panning=true;
            this.dragStartX=e.clientX;
            this.dragStartY=e.clientY;
        }
        else {
            this.mode = `InteractiveRactangle`;
            this.InterativeRectangle={x:e.clientX,y:e.clientY}
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
        if (this.drawMode==='ellipse') {
            this.startDrawing=true;
            this.startPoint = {x:e.clientX,y:e.clientY};
        }
        if (this.drawMode==='eraser') {
            this.eraser=true;
        }
    }
    mouseMoveInteractive(e:MouseEvent){
        if (this.drawMode==='eraser' && this.eraser) {
            const {x,y}={x:e.clientX,y:e.clientY};
            const shapeManager = this.ShapeManger!;
            const actions=[
                { index: shapeManager.isPointOntheText({ x, y }), array: shapeManager.textContent },
                { index: shapeManager.isMouseOverCustomShape(x, y), array: shapeManager.penShapes },
                { index: shapeManager.isMouseOverTheShape(x, y), array: shapeManager.shapesArray },
                { index: this.IsMouseOverImage(x, y).index, array: this.imageEffectObj },
                { index: shapeManager.isMouseOnPolygon({x, y}), array: shapeManager.polygonShapes }
            ];
            actions.forEach(({ index, array }) => {
                if (index !== null && index >= 0) {
                    array.splice(index, 1);
                }
            });
            this.drawCanvas();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawAlltextContent();
        }
        if (this.mode==='InteractiveRactangle' && !this.startDrawing) {
            this.clearInteractive();
            this.drawRectangle(this.InterativeRectangle.x,this.InterativeRectangle.y,e.clientX-this.InterativeRectangle.x,e.clientY-this.InterativeRectangle.y);
        }
        if (this.mode==='rotate') {
            const {element,index}=this.selectedShape2!
            if (element==='polygon') {                
                const {center,angle}=this.startAngle!;
                const currentAngle = Math.atan2(e.clientY-center.y,e.clientX-center.x);
                const New_Angle = currentAngle-angle;
                const polygon = this.ShapeManger!.polygonShapes[index];
                this.ShapeManger!.rotateIrregularPolygons(polygon,New_Angle,{centerPoint:center});
                this.startAngle!.angle=currentAngle;
            }
            else if (element==='customeShape') {
                const {center,angle}=this.startAngle!;
                const currentAngle = Math.atan2(e.clientY-center.y,e.clientX-center.x);
                const New_Angle = currentAngle-angle;
                const customeShape = this.ShapeManger!.penShapes[index]
                this.ShapeManger!.rotateIrregularPolygons(customeShape,New_Angle,{centerPoint:center});
                this.startAngle!.angle=currentAngle;
            }
            else if (element==='image') {
                const {center,angle}=this.startAngle!;
                const currentAngle = Math.atan2(e.clientY-center.y,e.clientX-center.x);
                const New_Angle = currentAngle-angle;
                this.imageEffectObj[0].angle=New_Angle;
                // const frame = this.image_FrameArr[index];
                // frame.angle=New_Angle;
                // this.clearInteractive();
                // this.drawFrame(frame.x,frame.y,frame.w,frame.h,{angle:New_Angle});
            }
            this.drawCanvas();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawAlltextContent();
        }
        if (this.mode === `drag`|| this.mode==='dragCustomShape' || this.mode==='dragPolygon') {
            
            if (this.mode==='drag' && this.MoveShape) {
                this.dragMoveShape(e);
            }
            else if (this.mode==='dragCustomShape' && this.MoveShape) {
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
            }
            else if (this.mode==='dragPolygon' && this.MoveShape) {
                const {index,dx,dy}=this.MoveShape;
                const polygonShape = this.ShapeManger!.polygonShapes[index];
                const newStartPoint = {x:e.clientX-dx,y:e.clientY-dy};
                const deltaX = newStartPoint.x-polygonShape[0].x;
                const deltaY = newStartPoint.y-polygonShape[0].y;
                for (let i = 1; i < polygonShape.length; i++) {
                    polygonShape[i].x+=deltaX;
                    polygonShape[i].y+=deltaY;
                }
                polygonShape[0]=newStartPoint;
                this.ShapeManger!.polygonShapes[index]=polygonShape;
            }
            else if (this.dragText) {
                const newX = e.clientX-this.dragText.dx;
                const newY = e.clientY-this.dragText.dy;
                this.ShapeManger!.textContent[this.dragText.index].startPoint={x:newX,y:newY};
            }
            else {
                this.dragMoveImage2(e);
            }
            this.drawCanvas();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawAlltextContent();
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
            this.drawCanvas();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawAlltextContent();
            
            const points = [
                {x:this.startPoint.x,y:this.startPoint.y},
                {x:e.clientX,y:this.startPoint.y},
                {x:e.clientX,y:e.clientY},
                {x:this.startPoint.x,y:e.clientY},
            ];
            this.ShapeManger?.drawIrregularPolygons(points);
            this.customeShape=points;
        }
        if (this.drawMode==='arc' && this.startDrawing) {
            if (!this.startPoint.x || !this.startPoint.y) {
                return;
            }
            const radius = this.ShapeManger!.calculateDistance({x:this.startPoint.x,y:this.startPoint.y},{x:e.clientX,y:e.clientY});
            this.currentShape = {type:'arc',startPoint:{x:this.startPoint.x,y:this.startPoint.y},radius:radius,startAngle:0,endAngle:2*Math.PI,counterClockWise:false};
            this.drawCanvas();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawAlltextContent();
            this.ShapeManger?.drawLine({x:this.startPoint.x,y:this.startPoint.y},{x:e.clientX,y:e.clientY},{setLineDesh:[5,3]});
            this.ShapeManger?.drawArc(this.currentShape);
        }
        if (this.drawMode==='ellipse' && this.startDrawing) {
            const {x,y}=this.startPoint!
            const ellipes = {
                type:'ellipse',
                startPoint:this.startPoint,
                startAngle:0,
                endAngle:2*Math.PI,
                anticlockwise:false,
                radiusX:e.clientX-x!<0?0:e.clientX-x!,
                radiusY:e.clientY-y!<0?0:e.clientY-y!,
                rotation:0
            } as ellipse
            this.currentShape=ellipes
            
            this.drawCanvas();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawAlltextContent();

            this.ShapeManger?.drawEllipse(ellipes);
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
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawAlltextContent();

            this.ShapeManger?.drawLine(startPoint,endpoint);
        }
        if (this.drawMode==='pen' && this.startDrawing && this.customeShape) {
            this.customeShape=[...this.customeShape,{x:e.clientX,y:e.clientY}];
            this.ShapeManger?.drawPenShape(this.customeShape);
        }
        if (this.drawMode==='pan' && this.panning) {
            const dx = e.clientX-this.dragStartX;
            const dy = e.clientY-this.dragStartY;
            this.panImages(dx,dy);
            this.ShapeManger?.panAllpolygon(dx,dy);
            this.ShapeManger?.panText(dx,dy);
            this.ShapeManger?.panPenShapes(dx,dy);
            this.ShapeManger?.panShapes(dx,dy);
            
            this.drawCanvas();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawAlltextContent();

            this.dragStartX=e.clientX;
            this.dragStartY=e.clientY;
            this.curseStyle='grabbing'
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
        if (this.mode===`drag` || this.mode ==='dragCustomShape' || this.mode==='dragPolygon') {
            this.mode='none'
            this.MoveShape=null
            this.dragText=null;
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
        if (this.drawMode==='ractangle' && this.customeShape!=null) {
            this.ShapeManger?.polygonShapes.push(this.customeShape);
            this.customeShape=null;
            this.startPoint={x:null,y:null};
        }
        if (this.startDrawing && this.currentShape) {
            this.ShapeManger?.shapesArray.push(this.currentShape);
            this.startPoint={x:null,y:null};
            this.currentShape=null;
        }
        if (this.mode==='rotate') {
            this.mode='none';
        }
        if (this.drawMode==='pen' && this.customeShape) {
            this.ShapeManger?.penShapes.push(this.customeShape);
            this.customeShape=null;
        }
        if (this.drawMode==='pan') {
            this.dragStartX=0;
            this.dragStartY=0;
            this.curseStyle='grab'
        }
        this.panning=false;
        this.startDrawing = false;
        this.eraser=false;
    }
    onWheel(e: WheelEvent) {
        if (e.ctrlKey) {
            e.preventDefault();
            this.zoom(e);
        }
    }
    keyDown(e:KeyboardEvent){
        if (e.key === "Delete" && this.selectedShape2) {
            const shapeManager = this.ShapeManger!;
            const actions=[
                { type: 'text', array: shapeManager.textContent },
                { type: 'customeShape', array: shapeManager.penShapes },
                { type: 'shape', array: shapeManager.shapesArray },
                { type: 'image', array: this.imageEffectObj },
                { type: 'polygon', array: shapeManager.polygonShapes }
            ];
            actions.forEach(({type,array})=>{
                if (this.selectedShape2!.element===type) {
                    array.splice(this.selectedShape2!.index,1);
                }
            });
            this.drawCanvas();
            this.ShapeManger?.drawPolygonShapes();
            this.ShapeManger?.drawCustomShape();
            this.ShapeManger?.drawShapes();
            this.ShapeManger?.drawAlltextContent();
            this.selectedShape2=null;
        }
    }
    zoom(e: WheelEvent) {
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const minScale = 0.5;
        const maxScale = 2.0;

        let newScale = this.scale*zoomFactor;
        newScale = Math.max(minScale, Math.min(maxScale, newScale));
        const effectiveZoom = newScale / this.scale;
        this.scale = newScale;
        const cPoint={ x: e.clientX, y: e.clientY }
        this.zoomInImages(cPoint, effectiveZoom);
        this.ShapeManger?.zoomAllPolygon(effectiveZoom,cPoint);
        this.ShapeManger?.zoomPenShapes(effectiveZoom,cPoint);
        this.ShapeManger?.zoomShapes(effectiveZoom,cPoint);
        this.ShapeManger?.zoomText(effectiveZoom,cPoint);
        // redraw everything
        this.drawCanvas();
        this.ShapeManger?.drawPolygonShapes();
        this.ShapeManger?.drawCustomShape();
        this.ShapeManger?.drawShapes();
        this.ShapeManger?.drawAlltextContent();
        
    }
    zoomInImages(centerPoint:point2,zoom:number){
        this.imageEffectObj.forEach(image=>{
            const {height,width,px,py}=image;
            const shape = [{x:px,y:py},{x:px+width,y:py+height}];
            this.scaledPolygon(shape,zoom,centerPoint);
            const [s,e]=shape;
            image.px=s.x;
            image.py=s.y;
            image.height=e.y-s.y;
            image.width=e.x-s.x
        });
    }
    panImages(dx:number,dy:number){
        this.imageEffectObj.forEach(image=>{
            image.px+=dx;
            image.py+=dy;
        });
    }
    panPolygon(shape:pointsArray,dx:number,dy:number){
        shape.forEach(point => {
            point.x+=dx;
            point.y+=dy;
        });
    }
    scaledPolygon(shape:pointsArray,zoom:number,centerPoint:point2={x:0,y:0}){
        shape.forEach(p=>{
            const dx = p.x-centerPoint.x;
            const dy = p.y-centerPoint.y;
            p.x = centerPoint.x+dx*zoom;
            p.y = centerPoint.y+dy*zoom;
        })
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
        this.imageEffectObj[this.SelectedImage.index].px=e.clientX-this.dragStartX;
        this.imageEffectObj[this.SelectedImage.index].py=e.clientY-this.dragStartY;
        const image = this.imageEffectObj[this.SelectedImage.index];
        this.SelectedImage.px=image.px;
        this.SelectedImage.py=image.py;
        const {AdjustedImageCordinate}=this.getAllCordinate(this.SelectedImage.index);
        // this.clear();
        // this.setBackgroundColorHex(this.StaticCanvasColor);
        this.clearInteractive();
        this.drawCanvas();
        // this.image_FrameArr[this.SelectedImage.index]={...this.image_FrameArr[this.SelectedImage.index],x:image.px,y:image.py}
        this.drawFrame(AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.topLeft.y,AdjustedImageCordinate.bottomRight.x-AdjustedImageCordinate.topLeft.x,AdjustedImageCordinate.bottomRight.y-AdjustedImageCordinate.topLeft.y);
    }
    dragMoveShape(e:MouseEvent){
        if (!this.MoveShape) {
            return;   
        }
        const {index,dx,dy}=this.MoveShape;
        const shape = this.ShapeManger!.shapesArray[index];
        let newX:number;
        let newY:number;
        if (shape?.type==='arc') {
            newX = e.clientX-dx;
            newY = e.clientY-dy;
            this.ShapeManger?.setStartPosition(index,newX,newY);
        }
        // else if (shape?.type==='rectangle2') {
        //     newX = e.clientX-dx;
        //     newY = e.clientY-dy;
        //     const {endPoint,startPoint}=shape;
        //     const w = endPoint.x-startPoint.x;
        //     const h = endPoint.y-startPoint.y;
        //     const newEndPoint={x:newX+w,y:newY+h};
        //     this.ShapeManger!.shapesArray[index]={...shape,startPoint:{x:newX,y:newY},endPoint:newEndPoint}
        // }
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
        else if (shape.type==='ellipse') {
            console.log(shape)
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
        const fillStyle = obj.fillStyle || "rgba(0, 0, 0, 1)";
        const strokeStyle = obj.strokeStyle || 'rgba(255, 255, 255, 1)';
        const radii = obj.radii || 0;
    
        const validatedRadii = Math.max(radii, 0);
    
        if (!this.InteractiveCtx) {
            return;
        }
    
        this.InteractiveCtx.save();
        this.InteractiveCtx.fillStyle = fillStyle;
        this.InteractiveCtx.strokeStyle = strokeStyle;
        this.InteractiveCtx.lineWidth = 0.8;
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
        // else if (shape.type === 'rectangle2') {
        //     const {startPoint,endPoint,angle}=shape
        //     this.drawFrame(startPoint.x,startPoint.y,endPoint.x-startPoint.x,endPoint.y-startPoint.y,{angle:angle});
        //     // the bewlow code is for a frame drawn over the shape and it's working
        //     // this.drawFrame2(startPoint,endPoint,angle);
        // }
    };
    getRotated_Point(A: point2, C: point2, angle: number): point2 {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        const newX = C.x + ((A.x - C.x) * cosTheta - (A.y - C.y) * sinTheta);
        const newY = C.y + ((A.x - C.x) * sinTheta + (A.y - C.y) * cosTheta);
        return { x: newX, y: newY };
    }
    getRotated_Point2(A: point2, C: point2, angle: number){
        const dist = this.ShapeManger!.calculateDistance2(A,C);
        const originalAngle = Math.atan2(A.y - C.y, A.x - C.x);
        const newAngle = originalAngle + angle;
        const newX = C.x + dist * Math.cos(newAngle);
        const newY = C.y + dist * Math.sin(newAngle);
        return { x: newX, y: newY };
    }
    drawFrame2(startPoint:point2,endPoint:point2,angle:number){
        const mid_Point={x:startPoint.x+(endPoint.x-startPoint.x)/2,y:startPoint.y+(endPoint.y-startPoint.y)/2};
        const newStartPoint = this.getRotated_Point(startPoint,mid_Point,angle);
        const newEndPoint = this.getRotated_Point(endPoint,mid_Point,angle);
        const topRightPoint = this.getRotated_Point({x:endPoint.x,y:startPoint.y},mid_Point,angle);
        const bottomleftPoint = this.getRotated_Point({x:startPoint.x,y:endPoint.y},mid_Point,angle);
        this.InteractiveCtx!.save();
        this.InteractiveCtx!.beginPath();
        this.InteractiveCtx!.moveTo(newStartPoint.x,newStartPoint.y);
        this.InteractiveCtx!.lineTo(topRightPoint.x,topRightPoint.y);
        this.InteractiveCtx!.lineTo(newEndPoint.x,newEndPoint.y);
        this.InteractiveCtx!.lineTo(bottomleftPoint.x,bottomleftPoint.y);
        this.InteractiveCtx!.closePath();
        this.InteractiveCtx!.strokeStyle = "rgba(255, 15, 15, 0.8)"
        this.InteractiveCtx!.stroke();
        this.InteractiveCtx!.restore();
    }
    drawFrame(x: number, y: number, w: number, h: number, obj: { squareSize?: number, space?: number,angle?:number } = { }) {
        // Calculate the new frame position with the given space
        const space = obj.space||12;
        const squareSize=obj.squareSize||8
        const angle = obj.angle || 0;

        const newX = x - space;
        const newY = y - space;
        const lastX = x + w + space;
        const lastY = y + h + space;
    
        // Draw the four small rectangles (corners)
        const corners = [
            { x: newX, y: newY }, // top-left
            { x: lastX - squareSize, y: newY }, // top-right
            { x: lastX - squareSize, y: lastY - squareSize }, // bottom-right
            { x: newX, y: lastY - squareSize }, // bottom-left
        ];
        // we have to add a roation method here
        const mid_Point={x:newX+(lastX-newX)/2,y:newY+(lastY-newY)/2};
        this.InteractiveCtx!.save();
        this.InteractiveCtx!.translate(mid_Point.x,mid_Point.y);
        this.InteractiveCtx!.rotate(angle);
        this.InteractiveCtx!.translate(-mid_Point.x,-mid_Point.y);
        corners.forEach(corner => {
            // this.drawRectangle(corner.x, corner.y, squareSize, squareSize);
            this.drawRectangleWithArc(corner.x, corner.y, squareSize, squareSize,{radii:2});
        });
        // draw a circle on the top
        const mx = newX+(lastX-newX)/2;
        const my = newY-20;
        this.drawCircle(mx,my,4);
        // Draw the outer rectangle
        this.drawRectangle(newX, newY, lastX - newX, lastY - newY, { fillStyle: 'rgba(0, 0, 0, 0)', strokeStyle: 'rgba(248, 110, 181, 1)' });

        this.InteractiveCtx!.restore();

        this.FrameCodinate.cornerRact = corners,
        this.FrameCodinate.size=squareSize;
        this.FrameCodinate.circlePoint={x:mx,y:my,radius:5};
    }
    showSelection(e: MouseEvent) {// basically this function show all the element which can be selected via mouse if mouse is above an element the mouse style is going to get change

        const imagePos = this.IsMouseOverImage(e.clientX, e.clientY);
        // const imagePos = this.IsMouseOverImage(e.clientX, e.clientY);// this is not working but above one is working a little bit
        if (imagePos.px !== null && imagePos.py !== null && imagePos.index !== null) {
            const target = e.target as HTMLElement;
            target.style.cursor = `move`
        }
        else {
            const target = e.target as HTMLElement;
            target.style.cursor = this.curseStyle
        }
    }
    IsMouseOverImage(x: number, y: number) {
        let ImagePosition: ImagePosition = { px: null, py: null, index: null,w:null,h:null }
        for (let i = 0; i < this.imageEffectObj.length; i++) {
            const maxX = Math.max(this.imageEffectObj[i].px + this.imageEffectObj[i].width,this.imageEffectObj[i].px);
            const minX = Math.min(this.imageEffectObj[i].px + this.imageEffectObj[i].width,this.imageEffectObj[i].px);
            const maxY =Math.max(this.imageEffectObj[i].py + this.imageEffectObj[i].height,this.imageEffectObj[i].py);
            const minY=Math.min(this.imageEffectObj[i].py + this.imageEffectObj[i].height,this.imageEffectObj[i].py);
            if (x<=maxX && x>=minX && y<=maxY && y>=minY) {
                ImagePosition = { px: this.imageEffectObj[i].px, py: this.imageEffectObj[i].py, index: i,w:this.imageEffectObj[i].width,h:this.imageEffectObj[i].height }
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
                }
            }
        }
        const {x,y,radius}=this.FrameCodinate.circlePoint;// circle
        const dist = Math.hypot(e.clientX-x,e.clientY-y);
        if (dist<=radius && chack===null) {
            chack=4;
        }
        //[0:top-left,1:top-right,2:bottom-right,3:bottom-left]
        if (chack===1 || chack===3) {
            target.style.cursor = `nesw-resize`
        }
        else if (chack===0 || chack===2){
            target.style.cursor = `nwse-resize`
        }
        else{
            target.style.cursor = this.curseStyle;
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
    applyFilter(colorFilter: FineTuneTypes){
        if (this.SelectedImage.px === null || this.SelectedImage.py === null || this.SelectedImage.index === null) {
            return;
        }
        this.imageEffectObj[this.SelectedImage.index].imageEffectObj.applyFilter(colorFilter);
        this.clear();
        this.drawCanvas();
    }
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
        if (!this.ctx) {
            return;
        }
        const value = this.ctx.getImageData(x,y,w,h);
        return value;
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
            px, py, width, height, imageEffectObj: ImageObj,angle:0
        });
        // this.image_FrameArr.push({
        //     x:px,
        //     y:py,
        //     w:width,
        //     h:height,
        //     angle:0
        // });
    }
    drawCanvas() {
        if (!this.ctx || !this.imageEffectObj) {
            return;
        }
        this.setBackgroundColorHex(this.StaticCanvasColor);
        // this.ctx.save();
        // this.ctx.translate(this.Origin.x, this.Origin.y);
        // this.ctx.scale(this.scale, this.scale);
        // this.ctx.translate(-this.Origin.x, -this.Origin.y);
        this.drawImage2();
        // this.ctx.restore();
    }
    drawImage2() {
        if (!this.ctx || this.imageEffectObj.length===0) {
            return;
        }
        for (let i = 0; i < this.imageEffectObj.length; i++) {
            const canvas = this.imageEffectObj[i].imageEffectObj.canvas;
            const image = this.imageEffectObj[i];
            const centerpoint = {x:image.px+image.width/2,y:image.py+image.height/2};

            this.ctx.save();
            this.ctx.translate(centerpoint.x, centerpoint.y);
            this.ctx.rotate(image.angle);
            this.ctx.translate(-centerpoint.x, -centerpoint.y);
            this.ctx.drawImage(canvas, this.imageEffectObj[i].px, this.imageEffectObj[i].py,this.imageEffectObj[i].width,this.imageEffectObj[i].height);
            this.ctx.restore();
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
