'use client';

import { useEffect, useRef, useState } from 'react';
import { CHAR_GIFS } from '@/data/charGifs';

const GIF_SIZE = 100;

export default function FloatingGif() {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (CHAR_GIFS.length === 0) return;

    const gif = CHAR_GIFS[Math.floor(Math.random() * CHAR_GIFS.length)];
    setSrc(gif);

    // Use parent element dimensions for consistent coordinate system
    const parent = ref.current?.parentElement;
    const parentW = parent ? parent.scrollWidth : window.innerWidth;
    const parentH = parent ? parent.scrollHeight : window.innerHeight;

    setPos({
      top: Math.floor(Math.random() * (parentH - GIF_SIZE - 40)) + 20,
      left: Math.floor(Math.random() * (parentW - GIF_SIZE - 40)) + 20,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      const rect = el.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const parent = el.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      setPos({
        left: e.clientX - parentRect.left - offset.current.x,
        top: e.clientY - parentRect.top + parent.scrollTop - offset.current.y,
      });
    };


    // 移除 onClick，改用 onMouseUp 判斷是否為點擊
    const CLICK_THRESHOLD = 5; // px
    const onMouseUp = (e: MouseEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      if (mouseDownPos.current) {
        const dx = e.clientX - mouseDownPos.current.x;
        const dy = e.clientY - mouseDownPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CLICK_THRESHOLD) {
          // 真正的點擊
          e.preventDefault();
          const currentIndex = CHAR_GIFS.indexOf(src!);
          const nextIndex = (currentIndex + 1) % CHAR_GIFS.length;
          setSrc(CHAR_GIFS[nextIndex]);
        }
      }
      mouseDownPos.current = null;
    };


    el.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    // 不再需要 click 事件
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [src]);

  if (!src) return null;

  return (
    <div
      ref={ref}
      className="floating-gif"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="character" width={GIF_SIZE} />
    </div>
  );
}
