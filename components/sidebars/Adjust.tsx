
import React, { memo } from 'react'
import { useRecoilState } from 'recoil'

function Adjust() {

  return (
    <div className='bg-purple-600 h-full'>
        <div>select <input type="checkbox" value={0} onChange={(e)=>{}} name="" id="" /></div>
        <div>move <input type="checkbox" value={0} onChange={(e)=>{}} name="" id="" /></div>
    </div>
  )
}

export default memo(Adjust)