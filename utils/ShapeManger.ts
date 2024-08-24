import { arc, arc2, line, point2, rectangle, rectangle2, shape } from "./Interface";

export class ShapeManager {
    public shapesArray: shape[] = [];
    private ctx: CanvasRenderingContext2D | null = null;

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
                const linelength = this.calculateDistance(startPoint,endPoint);
                const P1_dist =  this.calculateDistance(startPoint,{x,y});
                const p2_dist = this.calculateDistance(endPoint,{x,y});
                const tolerance = 1;
                if (Math.abs(p2_dist+P1_dist-linelength)<=tolerance) {
                    return i;
                }
            }
        }
        return null;
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
