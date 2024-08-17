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

export interface rectangle extends shapeUnit {
    type:'ractangle'
    startPoint:point,
    width:number|null,
    height:number|null
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

export type shape = rectangle | arc |arc2;
