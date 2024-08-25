export interface RGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}
interface shapeUnit {
    type:string,
}
export interface point {
    x:number|null,
    y:number|null
}

export interface point2 {
    x:number,
    y:number
}

export interface line extends shapeUnit {
    type:'line',
    startPoint:point2,
    endPoint:point2,
}
export interface rectangle extends shapeUnit {
    type:'ractangle'
    startPoint:point,
    width:number,
    height:number,
}
export interface rectangle2 extends shapeUnit{
    type:'rectangle2',
    startPoint:point2,
    endPoint:point2,
    angle:number
}
export interface arc extends shapeUnit {
    type:`arc`
    startPoint:point,
    radius:number|null,
    startAngle:number|null,
    endAngle:number|null,
    counterClockWise:number|null,
}
export interface arc2 extends shapeUnit {
    type:`arc`
    startPoint:point2,
    radius:number,
    startAngle:number,
    endAngle:number,
    counterClockWise:boolean,
}
export type pointsArray = point2[];
export type shape =  arc | arc2 | rectangle2 | line ;
