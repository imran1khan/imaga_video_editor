"use client"
import { changeAspectratio, deleteImageAtom, ScreenPopoUpAtom } from '@/packages/store/atoms/ScreenPopUpAtom';
import React, { memo, useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

function ScreenPopoUp() {
    const ScreenPopUp = useRecoilValue(ScreenPopoUpAtom);
    const setDelete = useSetRecoilState(deleteImageAtom);
    const [aspectRatio,setAspectRatio]=useRecoilState(changeAspectratio);
  return (
    <div tabIndex={-1} style={{display:ScreenPopUp.display,width:ScreenPopUp.width,height:ScreenPopUp.height, top:ScreenPopUp.top,left:ScreenPopUp.left}} className={`z-[1] absolute dark:bg-black bg-slate-400 rounded-md `}>
      <div onClick={()=>{setDelete(true)}} className='cursor-pointer text-red-600 uppercase font-[400] dark:hover:bg-slate-950 hover:bg-slate-500 pl-2'>delete</div>
      <div onClick={()=>{setAspectRatio(p=>!p)}} 
      className={`cursor-pointer uppercase font-[400] ${aspectRatio?'bg-slate-600':''} dark:hover:bg-slate-950 hover:bg-slate-500 pl-2`}>aspect ratio</div>
    </div>
  )
}
const ScreenPopUp = memo(ScreenPopoUp);
export default ScreenPopUp