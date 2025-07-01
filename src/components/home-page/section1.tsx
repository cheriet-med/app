'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OrkenWorldScrollAnimation() {
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const fillCanvasRef = useRef<HTMLCanvasElement>(null);
  const stickySectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const bgVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const triangleStatesRef = useRef<Map<string, any>>(new Map());
  const canvasXPositionRef = useRef(0);
  
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Video sources for each card
  const videoSources = [
    '/assets/videos/ca-2.mp4',
    '/assets/videos/ca-3.mp4',
    '/assets/videos/ca-1.mp4'
  ];

  const cardData = [
    {
      title: "Dine Where Stories Begin",
      code: "Discover the world’s most unforgettable restaurants where flavors, design, and ambiance come together to create moments worth remembering.",
      
    },
    {
      title: "Stay Beyond Expectations",
      code: "Step inside extraordinary hotels that redefine comfort, luxury, and experience. These aren’t just places to ",
     
    },
    {
      title: "Taste That Travels",
      code: "From street eats to signature dishes, explore the most mouthwatering foods that bring culture, creativity, and passion to every bite.",
     
    }
  ];

  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    const updateContainerHeight = () => {
      const stickyHeight = window.innerHeight * 6; // or whatever multiplier you need
      setContainerHeight(stickyHeight);
    };
  
    // Set on mount
    updateContainerHeight();
  
    // Update on resize
    window.addEventListener('resize', updateContainerHeight);
  
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);
  





  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Canvas setup
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const stickySection = stickySectionRef.current;
    
    if (!outlineCanvas || !fillCanvas || !stickySection) return;

    const outlineCtx = outlineCanvas.getContext('2d');
    const fillCtx = fillCanvas.getContext('2d');
    
    if (!outlineCtx || !fillCtx) return;

    const triangleSize = 150;
    const lineWidth = 1;
    const SCALE_THRESHOLD = 0.01;
    const stickyHeight = window.innerHeight * 5;

    const setCanvasSize = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);

    const drawTriangle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      fillScale = 0,
      flipped = false
    ) => {
      const halfSize = triangleSize / 2;

      if (fillScale < SCALE_THRESHOLD) {
        ctx.beginPath();
        if (!flipped) {
          ctx.moveTo(x, y - halfSize);
          ctx.lineTo(x + halfSize, y + halfSize);
          ctx.lineTo(x - halfSize, y + halfSize);
        } else {
          ctx.moveTo(x, y + halfSize);
          ctx.lineTo(x + halfSize, y - halfSize);
          ctx.lineTo(x - halfSize, y - halfSize);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.075)';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      if (fillScale >= SCALE_THRESHOLD) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(fillScale, fillScale);
        ctx.translate(-x, -y);

        ctx.beginPath();
        if (!flipped) {
          ctx.moveTo(x, y - halfSize);
          ctx.lineTo(x + halfSize, y + halfSize);
          ctx.lineTo(x - halfSize, y + halfSize);
        } else {
          ctx.moveTo(x, y + halfSize);
          ctx.lineTo(x + halfSize, y - halfSize);
          ctx.lineTo(x - halfSize, y - halfSize);
        }
        ctx.closePath();
        ctx.fillStyle = '#F25C54';
        ctx.strokeStyle = '#F25C54';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      }
    };

    const drawGrid = (scrollProgress = 0) => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      if (!outlineCtx || !fillCtx) return;

      outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
      fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

      const animationProgress =
        scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;

      let needsUpdate = false;
      const animationSpeed = 0.15;

      triangleStatesRef.current.forEach((state) => {
        if (state.scale < 1) {
          const x =
            state.col * (triangleSize * 0.5) +
            triangleSize / 2 +
            canvasXPositionRef.current;
          const y = state.row * triangleSize + triangleSize / 2;
          const flipped = (state.row + state.col) % 2 !== 0;
          drawTriangle(outlineCtx, x, y, 0, flipped);
        }
      });

      triangleStatesRef.current.forEach((state) => {
        const shouldBeVisible = state.order <= animationProgress;
        const targetScale = shouldBeVisible ? 1 : 0;
        const newScale =
          state.scale + (targetScale - state.scale) * animationSpeed;

        if (Math.abs(newScale - state.scale) > 0.001) {
          state.scale = newScale;
          needsUpdate = true;
        }

        if (state.scale >= SCALE_THRESHOLD) {
          const x =
            state.col * (triangleSize * 0.5) +
            triangleSize / 2 +
            canvasXPositionRef.current;
          const y = state.row * triangleSize + triangleSize / 2;
          const flipped = (state.row + state.col) % 2 !== 0;
          drawTriangle(fillCtx, x, y, state.scale, flipped);
        }
      });

      if (needsUpdate) {
        animationFrameIdRef.current = requestAnimationFrame(() =>
          drawGrid(scrollProgress)
        );
      }
    };

    const initializeTriangles = () => {
      const cols = Math.ceil(window.innerWidth / (triangleSize * 0.5));
      const rows = Math.ceil(window.innerHeight / (triangleSize * 0.5));
      const totalTriangles = rows * cols;

      const positions: { row: number; col: number; key: string }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          positions.push({ row: r, col: c, key: `${r}-${c}` });
        }
      }

      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      const newTriangleStates = new Map();
      positions.forEach((pos, index) => {
        newTriangleStates.set(pos.key, {
          order: index / totalTriangles,
          scale: 0,
          row: pos.row,
          col: pos.col,
        });
      });
      triangleStatesRef.current = newTriangleStates;
    };

    initializeTriangles();
    drawGrid();

    const handleResize = () => {
      setCanvasSize(outlineCanvas, outlineCtx);
      setCanvasSize(fillCanvas, fillCtx);
      triangleStatesRef.current.clear();
      initializeTriangles();
      drawGrid();
    };

    window.addEventListener('resize', handleResize);

    ScrollTrigger.create({
      trigger: stickySection,
      start: 'top top',
      end: `+=${stickyHeight}px`,
      pin: true,
      onUpdate: (self) => {
        canvasXPositionRef.current = -self.progress * 200;
        drawGrid(self.progress);

        const progress = Math.min(self.progress / 0.654, 1);
        gsap.set(cardsRef.current, {
          x: -progress * window.innerWidth * 2,
        });

        // Determine which video should be active based on scroll progress
        const newActiveIndex = Math.floor(progress * cardData.length);
        const clampedIndex = Math.max(0, Math.min(newActiveIndex, cardData.length - 1));
        
        if (clampedIndex !== activeVideoIndex) {
          setActiveVideoIndex(clampedIndex);
        }
      },
    });

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeVideoIndex]);

  // Handle video switching for both card and background videos
  useEffect(() => {
    // Handle card videos
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeVideoIndex) {
          video.play().catch(() => {
            console.log('Card video autoplay failed for video', index);
          });
        } else {
          video.pause();
        }
      }
    });

    // Handle background videos
    bgVideoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeVideoIndex) {
          video.play().catch(() => {
            console.log('Background video autoplay failed for video', index);
          });
        } else {
          video.pause();
        }
      }
    });
  }, [activeVideoIndex]);

  const handleCardHover = (index: number) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };


  return (
   
<div className="w-full overflow-hidden" style={{ height: containerHeight ? `${containerHeight}px` : '100vh' }}>

      <section ref={stickySectionRef} className="sticky w-full h-screen overflow-hidden top-0">
        {/* Background Videos - one for each card */}
        <div className="bg-videos absolute top-0 left-0 w-full h-full">
          {videoSources.map((videoSrc, index) => (
            <video
              key={index}
              ref={(el) => {
                bgVideoRefs.current[index] = el;
              }}
              src={videoSrc}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                index === activeVideoIndex ? 'opacity-70' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            />
          ))}
          {/* Dark overlay for better text readability */}
          <div className="absolute top-0 left-0 w-full h-full bg-primary bg-opacity-30"></div>
        </div>

        <canvas ref={outlineCanvasRef} className="outline-layer absolute top-0 left-0 w-[150%] h-[150%] z-[1]"></canvas>

        <div
  ref={cardsRef}
  className="cards absolute top-0 left-0 w-[300%] h-screen flex  sm:flex-row justify-around items-center gap-4 sm:gap-0 will-change-transform z-[2] px-4 sm:px-8 py-4"
>
          {cardData.map((card, index) => (
            <div 
              key={index}
              className={`card relative flex flex-col gap-6 p-8 transition-all duration-500 ease-out transform cursor-pointer  rounded-xl  w-[750px] h-[700px] ${
                hoveredCard === index 
                  ?  'bg-secondary bg-opacity-80 hover:bg-opacity-60 border-2 border-transparent transition-all  duration-500 ease-out'
                  : index === activeVideoIndex ? 'bg-secondary bg-opacity-80 hover:bg-opacity-60 border-2 border-transparent transition-all  duration-500 ease-out': 'bg-primary bg-opacity-80 hover:bg-opacity-60 border-2 border-transparent transition-all  duration-500 ease-out'
              }`}
              style={{
         
                backdropFilter: hoveredCard === index ? 'blur(10px)' : 'blur(5px)',
              }}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
            >
              <div className="flex-1 overflow-hidden rounded-lg relative">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={videoSources[index]}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    index === activeVideoIndex ? 'opacity-100 brightness-110' : 'opacity-70 brightness-75'
                  } ${
                    hoveredCard === index ? 'scale-110 brightness-125' : 'scale-100'
                  }`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                 
                />
                {/* Video overlay effect on hover */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  hoveredCard === index 
                    ? 'bg-gradient-to-t from-red-600 via-transparent to-transparent opacity-50' 
                    : 'bg-transparent'
                }`}></div>
              </div>
              <div className={`flex-1 flex flex-col justify-around overflow-hidden transition-all duration-300 ${
                hoveredCard === index ? 'text-white transform translate-y-[-4px]' : 'text-white'
              }`}>
                <h1 className={`uppercase leading-none font-playfair transition-all text-3xl duration-500 ${
                  hoveredCard === index 
                    ? 'text-white transform scale-105 drop-shadow-lg text-shadow-lg' 
                    : 'text-white'
                } ${
                  index === activeVideoIndex ? 'opacity-100' : 'opacity-80'
                }`}
                style={{
                  fontSize: 'clamp(24px, 4vw, 64px)',
                }}>
                  {card.title}
                </h1>
                <p className={`font-montserrat transition-all duration-300 text-xl  ${
                  hoveredCard === index 
                    ? 'text-red-100 font-bold transform translate-x-2' 
                    : index === activeVideoIndex 
                      ? 'text-gray-100' 
                      : 'text-gray-200'
                }`}
                style={{
                  fontSize: 'clamp(12px, 1.2vw, 16px)',
                }}>
                  {card.code}
                </p>
              </div>
              
              {/* Glowing effect on active card */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                index === activeVideoIndex 
                  ? 'shadow-lg shadow-orange-500/20' 
                  : ''
              } ${
                hoveredCard === index 
                  ? 'shadow-2xl shadow-red-500/40 ring-2 ring-red-400/50' 
                  : ''
              }`}></div>
            </div>
          ))}
        </div>
        <canvas ref={fillCanvasRef} className="fill-layer absolute top-0 left-0 w-[150%] h-[150%] z-[3]"></canvas>
      </section>
    </div>
  );
}