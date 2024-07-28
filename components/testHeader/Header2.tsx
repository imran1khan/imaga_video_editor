"use client"
import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Circle, Diamond, Eraser, Hand, Image as Img, Lock, Minus, MoveRight, Pen, PencilRuler, Square, Type } from 'lucide-react'
import HamMenu from './HamMenu'

function Header2() {
    // const mouseEnter = useCallback(() => { console.log('mouse have enetred') }, [])
    return (
        <header onMouseEnter={()=>{}} className="w-full flex justify-between absolute px-4 mt-2">
            <div className="z-[1]">
                <HamMenu/>
            </div>
            <div className="bg-gray-900 rounded-md z-[1] flex items-center">
                <div className='flex items-center space-x-4 px-4 h-full'>
                    <div className='hover:cursor-pointer'><Lock size={15} strokeWidth={1.5} /></div>
                    <div className='bg-slate-400 w-[0.08rem] h-[1rem]'></div>
                    <div className='hover:cursor-pointer'><Hand size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Pen size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Square size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Diamond size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Circle size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><MoveRight size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Minus size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Type size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Img size={15} strokeWidth={1.5} /></div>
                    <div className='hover:cursor-pointer'><Eraser size={15} strokeWidth={1.5} /></div>
                    <div className='bg-slate-400 w-[0.08rem] h-[1rem]'></div>
                    <div className='hover:cursor-pointer'><PencilRuler size={15} strokeWidth={1.5} /></div>
                </div>
            </div>
            <div className=' rounded-md z-[1] flex justify-end space-x-2'>
                <Button variant={`outline`}>share</Button>
                <Button variant={`outline`}>library</Button>
            </div>
        </header>
    )
}
export default Header2