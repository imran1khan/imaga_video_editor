import { atom } from "recoil";

export const ImageFileListAtom=atom<HTMLImageElement[]>({
    key:`ImageFileListAtom`,
    default:[],
});