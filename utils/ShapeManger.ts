import { CanvasDraw } from "./CanvasClass";
import { arc, arc2, line, pointsArray, point2, shape, text, ellipse } from "./Interface";
// import { arc, arc2, line, pointsArray, point2, rectangle, rectangle2, shape, text } from "./Interface";

export class ShapeManager {
    public shapesArray: shape[] = [];
    public penShapes:pointsArray[]=[];
    public polygonShapes:pointsArray[]=[];
    private ctx: CanvasRenderingContext2D | null = null;
    public textContent:text[]=[];
    private CanvasDraw:CanvasDraw;
    constructor(ctx: CanvasRenderingContext2D,CanvasDraw:CanvasDraw) {
        this.ctx = ctx;
        this.CanvasDraw=CanvasDraw;
    }
    setStartPosition(index:number,x:number,y:number){
        const shape = this.shapesArray[index];
        this.shapesArray[index]={...shape,startPoint:{x:x,y:y}};
    }
    isMouseOverTheShape(x:number,y:number){
        for (let i = 0; i < this.shapesArray.length; i++){
            if (this.shapesArray[i].type==='arc') {
                const {radius}= this.shapesArray[i] as arc2
                const startP = this.shapesArray[i].startPoint;
                const dist = this.calculateDistance({x:startP.x!,y:startP.y!},{x:x,y:y});
                if (dist<=radius) {
                    return i;
                }
            }
            // else if (this.shapesArray[i].type==='rectangle2') {
            //     const shape=this.shapesArray[i] as rectangle2
            //     const s1 = shape.startPoint;
            //     const e1 = shape.endPoint;
            //     if (x>=s1.x && x<=e1.x && y>=s1.y && y<=e1.y) {
            //         return i;
            //     }
            // }
            else if (this.shapesArray[i].type==='line') {
                const {startPoint,endPoint}=this.shapesArray[i] as line;
                if (this.isPointOnTheline(startPoint,endPoint,{x,y})) {
                    return i;
                }
            }
        }
        return null;
    }
    isMouseOverCustomShape(x:number,y:number){
        for (let i = 0; i < this.penShapes.length; i++) {
            const shape = this.penShapes[i];
            for (let j = 0; j < shape.length-1; j++) {
                const A = shape[j];
                const B = shape[j+1];
                if (this.isPointOnTheline(A,B,{x,y},{tolerance:5})) {
                    return i
                }
            }
        }
        return -1;
    }
    drawShapes() {
        if (!this.ctx) return;
        // we have to add elips and shapes made of points
        this.shapesArray.forEach(shape => {
            if (shape.type === 'arc') {
                const arcShape = shape as arc2;
                this.drawArc(arcShape);
            }
            // if (shape.type === 'rectangle2') {
            //     const {startPoint,endPoint,angle}=shape;
            //     this.drawRectangleWithArc(startPoint.x, startPoint.y, endPoint.x-startPoint.x, endPoint.y-startPoint.y,{rotation:angle});
            // }
            if (shape.type==='line') {
                const {startPoint,endPoint}=shape;
                this.drawLine(startPoint,endPoint);
            }
            if (shape.type==='ellipse') {
                this.drawEllipse(shape);
            }
        });
    }
    zoomShapes(zoom:number,centerPoint:point2){
        this.shapesArray.forEach(shape => {
            if (shape.type === 'arc') {
                const arcShape = shape as arc2;
                const newStartPoint = [arcShape.startPoint];
                const newRadius = arcShape.radius*zoom;
                this.CanvasDraw.scaledPolygon(newStartPoint,zoom,centerPoint);
                shape.radius=newRadius;
                shape.startPoint=newStartPoint[0];
            }
            else if (shape.type==='line') {
                const {startPoint,endPoint}=shape;
                this.CanvasDraw.scaledPolygon([startPoint,endPoint],zoom,centerPoint);
            }
        });
    }
    panShapes(dx:number,dy:number){
        this.shapesArray.forEach(shape => {
            if (shape.type === 'arc') {
                const arcShape = shape as arc2;
                shape.startPoint.x!+=dx;
                shape.startPoint.y!+=dy;
            }
            else if (shape.type==='line') {
                const {startPoint,endPoint}=shape;
                this.CanvasDraw.panPolygon([startPoint,endPoint],dx,dy);
            }
        });
    }
    drawCustomShape(){
        if (!this.ctx) return;
        for (let i = 0; i < this.penShapes.length; i++) {
            const shape = this.penShapes[i];
            this.drawPenShape(shape);
        }
    }
    drawPenShape(shape:pointsArray){
        if (shape.length<2 || !this.ctx) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(shape[0].x,shape[0].y);
        for (let i = 1; i < shape.length; i++) {
            this.ctx.lineTo(shape[i].x,shape[i].y);
        }
        this.ctx.lineWidth = 5;
        this.ctx.lineCap='round';
        this.ctx.lineJoin='round';
        this.ctx.stroke();
        this.ctx.restore();
    }
    zoomPenShapes(zoom:number,centerPoint:point2){
        for (let i = 0; i < this.penShapes.length; i++) {
            const p = this.penShapes[i];
            this.CanvasDraw.scaledPolygon(p,zoom,centerPoint);
        }
    }
    panPenShapes(dx:number,dy:number){
        for (let i = 0; i < this.penShapes.length; i++) {
            const p = this.penShapes[i];
            this.CanvasDraw.panPolygon(p,dx,dy);
        }
    }
    drawPolygonShapes(){
        if (!this.ctx) return;
        for (let i = 0; i < this.polygonShapes.length; i++) {
            const shape = this.polygonShapes[i];
            this.drawIrregularPolygons(shape);
        }
    }
    drawIrregularPolygons(shape:pointsArray){
        if (shape.length<2 || !this.ctx) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(shape[0].x,shape[0].y);
        for (let i = 1; i < shape.length; i++) {
            this.ctx.lineTo(shape[i].x,shape[i].y);
        }
        this.ctx.closePath();
        this.ctx.lineWidth = 5;
        this.ctx.lineCap='round';
        this.ctx.lineJoin='round';
        this.ctx.stroke();
        this.ctx.restore();
    }
    zoomAllPolygon(zoom:number,centerPoint:point2){
        for (let i = 0; i < this.polygonShapes.length; i++) {
            const polygon = this.polygonShapes[i];
            this.CanvasDraw.scaledPolygon(polygon,zoom,centerPoint);
        }
    }
    panAllpolygon(dx:number,dy:number){
        for (let i = 0; i < this.polygonShapes.length; i++) {
            const polygon = this.polygonShapes[i];
            this.CanvasDraw.panPolygon(polygon,dx,dy);
        }
    }
    isMouseOnPolygon(p: point2): number | null {
        for (let i = 0; i < this.polygonShapes.length; i++) {
            if (this.isPointOnPolygon(p, this.polygonShapes[i])) {
                return i;
            }
        }
        return null;
    }
    isPointOnPolygon(p: point2, shape: pointsArray): boolean {
        let count = 0;
        for (let i = 0; i < shape.length; i++) {
            const p1 = shape[i];
            const p2 = shape[(i + 1) % shape.length];
            if (this.isPointOnEdge(p, p1, p2)) {
                return true;
            }
            if (this.rayIntersectsLine(p, p1, p2)) {
                count++;
            }
        }
        return count % 2 === 1;
    }
    isPointOnEdge(point: point2, p1: point2, p2: point2): boolean {
        const crossProduct = (point.y - p1.y) * (p2.x - p1.x) - (point.x - p1.x) * (p2.y - p1.y);
        if (Math.abs(crossProduct) > Number.EPSILON) {
            return false;
        }
        const dotProduct = (point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y);
        if (dotProduct < 0) {
            return false;
        }
        const squaredLength = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
        return dotProduct <= squaredLength;
    }
    rayIntersectsLine(point: point2, p1: point2, p2: point2): boolean {
        if (point.y < Math.min(p1.y, p2.y) || point.y > Math.max(p1.y, p2.y)) {
            return false;
        }
        
        if (p1.x === p2.x) {
            return point.x <= p1.x;
        }
    
        const slope = (p2.y - p1.y) / (p2.x - p1.x);
        const intercept = p1.y - slope * p1.x;
        const xIntersection = (point.y - intercept) / slope;

        return xIntersection >= point.x;
    }
    
    
    rotateIrregularPolygons(shape:pointsArray,angle:number,obj:{centerPoint?:point2}={}){
        let centerPoint:point2={x:0,y:0};
        if (obj.centerPoint===undefined) {
            for (let i = 0; i < shape.length; i++) {
                centerPoint.x+=shape[i].x;
                centerPoint.y+=shape[i].y;
            }
            centerPoint.x/=shape.length;
            centerPoint.y/=shape.length;
        }
        else{
            centerPoint=obj.centerPoint;
        }

        for (let i = 0; i < shape.length; i++) {
            const p = shape[i];
            shape[i] = this.CanvasDraw.getRotated_Point(p,centerPoint,angle);
        }
        // this.ctx!.save();
        // this.ctx?.translate(centerPoint.x,centerPoint.y);
        // this.ctx?.rotate(angle);
        // this.ctx?.translate(-centerPoint.x,-centerPoint.y);
        // this.drawIrregularPolygons(shape);
        // this.ctx!.restore();
    }
    drawAlltextContent(){
        for (let i = 0; i < this.textContent.length; i++) {
            this.drawText(this.textContent[i].content,this.textContent[i].startPoint.x,this.textContent[i].startPoint.y,this.textContent[i].textSize);
        }
    }
    drawText(text:string,x:number,y:number,TextSize:number,obj:{maxWidth?:number}={}){
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.textBaseline='top';
        this.ctx.font = `${TextSize}px Arial`;
        this.ctx.fillStyle = 'black';
        const lines = text.split('\n');
        const lineHeight=24;
        let totalWidth=0;
        lines.forEach((v,i)=>{
            const lineWidth = this.ctx!.measureText(v).width;
            totalWidth=Math.max(totalWidth,lineWidth);
            this.ctx!.fillText(v,x,y+(lineHeight*i));
        });
        this.ctx.restore();
        const totalHeight = lineHeight*lines.length;
        return {
            x,y,totalHeight,totalWidth
        }
    }
    zoomText(zoom:number,centerPoint:point2){
        for (let i = 0; i < this.textContent.length; i++) {
            const text = this.textContent[i];
            const points=[text.startPoint]
            this.CanvasDraw.scaledPolygon(points,zoom,centerPoint);
            this.textContent[i].textSize*=zoom;
            this.textContent[i].width*=zoom;
            this.textContent[i].height*=zoom;
            this.textContent[i].startPoint=points[0];
        }
    }
    panText(dx:number,dy:number){
        for (let i = 0; i < this.textContent.length; i++) {
            this.textContent[i].startPoint.x+=dx;
            this.textContent[i].startPoint.y+=dy;
        }
    }
    isPointOntheText(p:point2){
        for (let i = 0; i < this.textContent.length; i++) {
            const {height,startPoint,width}=this.textContent[i];
            if (p.x>=startPoint.x && p.y>=startPoint.y && p.x<=startPoint.x+width && p.y<=startPoint.y+height) {
                return i;
            }
        }
        return null;
    }
    drawEllipse(ellipse:ellipse){
        if (!this.ctx) {
            return;
        }
        const {startPoint,radiusX,radiusY,anticlockwise,startAngle,endAngle,rotation}=ellipse;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(startPoint.x,startPoint.y,radiusX,radiusY,rotation,startAngle,endAngle,anticlockwise);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
    drawArc(arc: arc2,obj:{
        fillStyle?: string,
        strokeStyle?: string}={}
    ) {
        const { startPoint, radius, startAngle, endAngle, counterClockWise } = arc;

        const fillStyle = obj.fillStyle || "rgba(120, 126, 167, 0.18)";
        const strokeStyle = obj.strokeStyle || 'rgba(0, 39, 248, 1)';
        if (!this.ctx) {
            return;
        }
        this.ctx.save();
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();

        this.ctx.arc(startPoint.x, startPoint.y, radius, startAngle, endAngle, counterClockWise);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawLine(A:point2,B:point2,obj:{
        setLineDesh?:number[],
        fillStyle?: string,
        strokeStyle?: string}={}
    ){
        if (!this.ctx) {
            return;
        }
        const fillStyle = obj.fillStyle || "rgba(255, 147, 203, 0.04)";
        const strokeStyle = obj.strokeStyle || 'rgba(248, 110, 181, 1)';

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(A.x, A.y);
        this.ctx.lineTo(B.x, B.y);
        if (obj.setLineDesh && obj.setLineDesh.length>0) {
            this.ctx.setLineDash(obj.setLineDesh);
        }
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
    calculateDistance(A:point2,B:point2){
        const dx = A.x - B.x;
        const dy = A.y - B.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
    calculateDistance2(A: point2, B: point2) {
        return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    }
    angleBetweenPoints(A:point2,B:point2){
        return Math.atan2(B.y-A.y,B.x-A.x);
    }
    toXY(length:number,angle:number,startPoint:point2={x:0,y:0}){
        let p={x:0,y:0}
        p.x = startPoint.x+length*Math.cos(angle);
        p.y=startPoint.y+length*Math.sin(angle);
        return p;
    }
    isPointOnTheline(A:point2,B:point2,C:point2,obj:{tolerance?:number}={}){
        const tolerance = obj.tolerance || 1;
        // A and B makes line and we have to ckeck for C;
        const AB = this.calculateDistance(A,B);
        const AC =  this.calculateDistance(A,C);
        const BC = this.calculateDistance(C,B);
        if (Math.abs(AC+BC-AB)<=tolerance) {
            return true;
        }
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
            rotation?:number;
        } = {}
    ){
        const fillStyle = obj.fillStyle || "rgba(255, 147, 203, 0.04)";
        const strokeStyle = obj.strokeStyle || 'rgba(248, 110, 181, 1)';
        const radii = obj.radii || 0;
        const rotation = obj.rotation || 0;
    
        const validatedRadii = Math.max(radii, 0);
        if (!this.ctx) {
            return;
        }
        this.ctx.save();
        //rotating the shape
        this.ctx.translate(x+w/2,y+h/2);
        this.ctx.rotate(rotation);
        this.ctx.translate(-x-w/2,-y-h/2);
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, validatedRadii);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
}
