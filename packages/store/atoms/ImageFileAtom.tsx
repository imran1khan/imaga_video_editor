import { atom } from "recoil";

export const ImageFileAtom = atom<File | null>({
    key: 'ImageFileAtom',
    default: null,
});