
import { canvasScreenToggel, FineTuneAtom, FineTuneTypes } from '@/packages/store/atoms/FinetuneAtom';
import { ImageFileAtom } from '@/packages/store/atoms/ImageFileAtom';
import { ApplyFilter, ApplyTintColor, DrawImage } from '@/utils/Canvas';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

const useCanvas = (canvasId: string) => {
    const Imagefile = useRecoilValue(ImageFileAtom);
    const filter=useRecoilValue(FineTuneAtom);
    const canvasScreenTog = useRecoilValue(canvasScreenToggel);
    useEffect(() => {
        let imageUrl = ``;
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            console.error(`Canvas element with id ${canvasId} not found`);
            return;
        }
        if (!Imagefile) {
            imageUrl = "/demo.jpg";
        }
        else{
            imageUrl = URL.createObjectURL(Imagefile);
        }
        const image = new Image();
        image.src = imageUrl;
        image.onload = function () {
            if (canvasScreenTog) {
                DrawImage(canvas,image,canvasScreenTog);
            }
            else{
                DrawImage(canvas,image,canvasScreenTog)
            }
            ApplyFilter(canvas,filter);
            ApplyTintColor(canvas,filter);
        };
        image.onerror = function () {
            console.error('Error loading image');
        };
    }, [canvasId,Imagefile,filter,canvasScreenTog]);
};

export default useCanvas;
