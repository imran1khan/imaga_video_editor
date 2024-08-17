import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hexToRgb(hex:string) {
  if (hex === "" || !hex) {
    return {r:0,g:0,b:0}
  }
  hex = hex.replace(/^#/, '');
  
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  return {r,g,b};
}

export function rgbaToHex(rgba:string){
  const match = rgba.match(/^rgba?\((\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
  if (!match) {
    return;
  }
  const r = parseInt(match[1],10);
  const g = parseInt(match[2],10);
  const b = parseInt(match[3],10);
  const a = match[4]?parseFloat(match[4]):1;

  const hex = '#'+(a===1?'':componentToHex(Math.round(r*a))+componentToHex(Math.round(g*a))+componentToHex(Math.round(b*a)));
  return hex;
}
function componentToHex(c:number){
  const hex=c.toString(16);
  return hex.length===1?'0'+hex:hex;
}
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout | null;
  const debouncedFunction = function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay)
  }
  debouncedFunction.cancel=()=>{
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  return debouncedFunction
}

export function downloadImage(url:string,filename:string) {
  const link = document.createElement(`a`);
  link.download = filename;
  link.href=url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function convertImageFormet(image: File, format: 'png' | 'jpeg'): Promise<string> {
  return new Promise((resolve, reject) => {
    const imageEle = document.createElement('img');
    imageEle.src = URL.createObjectURL(image);

    imageEle.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.width = imageEle.width;
      canvas.height = imageEle.height;
      
      ctx.drawImage(imageEle, 0, 0);

      const url = canvas.toDataURL(`image/${format}`);
      resolve(url);
    };

    imageEle.onerror = (err) => {
      reject(new Error('Failed to load image'));
    };
  });
}

export function RandomInt(min:number,max:number) {
  const num = Math.floor(Math.random()*(max-min))+min;
  return num;
}
