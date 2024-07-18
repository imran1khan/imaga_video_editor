import { atom } from "recoil";

export interface FineTuneTypes {
    brightness: number;
    saturate: number;
    opacity: number;
    blur: number;
    contrast: number;
    grayscale: number;
    sepia: number;
    hue_rotate: number;
    invert : number;
    color: string;
}
export type FineTuneKey = keyof FineTuneTypes
export const FineTuneAtom = atom<FineTuneTypes>({
    key: 'FineTuneAtom',
    default: {
        brightness: 100,
        saturate: 100,
        opacity : 100,
        blur : 0,
        contrast: 100,
        grayscale: 0, 
        sepia: 0,
        hue_rotate : 0,
        invert : 0,
        color: ``
    },
});
export const canvasScreenToggel=atom({
    key:"canvasScreenToggel",
    default:false,
});
export const HoldFineTuneAtom=atom<FineTuneTypes>({
    key:"HoldFineTuneAtom",
    default: {
        brightness: 100,
        saturate: 100,
        opacity : 100,
        blur : 0,
        contrast: 100,
        grayscale: 0, 
        sepia: 0,
        hue_rotate : 0,
        invert : 0,
        color: ``
    },
});
export interface ImageFilterArray extends FineTuneTypes {
    imageUrl:string,
}
export const FineTuneAtomArray=atom<ImageFilterArray[]>({
    key:"FineTuneAtomArray",
    default:[]
});
