import { arc, arc2, point2, rectangle, shape } from "./Interface";


export class ShapeManager {
    public shapesArray: shape[] = [];
    private ctx: CanvasRenderingContext2D | null = null;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
    
    drawShapes() {
        if (!this.ctx) return;
        this.shapesArray.forEach(shape => {
            if (shape.type === 'ractangle') {
                const { startPoint, width, height } = shape as rectangle;
                this.drawRectangleWithArc(startPoint.x!, startPoint.y!, width!, height!);
            }
            if (shape.type === 'arc') {
                const arcShape = shape as arc2;
                this.drawArc(arcShape);
            }
        });
    }
    
    drawArc(arc: arc2,obj:{
        fillStyle?: string,
        strokeStyle?: string}={}
    ) {
        const { startPoint, radius, startAngle, endAngle, counterClockWise } = arc;

        // const centerX = startPoint.x + radius * Math.cos(startAngle);
        // const centerY = startPoint.y + radius * Math.sin(startAngle);
        const fillStyle = obj.fillStyle || "rgba(255, 147, 203, 0.04)";
        const strokeStyle = obj.strokeStyle || 'rgba(248, 110, 181, 1)';
        if (!this.ctx) {
            return;
        }
        this.ctx.save();
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();
        // this.ctx.arc(centerX, centerY, radius, startAngle, endAngle, counterClockWise);
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

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(A.x, A.y);
        this.ctx.lineTo(B.x, B.y);
        if (obj.setLineDesh && obj.setLineDesh.length>0) {
            this.ctx.setLineDash(obj.setLineDesh);
        }
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
        } = {}
    ){
        const fillStyle = obj.fillStyle || "rgba(255, 147, 203, 0.04)";
        const strokeStyle = obj.strokeStyle || 'rgba(248, 110, 181, 1)';
        const radii = obj.radii || 0;
    
        const validatedRadii = Math.max(radii, 0);
        if (!this.ctx) {
            return;
        }
        this.ctx.save();
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, validatedRadii);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

    }
}
