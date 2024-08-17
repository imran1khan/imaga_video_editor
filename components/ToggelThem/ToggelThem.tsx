'use client'
import React, { useEffect, useState } from 'react'

function useToggelThem() {
    const [Theme,setTheme]=useState(false);
    useEffect(()=>{
        const body = document.querySelector('body');
        if (Theme) {
            body?.classList.remove('dark');
        }
        else{
           body?.classList.add('dark'); 
        }
    },[Theme]);
  return {
    Theme,setTheme
  }
}

export default useToggelThem