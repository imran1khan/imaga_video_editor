import { memo, useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { FineTuneAtom, FineTuneAtomArray, ImageFilterArray } from '@/packages/store/atoms/FinetuneAtom';
import { SaveFilterAtom } from '@/packages/store/atoms/SaveFilterAtom';
import Image from 'next/image';


function Filter() {
    const setSaveFilterAtom = useSetRecoilState(SaveFilterAtom);
    const [imageFilterArray,setImageFilterArray] = useRecoilState(FineTuneAtomArray);
    const [reander,setReander]=useState(false);
    useEffect(()=>{
    },[reander]);// this is just to reset the value after saving the data
    const onClickHandler=useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        setSaveFilterAtom(true);
        setReander(p=>!p);
    },[setSaveFilterAtom])
    const clearFilter=useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        localStorage.removeItem(`FilterArrayList`);
        setImageFilterArray([]);
        setReander(p=>!p)
    },[setImageFilterArray]);
    return (
        <div className='w-full h-full'>
            <div className='flex justify-evenly'>
                <Button onClick={onClickHandler} variant={`outline`}>save</Button>
                <Button onClick={clearFilter} variant={`outline`}>clear</Button>
            </div>
            <hr />
            <div className='w-full h-full text-wrap bg-purple-500'>
                {imageFilterArray.map((v)=>(
                    <img className='max-w-full h-auto' key={v.imageUrl} src={v.imageUrl} alt=''/>
                ))}
            </div>
        </div>
    )
}

export default memo(Filter)