// import { ImageFileAtom } from '@/packages/store/atoms/ImageFileAtom';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Button } from '../ui/button';
import { convertImageFormet, downloadImage } from '@/lib/utils';

interface Prop {
  title: string;
  convertionType: 'jpeg' | 'png';
}

function ChangeFormet({ title, convertionType }: Prop) {
  // const imageFile = useRecoilValue(ImageFileAtom);

  const fileDownload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // if (!imageFile) {
    //   return;
    // }
    // const filename = imageFile.name.split('.')[0];
    // const url = await convertImageFormet(imageFile,convertionType);
    const filename='';
    const url = ''
    downloadImage(url,filename+`.${convertionType==='jpeg'?'jpg':'png'}`)
  };

  return (
    <Button onClick={fileDownload} variant="default">{title}</Button>
  );
}

export default ChangeFormet;
