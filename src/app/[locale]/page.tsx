
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TOTAL_FRAMES = 800;
const frameUrls = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/world/frame-${String(i + 1).padStart(4, '0')}.webp`
);

const TEXT_SECTIONS = [
  { start: 0, end: 0.2, position: 'left', title: "BUILDING TRUST, ONE VERIFIED REVIEW AT A TIME", content: [] },
  { start: 0.2, end: 0.25, position: 'center', title: "HOW TRUSTDINE WORKS", content: [] },
  { start: 0.25, end: 0.3, position: 'left', title: "BOOK & DINE", content: ["Reserve a table through our platform or dine at any partner restaurant. Every meal is an opportunity to build trust."] },
  { start: 0.3, end: 0.35, position: 'right', title: "UPLOAD RECEIPT", content: ["Take a photo of your receipt after dining. Our AI instantly verifies the restaurant, date, and amount to ensure authenticity."] },
  { start: 0.35, end: 0.4, position: 'center', title: "WRITE REVIEW", content: ["Share your honest experience. Only verified diners can review, ensuring every opinion is genuine and valuable."] },
  { start: 0.4, end: 0.45, position: 'left', title: "EARN TRUST POINTS", content: ["Build your trust score with verified reviews and completed bookings. Higher trust means better booking priority and exclusive perks."] },
];

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedFramesRef = useRef(0);
  const [isClient, setIsClient] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const frameIndexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => setIsClient(true), []);

  // Preload all frames
  useEffect(() => {
    if (!isClient) return;
    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedFramesRef.current++;
        framesRef.current[index] = img;
      };
    });
  }, [isClient]);

  // Draw a specific frame
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = framesRef.current[frameIndex];

    if (!canvas || !ctx || !img) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imgAspect = img.width / img.height;
    const screenAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    if (imgAspect > screenAspect) {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Auto-play animation loop
  useEffect(() => {
    if (!isClient || hasScrolled || loadedFramesRef.current < TOTAL_FRAMES) return;

    let lastTime = performance.now();
    const fps = 12;
    const interval = 1000 / fps;

    const autoPlay = (time: number) => {
      if (hasScrolled) return;

      const delta = time - lastTime;
      if (delta >= interval) {
        lastTime = time;
        drawFrame(frameIndexRef.current);
        if (frameIndexRef.current < TOTAL_FRAMES - 1) {
          frameIndexRef.current++;
        }
      }

      animationFrameRef.current = requestAnimationFrame(autoPlay);
    };

    animationFrameRef.current = requestAnimationFrame(autoPlay);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isClient, hasScrolled]);

  // Scroll-based frame control
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      if (!hasScrolled) setHasScrolled(true);
      if (loadedFramesRef.current < TOTAL_FRAMES) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { top, height } = container.getBoundingClientRect();
      const scrollY = window.scrollY;
      const containerStart = scrollY + top - window.innerHeight;
      const containerEnd = containerStart + height + window.innerHeight;
      const scrollPercent = (scrollY - containerStart) / (containerEnd - containerStart);

      const clamped = Math.min(1, Math.max(0, scrollPercent));
      setScrollProgress(clamped);

      const frameIndex = Math.floor(clamped * (TOTAL_FRAMES - 1));
      frameIndexRef.current = frameIndex;
      drawFrame(frameIndex);

      const sectionIndex = TEXT_SECTIONS.findIndex(
        section => clamped >= section.start && clamped < section.end
      );
      if (sectionIndex !== -1 && sectionIndex !== activeSection) {
        setActiveSection(sectionIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // draw on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient, hasScrolled, activeSection]);

  const currentSection = TEXT_SECTIONS[activeSection];

  return (
    <div className="h-[900vh]" ref={containerRef}>
      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

        {/* Text Overlay */}
        <div className={`absolute inset-0 mx-72 flex items-center ${currentSection.position === 'center' ? 'justify-center' : currentSection.position === 'right' ? 'justify-end' : 'justify-start'} pointer-events-none p-8`}>
          <div className={`max-w-2xl ${currentSection.position === 'center' ? 'text-center mx-auto' : currentSection.position === 'right' ? 'text-right ml-auto' : 'text-left mr-auto'}`}>
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={`title-${activeSection}`}
            >
              {currentSection.title}
            </motion.h1>
            <div className="space-y-4">
              {currentSection.content.map((line, i) => (
                <motion.p
                  key={i}
                  className="text-xl md:text-2xl text-white drop-shadow-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        {/* Bubbles */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
          {TEXT_SECTIONS.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${scrollProgress >= TEXT_SECTIONS[i].start && scrollProgress < TEXT_SECTIONS[i].end ? 'bg-white' : 'bg-white/30'}`}
              animate={{
                scale: scrollProgress >= TEXT_SECTIONS[i].start && scrollProgress < TEXT_SECTIONS[i].end ? [1, 1.2, 1] : 1,
                opacity: scrollProgress >= TEXT_SECTIONS[i].start && scrollProgress < TEXT_SECTIONS[i].end ? 1 : 0.3,
              }}
              transition={{ scale: { duration: 0.5, repeat: Infinity }, opacity: { duration: 0.3 } }}
            />
          ))}
        </div>

        {/* Scroll Icon */}
        <motion.div
          className="absolute bottom-32 right-9 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0], opacity: scrollProgress > 0.95 ? 0 : 1 }}
          transition={{ y: { duration: 1.5, repeat: Infinity }, opacity: { duration: 0.3 } }}
        >
          <p className="text-white/80 text-sm mb-2">Scroll</p>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-white rounded-full mt-1"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}


