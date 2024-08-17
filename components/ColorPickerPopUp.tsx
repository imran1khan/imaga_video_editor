'use client'
import { ColorPickerPopUpAtom } from '@/packages/store/drawingAtom/ColorPickerAtom';
import React from 'react'
import { useRecoilValue } from 'recoil'

function ColorPickerPopUp() {
    const pickerValue=useRecoilValue(ColorPickerPopUpAtom);
  return (
    <div style={{top:pickerValue.top,left:pickerValue.left,backgroundColor:pickerValue.color,width:pickerValue.width,height:pickerValue.height,display:pickerValue.display}} className='absolute rounded-md border border-black z-[1]'>
    </div>
  )
}

export default ColorPickerPopUp