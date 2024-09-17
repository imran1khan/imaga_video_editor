export interface RGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}
interface shapeUnit {
    type: string,
}
export interface point {
    x: number | null,
    y: number | null
}

export interface point2 {
    x: number,
    y: number
}

export interface line extends shapeUnit {
    type: 'line',
    startPoint: point2,
    endPoint: point2,
}
// export interface rectangle extends shapeUnit {
//     type:'ractangle'
//     startPoint:point,
//     width:number,
//     height:number,
// }
// export interface rectangle2 extends shapeUnit{
//     type:'rectangle2',
//     startPoint:point2,
//     endPoint:point2,
//     angle:number
// }
export interface arc extends shapeUnit {
    type: `arc`
    startPoint: point,
    radius: number | null,
    startAngle: number | null,
    endAngle: number | null,
    counterClockWise: number | null,
}
export interface arc2 extends shapeUnit {
    type: `arc`
    startPoint: point2,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterClockWise: boolean,
}
export interface ellipse extends shapeUnit {
    type: `ellipse`,
    startPoint: point2,
    radiusX: number; // Horizontal radius
    radiusY: number;  // Vertical radius
    rotation: number;  // Rotation in radians
    startAngle: number;  // Starting angle (in radians)
    endAngle: number;  // Ending angle (2 * PI for a full ellipse)
    anticlockwise: boolean; // Draw clockwise
}
export interface text {
    startPoint: point2;
    content: string;
    width: number,
    height: number,
    textSize: number,
}
export type pointsArray = point2[];
export type shape = arc | arc2 | line|ellipse;
