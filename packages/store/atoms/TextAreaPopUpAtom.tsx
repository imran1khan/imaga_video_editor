import { atom } from "recoil";

export const TextAreaPopup = atom({
    key: 'TextAreaPopup',
    default: {
        display:'none',
        content:'',
        top:20,
        left:20,
        color: 'black',
        caretColor: 'blue',
        width:1,
        height:25
    },
});
export const TextAreaPopup_Conent = atom({
    key: 'TextAreaConent',
    default: '',
});