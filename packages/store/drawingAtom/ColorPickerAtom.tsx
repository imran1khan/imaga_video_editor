import { atom } from "recoil";

export const colorPickerAtom = atom({
    key: 'colorPickerAtom',
    default:[
        '#404258',
        '#474E68',
        '#50577A',
        '#6B728E',
        '#B4B4B8'
    ],
});

export const selectedColorAtom = atom({
    key:'selectedColorAtom',
    default: '#404258'
});

export const ColorPickerPopUpAtom=atom({
    key:'ColorPickerPopUpAtom',
    default:{
        color:'#404258',
        display:'none',
        top:0,
        left:0,
        width:40,
        height:40,
    }

})