'use client'
import { TextAreaPopup, TextAreaPopup_Conent } from '@/packages/store/atoms/TextAreaPopUpAtom';
import { CookingPot } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil';
let fontSize=20;
function TextArea() {
  const [textArea,setTextArea]=useRecoilState(TextAreaPopup);
  const [content,setContent]=useRecoilState(TextAreaPopup_Conent);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{
    if (textArea.display!=='none' && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.style.width='1px';
      textAreaRef.current.style.height='25px';
    }
  },[textArea.display,textArea.top,textArea.left]);

  const handelInput=(e:React.FormEvent<HTMLTextAreaElement>)=>{
    const target = e.target as HTMLTextAreaElement;
    const rect = target.getBoundingClientRect();
    const maxWidth = window.innerWidth - rect.left;
    const maxHeight = window.innerHeight-rect.top;
    if (target.value) {
      const newWidth = Math.min(target.scrollWidth, maxWidth);
      const newHeight = Math.min(target.scrollHeight,maxHeight);
      target.style.width = `${newWidth}px`;
      target.style.height = `${newHeight}px`;
      setTextArea((p)=>{
        return {...p,width:newWidth,height:newHeight}
      })
    }
    else{
      target.style.width = '1px';
      target.style.height = '25px';
      setTextArea((p)=>{
        return {...p,width:1,height:25}
      })
    }
  }
  const onkeyDown=(e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
    const target = e.target as HTMLTextAreaElement;
    if (e.key==='Backspace') {
      
    }
  }
  return (
      <textarea ref={textAreaRef}
      className='bg-pink-300'
          name=""
          id="textarea1001"
          style={{
              fontSize:fontSize,
              top:textArea.top,
              left:textArea.left,
              display:textArea.display,
              zIndex:1,
              position:'absolute',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              overflowY:'hidden',
              resize: 'none',
              width:textArea.width,
              height:textArea.height,
              color: textArea.color,
              caretColor: textArea.caretColor,
          }}
          value={content}
          onChange={(e)=>{
            setContent(e.target.value)
          }}
          onKeyDown={onkeyDown}
          onInput={handelInput}
      ></textarea>
  )
}

export default TextArea