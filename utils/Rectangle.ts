abstract class Shape {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    isInside(mouseX: number, mouseY: number): boolean {
        return mouseX >= this.x && mouseX <= this.x + this.width &&
               mouseY >= this.y && mouseY <= this.y + this.height;
    }
}

class Rectangle extends Shape {
    // width: number;
    // height: number;
    angle: number = 0; // Rotation angle in radians

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y,width,height);
        // this.width = width;
        // this.height = height;
    }

    // Method to rotate the rectangle
    rotate(angle: number, centerX?: number, centerY?: number) {
        if (centerX === undefined || centerY === undefined) {
            centerX = this.x + this.width / 2;
            centerY = this.y + this.height / 2;
        }

        this.angle = angle;

        // Update the position to reflect rotation
        // This will need to account for the new bounds of the rectangle
        // Calculating new position based on rotation
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const dx = this.x - centerX;
        const dy = this.y - centerY;

        this.x = centerX + dx * cosA - dy * sinA;
        this.y = centerY + dx * sinA + dy * cosA;
    }

    // Method to draw the rotated rectangle
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.width / 2, -this.height / 2);

        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    }
}
