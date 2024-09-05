import { downloadImage, rgbaToHex } from "@/lib/utils";
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage";
import { canvasScreenToggel, FineTuneAtom, FineTuneAtomArray, FineTuneTypes, ImageFilterArray } from "@/packages/store/atoms/FinetuneAtom";
import { ImageFileListAtom } from "@/packages/store/atoms/ImageFileAtom";
import { SaveFilterAtom } from "@/packages/store/atoms/SaveFilterAtom";
import { changeAspectratio, deleteImageAtom, ScreenPopoUpAtom } from "@/packages/store/atoms/ScreenPopUpAtom";

import { ShowMenuElement } from "@/packages/store/atoms/ShowMenu";
import { TextAreaPopup, TextAreaPopup_Conent } from "@/packages/store/atoms/TextAreaPopUpAtom";
import { ColorPickerPopUpAtom, selectedColorAtom } from "@/packages/store/drawingAtom/ColorPickerAtom";
import { SquareAtom } from "@/packages/store/drawingAtom/SquareAtom";

import { CanvasDraw, curserStyle } from "@/utils/CanvasClass";
import { text } from "@/utils/Interface";

import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const useCanvasClass = (canvasId: string, interactiveCanvasId: string) => {

    const ImageElementList = useRecoilValue(ImageFileListAtom);
    const [filter, setFilter] = useRecoilState(FineTuneAtom);
    const canvasScreenTog = useRecoilValue(canvasScreenToggel);
    const canvasClassRef = useRef<CanvasDraw | null>(null);
    const [downloadimageFile, setDownLoadImageFile] = useRecoilState(downloadImageFile);
    const [saveFilter, setSaveFilter] = useRecoilState(SaveFilterAtom);
    const [imageFilterArray, setImageFilterArray] = useRecoilState(FineTuneAtomArray);
    const [canvasReady, setCanvasReady] = useState(false);

    useEffect(() => {
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
        image.onload = () => {
            canvasClassRef.current = new CanvasDraw(canvas, interactiveCanvas, image);
            canvasClassRef.current.drawCanvas();
            setCanvasReady(true);
        }
    }, [canvasId, interactiveCanvasId]);
    //set color canvas_color
    const [color, setColor] = useRecoilState(selectedColorAtom);
    const [pickerValue, setPickerValue] = useRecoilState(ColorPickerPopUpAtom);
    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        canvasClassRef.current.StaticCanvasColor = color;
        canvasClassRef.current.drawCanvas();
    }, [canvasReady, color]);

    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        if (pickerValue.display === 'none') {
            return;
        }
        const handelMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const target = e.target as HTMLElement;
            target.style.cursor = 'crosshair'
            const moveLence = 15;
            const top = Math.max(0, Math.min(clientY + moveLence, window.innerHeight - pickerValue.height));
            const left = Math.max(0, Math.min(clientX + moveLence, window.innerWidth - pickerValue.width));
            const value = canvasClassRef.current!.getStaticCanvasImageData(clientX, clientY, 1, 1);
            if (value) {
                const rgba = `rgba(${value.data[0]},${value.data[1]},${value.data[2]},${value.data[3]})`;
                let hex = rgbaToHex(rgba);
                if (!hex) {
                    hex = '#000'
                }
                setPickerValue((p) => {
                    return { ...p, top: top, left: left, color: rgba }
                });
                return;
            }
            setPickerValue((p) => {
                return { ...p, top: top, left: left }
            });
        }

        const handelMouseClick = (e: MouseEvent) => {
            setColor(pickerValue.color)
        }

        canvasClassRef.current.InteractiveCanvas.addEventListener(`mousemove`, handelMouseMove);
        canvasClassRef.current.InteractiveCanvas.addEventListener(`click`, handelMouseClick);

        return () => {
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`mousemove`, handelMouseMove);
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`click`, handelMouseClick);
        }
    }, [pickerValue, canvasReady, setPickerValue, setColor]);

    // add event listiner in interactiveCanvas && drawCanvas
    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        canvasClassRef.current.addEventListinerInterative();
        canvasClassRef.current.addEventListeners_Static();
        return () => {
            if (canvasClassRef.current) {
                canvasClassRef.current.removeEventListinerInterative();
                canvasClassRef.current.removeEventListiner_Static();
            }
        }
    }, [canvasReady]);

    //draw rectangle
    const [squareAtom, setSquareAtom] = useRecoilState(SquareAtom);
    const [textArea, setTextArea] = useRecoilState(TextAreaPopup);
    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        canvasClassRef.current.drawMode = squareAtom
        if (squareAtom==='eraser') {
            canvasClassRef.current.curseStyle=curserStyle;
        }
        else {
            canvasClassRef.current.curseStyle='default';
        }
    }, [canvasReady, squareAtom]);

    // text area setup

    const [content, setContent] = useRecoilState(TextAreaPopup_Conent);
    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        const setTextAreaClick = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            if (canvasClassRef.current?.drawMode === 'text') {
                const top = Math.max(0, Math.min(clientY, window.innerHeight - 30));// here 30 is just a rough estimate
                const left = Math.max(0, Math.min(clientX, window.innerWidth - 30));
                if (textArea.display === 'block') {
                    if (canvasClassRef.current.startText && content!=='') {
                        const startPoint = {x:textArea.left,y:textArea.top+7}
                        const rect = canvasClassRef.current.ShapeManger!.drawText(content,textArea.left,textArea.top+7);
                        if (rect) {
                            canvasClassRef.current.ShapeManger?.textContent.push({startPoint:startPoint,content:content,width:rect.totalWidth,height:rect.totalHeight});
                        }
                    }
                    setTextArea((p) => {
                        return { ...p, top, left };
                    });
                    setContent('');
                }
                else {
                    setTextArea((p) => {
                        return { ...p, top, left, display: 'block' };
                    });
                    setContent('');
                }
            }
        }

        console.log('attach');
        canvasClassRef.current.InteractiveCanvas.addEventListener('click', setTextAreaClick);

        return () => {
            console.log('removed')
            canvasClassRef.current?.InteractiveCanvas.removeEventListener('click', setTextAreaClick);
        }
    }, [canvasReady, setContent, setTextArea, textArea.display,textArea.top,textArea.left,content]);

    useEffect(()=>{
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        let editText=false;
        let i:number|null=null;
        let textContent2:text|null=null;
        const changeText=(e:MouseEvent)=>{
            const {clientX,clientY}=e;
            const index = canvasClassRef.current!.ShapeManger!.isPointOntheText({x:clientX,y:clientY});
            if (index!==null) {
                textContent2 = canvasClassRef.current!.ShapeManger!.textContent[index];

                canvasClassRef.current!.ShapeManger!.textContent.splice(index,1);

                canvasClassRef.current!.drawCanvas();
                canvasClassRef.current!.ShapeManger?.drawCustomShape();
                canvasClassRef.current!.ShapeManger?.drawShapes();
                canvasClassRef.current!.ShapeManger?.drawAlltextContent();
                const textArea = document.getElementById('textarea1001') as HTMLTextAreaElement;
                //setting the right width and height
                const leftWidth = window.innerWidth-textContent2.startPoint.x;
                const leftHeight = window.innerHeight-textContent2.startPoint.y;
                const minNew_Width = Math.min(leftWidth,textContent2.width);
                const minNew_height = Math.min(leftHeight,textContent2.height);

                textArea.style.width=minNew_Width+'px';

                textArea.style.height=minNew_height+'px';
                // textArea.style.border = '1px solid pink';
                // textArea.style.padding = '5px';
                textArea.value=textContent2.content
                textArea.style.top=textContent2.startPoint.y+'px'
                textArea.style.left=textContent2.startPoint.x+'px'
                textArea.style.display='block'
                editText=true;
                i=index;
            }
            else if (editText && i!==null && textContent2) {
                const textArea = document.getElementById('textarea1001') as HTMLTextAreaElement;
                if (textArea.value!=='') {
                    textContent2.content=textArea.value;

                    const rect = canvasClassRef.current!.ShapeManger!.drawText(textContent2.content,textContent2.startPoint.x,textContent2.startPoint.y);
                    textContent2.width=rect!.totalWidth;
                    textContent2.height=rect!.totalHeight;
                    canvasClassRef.current!.ShapeManger!.textContent.push(textContent2);
                    // canvasClassRef.current!.clear();
                    canvasClassRef.current!.drawCanvas();
                    canvasClassRef.current!.ShapeManger?.drawCustomShape();
                    canvasClassRef.current!.ShapeManger?.drawShapes();
                    canvasClassRef.current!.ShapeManger?.drawAlltextContent();
                    editText=false;
                }
                else {
                    canvasClassRef.current!.ShapeManger!.textContent.splice(i,1);
                }
                textArea.style.display='none'
            }
        }
        console.log('attach2');
        canvasClassRef.current!.InteractiveCanvas.addEventListener('dblclick',changeText);
        return () => {
            console.log('removed2')
            canvasClassRef.current?.InteractiveCanvas.removeEventListener('dblclick',changeText);
        }
    },[canvasReady]);

    useEffect(()=>{
        if (squareAtom === 'none' && textArea.display==='block'){
            setTextArea((p)=>{
                return {...p,display:'none'};
            });
            setContent('');
            // const textArea = document.getElementById('textarea1001') as HTMLTextAreaElement;
            // textArea.value='';
            // textArea.style.display='none'
        }
    },[squareAtom])

    //
    useEffect(() => {
        if (canvasClassRef.current) {
            canvasClassRef.current.applyFilter(filter);
            canvasClassRef.current.applyTintColor(filter);
        }
    }, [filter, canvasScreenTog]);

    useEffect(() => {
        if (canvasClassRef.current && downloadimageFile) {
            const imageUrl = canvasClassRef.current.getDataUrl();
            const filename = 'download';
            const type = 'png';
            if (imageUrl) {
                downloadImage(imageUrl, `${filename}.${type}`);
            }
            setDownLoadImageFile(false);
        }
    }, [downloadimageFile, setDownLoadImageFile]);

    useEffect(() => {
        if (saveFilter && canvasClassRef.current) {
            const image = new Image();
            image.src = `/demo.jpg`;
            image.onload = () => {
                const imageUrl = canvasClassRef.current!.getDataUrl3(image);
                const filterList = localStorage.getItem(`FilterArrayList`);
                if (!imageUrl) {
                    return;
                }
                if (filterList) {
                    const filterArray = JSON.parse(filterList) as ImageFilterArray[];
                    filterArray.push({ imageUrl: imageUrl, ...filter });
                    localStorage.setItem(`FilterArrayList`, JSON.stringify(filterArray));
                }
                else {
                    localStorage.setItem(`FilterArrayList`, JSON.stringify([{ imageUrl, ...filter }]));
                    setImageFilterArray(p => [...p, { imageUrl: imageUrl, ...filter }]);
                }
            }
            setSaveFilter(false);
        }
    }, [saveFilter, setSaveFilter, filter, setImageFilterArray]);

    useEffect(() => {
        const filterArray = localStorage.getItem(`FilterArrayList`);
        if (filterArray) {
            const filter = JSON.parse(filterArray) as ImageFilterArray[];
            setImageFilterArray(filter);
        }
    }, [setImageFilterArray])

    // show menu
    const setShowMenu = useSetRecoilState(ShowMenuElement);
    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        const handleMouseEvent = (e: MouseEvent) => {
            const mousePos = canvasClassRef.current?.getMousePostion2(e).InteractiveCanvas;
            if (!mousePos) {
                return;
            }
            const imagePosition = canvasClassRef.current?.IsMouseOverImage(mousePos.x, mousePos.y);
            if (imagePosition?.px && imagePosition.py && imagePosition.index !== null) {
                const filter = canvasClassRef.current?.imageEffectObj[imagePosition.index].imageEffectObj.filterValue();
                if (filter) {
                    setFilter(filter);
                }
                else {
                    setFilter({
                        brightness: 100,
                        saturate: 100,
                        opacity: 100,
                        blur: 0,
                        contrast: 100,
                        grayscale: 0,
                        sepia: 0,
                        hue_rotate: 0,
                        invert: 0,
                        color: ``
                    });
                }
                setShowMenu((p) => ({ ...p, imageMenu: false }));
            }
            else {
                setShowMenu((p) => ({ ...p, imageMenu: true }));
            }
        };
        canvasClassRef.current?.InteractiveCanvas.addEventListener(`mousedown`, handleMouseEvent);

        return () => {
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`mousedown`, handleMouseEvent);
        };
    }, [canvasReady, setShowMenu, setFilter]);

    useEffect(() => {
        if (!canvasReady) {
            return;
        }
        if (ImageElementList && ImageElementList.length > 0) {
            canvasClassRef.current?.addImage(ImageElementList[0]);
            canvasClassRef.current?.drawCanvas();
        }
    }, [canvasReady, ImageElementList]);

    // show screen popup/ when right click on the image
    const [ImageOptionPopUp, setImageOptionPopUp] = useRecoilState(ScreenPopoUpAtom);

    useEffect(() => {
        if (!canvasReady || !canvasClassRef.current) {
            return;
        }
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const { clientX, clientY } = e;
            const imagePosition = canvasClassRef.current?.IsMouseOverImage(clientX, clientY);
            if (imagePosition?.px && imagePosition.py && imagePosition.index !== null) {
                const top = Math.max(0, Math.min(clientY, window.innerHeight - ImageOptionPopUp.height));
                const left = Math.max(0, Math.min(clientX, window.innerWidth - ImageOptionPopUp.width));
                setImageOptionPopUp((p) => {
                    return { ...p, display: `block`, top: top, left: left }
                })
            }
            else {
                setImageOptionPopUp((p) => {
                    return { ...p, display: `none` }
                })
            }
        };
        const hideMenu = (e: MouseEvent) => {
            if (ImageOptionPopUp.display === `block`) {
                setImageOptionPopUp((p) => {
                    return { ...p, display: `none` }
                })
            }
        }
        canvasClassRef.current.InteractiveCanvas.addEventListener(`contextmenu`, handleContextMenu);
        canvasClassRef.current.InteractiveCanvas.addEventListener(`mousedown`, hideMenu);

        return () => {
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`contextmenu`, handleContextMenu);
            canvasClassRef.current?.InteractiveCanvas.removeEventListener(`mousedown`, hideMenu);
        };
    }, [canvasReady, ImageOptionPopUp, setImageOptionPopUp]);

    const [deleteImage, setDeleteImage] = useRecoilState(deleteImageAtom);
    const [changeAspect, setChangeAspect] = useRecoilState(changeAspectratio);
    useEffect(() => {
        if (!canvasClassRef.current) {
            return;
        }
        if (deleteImage) {
            canvasClassRef.current?.deleteImage();
            setDeleteImage(false);
        }
        if (changeAspect) {
            canvasClassRef.current.changeAspect = true;
        }
        else {
            canvasClassRef.current.changeAspect = false;
        }
    }, [deleteImage, setDeleteImage, changeAspect]);
    return canvasClassRef.current;
}