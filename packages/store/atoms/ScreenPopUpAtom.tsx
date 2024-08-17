import { atom } from "recoil";
export const ScreenPopoUpAtom = atom({
    key: 'ScreenPopoUpAtom',
    default: {
        display:'none',
        top:0,
        left:0,
        width:200,
        height:200,
    },
});
export const deleteImageAtom=atom({
    key:"deleteImageAtom",
    default:false
});
export const changeAspectratio=atom({
    key:"changeAspectratio",
    default:false
});