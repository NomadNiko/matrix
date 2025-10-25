'use client';

import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvas2 = canvas2Ref.current;

    if (!canvas || !canvas2) return;

    const ctx = canvas.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    if (!ctx || !ctx2) return;

    // full screen dimensions
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    const maxCharCount = 100;
    const fallingCharArr: Point[] = [];
    const fontSize = 10;
    const maxColums = cw / fontSize;

    canvas.width = canvas2.width = cw;
    canvas.height = canvas2.height = ch;

    function randomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    function randomFloat(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    class Point {
      x: number;
      y: number;
      value: string;
      speed: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.value = '';
        this.speed = randomFloat(1, 5);
      }

      draw(ctx: CanvasRenderingContext2D, ctx2: CanvasRenderingContext2D) {
        this.value = charArr[randomInt(0, charArr.length - 1)].toUpperCase();

        ctx2.fillStyle = "rgba(255,255,255,0.8)";
        ctx2.font = fontSize + "px san-serif";
        ctx2.fillText(this.value, this.x, this.y);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px san-serif";
        ctx.fillText(this.value, this.x, this.y);

        this.y += this.speed;
        if (this.y > ch) {
          this.y = randomFloat(-ch, -100);
          this.speed = randomFloat(1, 5);
        }
      }
    }

    for (let i = 0; i < maxColums; i++) {
      fallingCharArr.push(new Point(i * fontSize, randomFloat(-ch * 2, ch)));
    }

    let animationFrameId: number;

    const update = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, cw, ch);

      ctx2.clearRect(0, 0, cw, ch);

      let i = fallingCharArr.length;

      while (i--) {
        fallingCharArr[i].draw(ctx, ctx2);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="canvas" />
      <canvas ref={canvas2Ref} id="canvas2" />
    </>
  );
}
