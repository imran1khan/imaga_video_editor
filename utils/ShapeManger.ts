import { arc, arc2, line, pointsArray, point2, rectangle, rectangle2, shape, text } from "./Interface";

export class ShapeManager {
    public shapesArray: shape[] = [];
    public penShapes:pointsArray[]=[];
    private ctx: CanvasRenderingContext2D | null = null;
    public textContent:text[]=[];

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
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
            else if (this.shapesArray[i].type==='rectangle2') {
                const shape=this.shapesArray[i] as rectangle2
                const s1 = shape.startPoint;
                const e1 = shape.endPoint;
                if (x>=s1.x && x<=e1.x && y>=s1.y && y<=e1.y) {
                    return i;
                }
            }
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
    findMaxMinPoints(p1:point2,p2:point2):{maxPoint:point2,minPoint:point2}{
        if (p1.x===p2.x && p1.y===p2.y) {
            return {maxPoint:p1,minPoint:p2};
        }
        else if (p1.x===p2.x) {
            return p1.y>p2.y?{maxPoint:p1,minPoint:p2}:{maxPoint:p2,minPoint:p1};
        }
        else {
            const maxX = Math.max(p1.x,p2.x);
            const minX = Math.min(p1.x,p2.x);
            const maxPoint = maxX===p1.x?p1:p2;
            const minPoint = minX===p1.x?p1:p2;
            return {maxPoint,minPoint};
        }
    }
    drawShapes() {
        if (!this.ctx) return;
        // we have to add elips and shapes made of points
        this.shapesArray.forEach(shape => {
            if (shape.type === 'arc') {
                const arcShape = shape as arc2;
                this.drawArc(arcShape);
            }
            if (shape.type === 'rectangle2') {
                const {startPoint,endPoint,angle}=shape;
                this.drawRectangleWithArc(startPoint.x, startPoint.y, endPoint.x-startPoint.x, endPoint.y-startPoint.y,{rotation:angle});
            }
            if (shape.type==='line') {
                const {startPoint,endPoint}=shape;
                this.drawLine(startPoint,endPoint);
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
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawAlltextContent(){
        for (let i = 0; i < this.textContent.length; i++) {
            this.drawText(this.textContent[i].content,this.textContent[i].startPoint.x,this.textContent[i].startPoint.y);
        }
    }
    drawText(text:string,x:number,y:number,obj:{maxWidth?:number}={}){
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.textBaseline='top';
        this.ctx.font = '20px Arial';
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
    isPointOntheText(p:point2){
        for (let i = 0; i < this.textContent.length; i++) {
            const {height,startPoint,width}=this.textContent[i];
            if (p.x>=startPoint.x && p.y>=startPoint.y && p.x<=startPoint.x+width && p.y<=startPoint.y+height) {
                return i;
            }
        }
        return null;
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
        //ratating the shape
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
