'use client';

import { useEffect, useRef, useState } from 'react';
import { CHAR_GIFS } from '@/data/charGifs';

export default function FloatingGif() {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (CHAR_GIFS.length === 0) return;

    // Pick a random GIF
    const gif = CHAR_GIFS[Math.floor(Math.random() * CHAR_GIFS.length)];
    setSrc(gif);

    // Pick a random position within the full page height
    const pageH = document.documentElement.scrollHeight;
    const pageW = document.documentElement.scrollWidth;
    const gifW = 100;
    const gifH = 100;
    setPos({
      top: Math.floor(Math.random() * (pageH - gifH - 40)) + 20,
      left: Math.floor(Math.random() * (pageW - gifW - 40)) + 20,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      offset.current = {
        x: e.clientX - el.getBoundingClientRect().left,
        y: e.clientY - el.getBoundingClientRect().top,
      };
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      setPos({
        left: e.clientX - rect.left - offset.current.x,
        top: e.clientY - rect.top + parent.scrollTop - offset.current.y,
      });
    };

    const onMouseUp = () => { dragging.current = false; };

    el.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
      <img src={src} alt="character" />
    </div>
  );
}
