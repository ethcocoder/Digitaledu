import { useEffect, useRef } from 'react';

export default function InteractiveCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      // Update dot cursor immediately
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '0';
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('interactive')
      ) {
        if (cursorRef.current) {
          cursorRef.current.classList.add('cursor-active');
        }
        if (cursorDotRef.current) {
          cursorDotRef.current.classList.add('cursor-dot-active');
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('interactive')
      ) {
        if (cursorRef.current) {
          cursorRef.current.classList.remove('cursor-active');
        }
        if (cursorDotRef.current) {
          cursorDotRef.current.classList.remove('cursor-dot-active');
        }
      }
    };

    // Smooth cursor following animation
    const animateCursor = () => {
      cursorX.current += (mouseX.current - cursorX.current) * 0.15;
      cursorY.current += (mouseY.current - cursorY.current) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX.current}px`;
        cursorRef.current.style.top = `${cursorY.current}px`;
      }

      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    const animationId = requestAnimationFrame(animateCursor);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Outer cursor ring with glow */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-cyan-400 rounded-full pointer-events-none z-50 transition-all duration-200"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.5), inset 0 0 20px rgba(0, 217, 255, 0.2)',
          opacity: 0,
        }}
      />

      {/* Inner cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-50"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(0, 217, 255, 0.8)',
          opacity: 0,
        }}
      />

      <style>{`
        .cursor-active {
          width: 48px !important;
          height: 48px !important;
          border-color: #FFD700 !important;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.3) !important;
        }

        .cursor-dot-active {
          width: 8px !important;
          height: 8px !important;
          background-color: #FFD700 !important;
          box-shadow: 0 0 15px rgba(255, 215, 0, 1) !important;
        }

        /* Smooth transitions */
        button, a {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}
