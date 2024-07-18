import { downloadImage } from "@/lib/utils";
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage";
import { canvasScreenToggel, FineTuneAtom, FineTuneAtomArray, FineTuneTypes, ImageFilterArray } from "@/packages/store/atoms/FinetuneAtom";
import { ImageFileAtom } from "@/packages/store/atoms/ImageFileAtom";
import { SaveFilterAtom } from "@/packages/store/atoms/SaveFilterAtom";

import { CanvasDraw } from "@/utils/CanvasClass";

import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const useCanvasClass=(canvasId:string)=>{
    const Imagefile = useRecoilValue(ImageFileAtom);
    const filter=useRecoilValue(FineTuneAtom);
    const canvasScreenTog = useRecoilValue(canvasScreenToggel);
    const canvasClassRef = useRef<CanvasDraw | null>(null);
    const [downloadimageFile,setDownLoadImageFile]= useRecoilState(downloadImageFile);
    const [saveFilter,setSaveFilter]=useRecoilState(SaveFilterAtom);
    const [imageFilterArray,setImageFilterArray]  = useRecoilState(FineTuneAtomArray);
    useEffect(()=>{
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            console.error(`Canvas element with id ${canvasId} not found`);
            return;
        }
        if (canvasClassRef.current) {
            canvasClassRef.current.clear();
        }
        if (Imagefile) {
            const image = new Image();
            const objUrl = URL.createObjectURL(Imagefile);
            image.src = objUrl;
            image.onload=()=>{
                canvasClassRef.current = new CanvasDraw(canvas,image);
                URL.revokeObjectURL(objUrl);
                canvasClassRef.current.drawImage();
            }
        }
        else{
            const image = new Image();
            image.src = '/demo.jpg';
            image.onload=()=>{
                canvasClassRef.current = new CanvasDraw(canvas,image);
                canvasClassRef.current.drawImage();
            }
        }
        return ()=>{
            if (Imagefile) {
                URL.revokeObjectURL(URL.createObjectURL(Imagefile));
            }
        }
    },[Imagefile,canvasId]);
    useEffect(()=>{
        if (canvasClassRef.current) {
            console.log('running')
            canvasClassRef.current.applyFilter(filter);
            canvasClassRef.current.applyTintColor(filter);
        }
    },[filter,canvasScreenTog]);
    useEffect(()=>{
        if (canvasClassRef.current) {
            const imageUrl = canvasClassRef.current.getdataUrl();
            const imageUrl2 = canvasClassRef.current.getDataUrl2();
            if (imageUrl) {
                downloadImage(imageUrl,`image.png`);
            }
            if (imageUrl2) {
                downloadImage(imageUrl2,`image2.png`);
            }
        }
    },[downloadimageFile,setDownLoadImageFile]);
    useEffect(()=>{
        const svg = document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);
        // console.log(svg.createSVGMatrix())
    },[]);
    useEffect(()=>{
        if (saveFilter && canvasClassRef.current) {
            const image = new Image();
            image.src = `/demo.jpg`;
            image.onload=()=>{
                const imageUrl = canvasClassRef.current!.getDataUrl3(image);
                const filterList = localStorage.getItem(`FilterArrayList`);
                if (!imageUrl) {
                    return;
                }
                if (filterList) {
                    const filterArray = JSON.parse(filterList) as ImageFilterArray[];
                    filterArray.push({imageUrl:imageUrl,...filter});
                    localStorage.setItem(`FilterArrayList`,JSON.stringify(filterArray));
                }
                else{
                    localStorage.setItem(`FilterArrayList`,JSON.stringify([{imageUrl,...filter}]));
                    setImageFilterArray(p=>[...p,{imageUrl:imageUrl,...filter}]);
                }
            }
            setSaveFilter(false);
        }
    },[saveFilter,setSaveFilter,filter,setImageFilterArray]);
    useEffect(()=>{
        const filterArray = localStorage.getItem(`FilterArrayList`);
        if (filterArray) {
            const filter = JSON.parse(filterArray) as ImageFilterArray[];
            setImageFilterArray(filter);
        }
    },[setImageFilterArray])
    return canvasClassRef.current;
}