import { downloadImage, rgbaToHex } from "@/lib/utils";
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage";
import { canvasScreenToggel, FineTuneAtom, FineTuneAtomArray, FineTuneTypes, ImageFilterArray } from "@/packages/store/atoms/FinetuneAtom";
import { ImageFileListAtom } from "@/packages/store/atoms/ImageFileAtom";
import { SaveFilterAtom } from "@/packages/store/atoms/SaveFilterAtom";
import { changeAspectratio, deleteImageAtom, ScreenPopoUpAtom } from "@/packages/store/atoms/ScreenPopUpAtom";

import { ShowMenuElement } from "@/packages/store/atoms/ShowMenu";
import { ColorPickerPopUpAtom, selectedColorAtom } from "@/packages/store/drawingAtom/ColorPickerAtom";
import { SquareAtom } from "@/packages/store/drawingAtom/SquareAtom";

import { CanvasDraw } from "@/utils/CanvasClass";

import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const useCanvasClass=(canvasId:string,interactiveCanvasId:string)=>{

    const ImageElementList=useRecoilValue(ImageFileListAtom);
    const [filter,setFilter]=useRecoilState(FineTuneAtom);
    const canvasScreenTog = useRecoilValue(canvasScreenToggel);
    const canvasClassRef = useRef<CanvasDraw | null>(null);
    const [downloadimageFile,setDownLoadImageFile]= useRecoilState(downloadImageFile);
    const [saveFilter,setSaveFilter]=useRecoilState(SaveFilterAtom);
    const [imageFilterArray,setImageFilterArray]  = useRecoilState(FineTuneAtomArray);
    const [canvasReady,setCanvasReady]=useState(false);
    
    useEffect(()=>{
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        const interactiveCanvas = document.getElementById(interactiveCanvasId) as HTMLCanvasElement;
        if (!canvas || !interactiveCanvas) {
            console.error(`Canvas element with id ${canvasId} and ${interactiveCanvasId} not found`);
            return;
        }
        if (canvasClassRef.current) {
            canvasClassRef.current.clear();
        }
        const image = new Image();
        image.src = '/demo.jpg';
        image.onload=()=>{
            canvasClassRef.current = new CanvasDraw(canvas,interactiveCanvas,image);
            canvasClassRef.current.drawCanvas();
            setCanvasReady(true);
        }
    },[canvasId,interactiveCanvasId]);
    //set color canvas_color
    const [color,setColor] = useRecoilState(selectedColorAtom);
    const [pickerValue,setPickerValue]=useRecoilState(ColorPickerPopUpAtom);
    useEffect(()=>{
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        canvasClassRef.current.StaticCanvasColor = color;
        canvasClassRef.current.drawCanvas();
    },[canvasReady,color]);

    useEffect(()=>{
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        if (pickerValue.display === 'none') {
            return;
        }
        const handelMouseMove=(e:MouseEvent)=>{
            const {clientX,clientY}=e
            const target = e.target as HTMLElement;
            target.style.cursor = 'crosshair'
            const moveLence = 15;
            const top = Math.max(0,Math.min(clientY+moveLence,window.innerHeight-pickerValue.height));
            const left = Math.max(0,Math.min(clientX+moveLence,window.innerWidth-pickerValue.width));
            const value = canvasClassRef.current!.getStaticCanvasImageData(clientX,clientY,1,1);
            if (value) {    
                const rgba = `rgba(${value.data[0]},${value.data[1]},${value.data[2]},${value.data[3]})`;
                let hex = rgbaToHex(rgba);
                if (!hex) {
                    hex='#000'
                }
                setPickerValue((p)=>{
                    return {...p,top:top,left:left,color:rgba}
                });
                return;
            }
            setPickerValue((p)=>{
                return {...p,top:top,left:left}
            });
        }

        const handelMouseClick=(e:MouseEvent)=>{
            setColor(pickerValue.color)
        }

        canvasClassRef.current.InteractiveCanvas.addEventListener(`mousemove`,handelMouseMove);
        canvasClassRef.current.InteractiveCanvas.addEventListener(`click`,handelMouseClick);

        return ()=>{
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`mousemove`,handelMouseMove);
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`click`,handelMouseClick);
        }
    },[pickerValue,canvasReady,setPickerValue,setColor]);

    // add event listiner in interactiveCanvas && drawCanvas
    useEffect(()=>{
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        canvasClassRef.current.addEventListinerInterative();
        canvasClassRef.current.addEventListeners_Static();
        return ()=>{
            if (canvasClassRef.current) {
                canvasClassRef.current.removeEventListinerInterative();
                canvasClassRef.current.removeEventListiner_Static();
            }
        }
    },[canvasReady]);
    
    //draw rectangle
    const [squareAtom,setSquareAtom]=useRecoilState(SquareAtom);
    useEffect(()=>{
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        canvasClassRef.current.drawMode = squareAtom
    },[canvasReady,squareAtom]);

    useEffect(()=>{
        if (canvasClassRef.current) {
            canvasClassRef.current.applyFilter(filter);
            canvasClassRef.current.applyTintColor(filter);
        }
    },[filter,canvasScreenTog]);

    useEffect(()=>{
        if (canvasClassRef.current && downloadimageFile) {
            const imageUrl = canvasClassRef.current.getDataUrl();
            const filename = 'download';
            const type = 'png';
            if (imageUrl) {
                downloadImage(imageUrl,`${filename}.${type}`);
            }
            setDownLoadImageFile(false);
        }
    },[downloadimageFile,setDownLoadImageFile]);

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

    // show menu
    const setShowMenu = useSetRecoilState(ShowMenuElement);
    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        const handleMouseEvent = (e:MouseEvent) => {
            const mousePos = canvasClassRef.current?.getMousePostion2(e).InteractiveCanvas;
            if (!mousePos) {
                return;
            }
            const imagePosition=canvasClassRef.current?.IsMouseOverImage(mousePos.x, mousePos.y);
            if (imagePosition?.px && imagePosition.py && imagePosition.index!==null) {
                const filter = canvasClassRef.current?.imageEffectObj[imagePosition.index].imageEffectObj.filterValue();
                if (filter) {
                    setFilter(filter);
                }
                else{
                    setFilter({
                        brightness: 100,
                        saturate: 100,
                        opacity : 100,
                        blur : 0,
                        contrast: 100,
                        grayscale: 0, 
                        sepia: 0,
                        hue_rotate : 0,
                        invert : 0,
                        color: ``
                    });
                }
                setShowMenu((p) => ({ ...p, imageMenu: false }));
            }
            else{
                setShowMenu((p) => ({ ...p, imageMenu: true }));
            }
        };
        canvasClassRef.current?.InteractiveCanvas.addEventListener(`mousedown`,handleMouseEvent);
        
        return () => {
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`mousedown`,handleMouseEvent);
        };
    },[canvasReady,setShowMenu,setFilter]);

    useEffect(()=>{
        if (!canvasReady) {
            return;
        }
        if (ImageElementList && ImageElementList.length>0) {
            canvasClassRef.current?.addImage(ImageElementList[0]);
            canvasClassRef.current?.drawCanvas();
        }
    },[canvasReady,ImageElementList]);

    // show screen popup/ when right click on the image
    const [ImageOptionPopUp,setImageOptionPopUp]=useRecoilState(ScreenPopoUpAtom);

    useEffect(()=>{
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        const handleContextMenu = (e:MouseEvent) => {
            e.preventDefault();
            const {clientX,clientY}=e;
            const imagePosition=canvasClassRef.current?.IsMouseOverImage(clientX,clientY);
            if (imagePosition?.px && imagePosition.py && imagePosition.index!==null) {
                const top = Math.max(0,Math.min(clientY,window.innerHeight-ImageOptionPopUp.height));
                const left = Math.max(0,Math.min(clientX,window.innerWidth-ImageOptionPopUp.width));
                setImageOptionPopUp((p)=>{
                    return {...p,display:`block`,top:top,left:left}
                })
            }
            else{
                setImageOptionPopUp((p)=>{
                    return {...p,display:`none`}
                })
            }
        };
        const hideMenu=(e:MouseEvent)=>{
            if (ImageOptionPopUp.display===`block`) {                
                setImageOptionPopUp((p)=>{
                    return {...p,display:`none`}
                })
            }
        }
        canvasClassRef.current.InteractiveCanvas.addEventListener(`contextmenu`,handleContextMenu);
        canvasClassRef.current.InteractiveCanvas.addEventListener(`mousedown`,hideMenu);
        
        return () => {
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`contextmenu`,handleContextMenu);
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`mousedown`,hideMenu);
        };
    },[canvasReady,ImageOptionPopUp,setImageOptionPopUp]);

    const [deleteImage,setDeleteImage]=useRecoilState(deleteImageAtom);
    const [changeAspect,setChangeAspect]=useRecoilState(changeAspectratio);
    useEffect(()=>{
        if (!canvasClassRef.current) {
            return;
        }
        if (deleteImage) {
            canvasClassRef.current?.deleteImage();
            setDeleteImage(false);
        }
        if (changeAspect) {
            canvasClassRef.current.changeAspect=true;
        }
        else{
            canvasClassRef.current.changeAspect=false;
        }
    },[deleteImage,setDeleteImage,changeAspect]);
    return canvasClassRef.current;
}