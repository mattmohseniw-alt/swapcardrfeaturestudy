"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Slide1Title from "./Slide1Title";
import Slide2Problem from "./Slide2Problem";
import Slide3FeatureVision from "./Slide3FeatureVision";
import Slide4DeliveryPlan from "./Slide4DeliveryPlan";
import Slide5Risks from "./Slide5Risks";
import Slide6Metrics from "./Slide6Metrics";
import Slide7Closing from "./Slide7Closing";

const SLIDES = [
  Slide1Title,
  Slide2Problem,
  Slide3FeatureVision,
  Slide4DeliveryPlan,
  Slide5Risks,
  Slide6Metrics,
  Slide7Closing,
];

export default function SlideDeck() {
  const [current, setCurrent] = useState(0);
  const [navCount, setNavCount] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= SLIDES.length) return;
      setCurrent(index);
      setNavCount((n) => n + 1);
    },
    []
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const CurrentSlide = SLIDES[current];

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-950">
      {/* 16:9 slide container */}
      <div
        className="relative overflow-hidden shadow-2xl"
        style={{
          width: "min(100vw, calc(100vh * 16 / 9))",
          height: "min(100vh, calc(100vw * 9 / 16))",
        }}
      >
        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={navCount}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>

        {/* Navigation overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gradient-to-t from-black/40 to-transparent">
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-white/80 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Prev
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 20 : 8,
                    height: 8,
                    backgroundColor: i === current ? "#02C39A" : "rgba(255,255,255,0.35)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={next}
            disabled={current === SLIDES.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-white/80 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="Next slide"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Slide counter top-right */}
        <div className="absolute top-3 right-4 text-xs font-medium text-white/40 select-none">
          {current + 1} / {SLIDES.length}
        </div>
      </div>
    </div>
  );
}
