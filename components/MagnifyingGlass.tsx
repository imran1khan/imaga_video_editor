"use client"
import React, { useRef, useState, useEffect } from 'react';

const MagnifyingGlass = () => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const imageRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    const drawMagnifier = () => {
      if (isMouseOver && ctx && image) {
        const { x, y } = mousePos;
        const magnifierSize = 100;
        const zoom = 2;

        ctx.clearRect(0, 0, canvas?.width, canvas.height);
        ctx.drawImage(
          image,
          x - magnifierSize / zoom / 2,
          y - magnifierSize / zoom / 2,
          magnifierSize / zoom,
          magnifierSize / zoom,
          x - magnifierSize / 2,
          y - magnifierSize / 2,
          magnifierSize,
          magnifierSize
        );
        ctx.beginPath();
        ctx.arc(x, y, magnifierSize / 2, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'purple';
        ctx.stroke();
        ctx.closePath();
      } else {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    drawMagnifier();
  }, [mousePos, isMouseOver]);

  const handleMouseMove = (e:React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!imageRef.current) return;
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  return (
    <div className="w-full h-full relative">
      <picture>
        <img
          ref={imageRef}
          src="https://imagecolorpicker.com/_next/static/media/imagecolorpicker.4b3123b6.png"
          alt="image"
          className="w-[500px] h-[334px]"
        />
      </picture>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 cursor-crosshair"
        width="500"
        height="334"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></canvas>
    </div>
  );
};

export default MagnifyingGlass;
