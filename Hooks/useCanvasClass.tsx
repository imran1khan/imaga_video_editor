import { downloadImage } from "@/lib/utils";
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage";
import { canvasScreenToggel, FineTuneAtom } from "@/packages/store/atoms/FinetuneAtom";
import { ImageFileAtom } from "@/packages/store/atoms/ImageFileAtom";
import { CanvasDraw } from "@/utils/CanvasClass";
import { url } from "inspector";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export const useCanvasClass=(canvasId:string)=>{
    const Imagefile = useRecoilValue(ImageFileAtom);
    const filter=useRecoilValue(FineTuneAtom);
    const canvasScreenTog = useRecoilValue(canvasScreenToggel);
    const canvasClassRef = useRef<CanvasDraw | null>(null);
    const [downloadimageFile,setDownLoadImageFile]= useRecoilState(downloadImageFile);
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
            canvasClassRef.current = new CanvasDraw(canvas);
            canvasClassRef.current.drawImage();
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
            console.log('at the end')
            console.log(imageUrl2)
        }
    },[downloadimageFile,setDownLoadImageFile]);
    useEffect(()=>{
        const svg = document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);
        console.log(svg.createSVGMatrix())
    });
    return canvasClassRef.current;
}