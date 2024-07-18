import { atom } from "recoil";

export const SaveFilterAtom = atom<boolean>({
    key: 'SaveFilterAtom',
    default: false,
});