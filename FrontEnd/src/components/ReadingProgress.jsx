import React, { useEffect, useState, memo } from "react";
import { useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  // Only show on blog detail pages
  if (!location.pathname.startsWith("/blogs/")) return null;

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const percent = docHeight
        ? Math.min((scrollTop / docHeight) * 100, 100)
        : 0;

      setProgress(percent);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-1 bg-transparent"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-[#FACC15] "
        style={{
          width: `${progress}%`,
          transition: reduceMotion ? "none" : "width 150ms linear",
        }}
      />
    </div>
  );
};

export default memo(ReadingProgress);
