"use client"
import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Circle, Diamond, Eraser, Hand, Image as Img, Lock, Minus, MousePointer, MoveRight, Pen, PencilRuler, Square, Type } from 'lucide-react'
import HamMenu from './HamMenu'
import { useRecoilState} from 'recoil'
import { SquareAtom } from '@/packages/store/drawingAtom/SquareAtom'
import HamMenu2 from './HamMenu2'
import { drawingMode } from '@/utils/CanvasClass'

function Header2() {
    const mouseEnter = useCallback(() => { console.log('mouse have enetred') }, [])
    const [squareAtom,setSquareAtom] = useRecoilState(SquareAtom);
    const onClick=(value:drawingMode)=>{
        setSquareAtom((p)=>{
            if (p==='none' || p!=value) {
                return value
            }
            return 'none'
        })
    }
    return (
        <header onMouseEnter={()=>{mouseEnter()}} className="w-full flex justify-between absolute px-4 mt-2">
            <div className="z-[1]">
                {/* <HamMenu/> */}
                <HamMenu2/>
            </div>
            <div className="dark:bg-gray-900 bg-slate-400 text-white rounded-md z-[1] flex items-center">
                <div className='flex items-center space-x-4 px-4 h-full'>
                    <div className='hover:cursor-pointer'><Lock size={15} strokeWidth={1.5} /></div>
                    <div className='dark:bg-slate-400 bg-slate-600 w-[0.08rem] h-[1rem]'></div>
                    <div onClick={()=>{onClick('pan')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='pan'?`dark:bg-purple-500 bg-green-600`:``}`}><Hand size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><MousePointer size={15} strokeWidth={1.5} /></div>
                    <div onClick={()=>{onClick('pen')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='pen'?`dark:bg-purple-500 bg-green-600`:``}`}><Pen size={15} strokeWidth={1.5} /></div>
                    <div onClick={()=>{onClick('ractangle')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='ractangle'?`dark:bg-purple-500 bg-green-600`:``}`}><Square size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Diamond size={15} strokeWidth={1.5} /></div>
                    <div onClick={()=>{onClick('arc')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='arc'?`dark:bg-purple-500 bg-green-600`:``}`}><Circle size={15} strokeWidth={1.5} /></div>
                    {/* <div className='hover:cursor-pointer'><MoveRight size={15} strokeWidth={1.5} /></div> */}
                    <div onClick={()=>{onClick('line')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='line'?`dark:bg-purple-500 bg-green-600`:``}`}><Minus size={15} strokeWidth={1.5} /></div>
                    <div onClick={()=>{onClick('text')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='text'?`dark:bg-purple-500 bg-green-600`:``}`}><Type size={15} strokeWidth={1.5} /></div>
                    {/* <div className='hover:cursor-pointer'><Img size={15} strokeWidth={1.5} /></div> */}
                    <div onClick={()=>{onClick('eraser')}} className={`hover:cursor-pointer h-full px-3 rounded-md flex items-center ${squareAtom==='eraser'?`dark:bg-purple-500 bg-green-600`:``}`}><Eraser size={15} strokeWidth={1.5} /></div>
                    <div className='bg-slate-400 w-[0.08rem] h-[1rem]'></div>
                    <div className='hover:cursor-pointer'><PencilRuler size={15} strokeWidth={1.5} /></div>
                </div>
            </div>
            <div className=' rounded-md z-[1] flex justify-end space-x-2 text-white'>
                <Button className='dark:bg-gray-900 bg-gray-400' variant={`outline`}>share</Button>
                <Button className='dark:bg-gray-900 bg-gray-400' variant={`outline`}>library</Button>
            </div>
        </header>
    )
}
export default Header2