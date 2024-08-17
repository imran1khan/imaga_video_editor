import { drawingMode } from "@/utils/CanvasClass";
import { atom } from "recoil";

export const SquareAtom = atom<drawingMode>({
    key: 'SquareAtom',
    default:'none',
});