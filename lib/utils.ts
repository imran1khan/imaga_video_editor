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