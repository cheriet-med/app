"use client";

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);

export default function CombatLanding() {
  // Single element refs
  const counterRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Array refs with proper typing
  const headerSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Initialize array refs
  useEffect(() => {
    headerSpansRef.current = headerSpansRef.current.slice(0, 2);
  }, []);

  // Properly typed ref callback
  const setHeaderSpanRef = useCallback((index: number) => (el: HTMLSpanElement | null) => {
    headerSpansRef.current[index] = el;
  }, []);

  useEffect(() => {
    const customEase = CustomEase.create("custom", ".87,0,.13,1");

    // Initial setup
    gsap.set(videoContainerRef.current, {
      scale: 0,
      rotation: -20,
    });

    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: customEase } });

    tl.to(heroRef.current, {
      clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
      duration: 1.5,
      delay: 1,
    })
    .to(heroRef.current, {
      clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
      duration: 2,
      onStart: () => {
        gsap.to(progressBarRef.current, {
          width: "100vw",
          duration: 2,
          ease: customEase,
        });

        gsap.to(counterRef.current, {
          innerHTML: 100,
          duration: 2,
          snap: { innerHTML: 1 },
        });
      },
    }, "+=1")
    .to(heroRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      onStart: () => {
        gsap.to(videoContainerRef.current, {
          scale: 1,
          rotation: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.25,
        });

        gsap.to(progressBarRef.current, {
          opacity: 0,
          duration: 0.3,
        });
      },
    }, "+=1")
    .to(headerSpansRef.current, {
      y: "0%",
      duration: 1,
      stagger: 0.125,
      ease: "power3.out",
    }, "-=0.25");

    // Correct cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative h-screen w-screen bg-secondary font-sans">
      <div 
        ref={heroRef}
        className="relative w-full h-screen bg-primary flex flex-col justify-between"
        style={{ clipPath: 'polygon(0% 45%, 0% 45%, 0% 55%, 0% 55%)' }}
      >
        <div 
          ref={progressBarRef}
          className="absolute top-1/2 left-0 w-[25vw] p-4 flex justify-between items-center text-accent"
        >
          <p className="text-sm font-semibold uppercase ">loading</p>
          <span ref={counterRef} className="text-sm font-semibold uppercase">0</span>
        </div>

        <div 
          ref={videoContainerRef}
          className="absolute top-1/2 left-1/2 w-full h-full bg-primary overflow-hidden"
          style={{ 
            transform: 'translate(-50%, -50%)',
            clipPath: 'polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)'
          }}
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover opacity-80"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center pt-64">
          <h1 className="w-full text-center uppercase text-4xl md:text-6xl custom:text-7xl leading-[0.85] tracking-[-0.25rem] text-white font-semibold font-playfair">
            <span ref={setHeaderSpanRef(0)} className="block transform translate-y-full select-none"  style={{ wordSpacing: '0.1em' }}>Rewarding diners</span>
          </h1>
          <h1 className="w-full text-center text-3xl md:text-5xl custom:text-5xl leading-[0.85] tracking-[-0.25rem] text-white font-playfair">
            <span ref={setHeaderSpanRef(1)} className="block transform translate-y-full select-none"  style={{ wordSpacing: '0.2em' }}>Empowering trusted places</span>
          </h1>
        </div>
      </div>
    </div>
  );
}