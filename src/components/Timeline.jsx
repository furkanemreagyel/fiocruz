import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/**
 * Timeline Component - Unified Glass Deck with Drag Slider
 * 
 * A single floating glass pill containing:
 * - Big active year display (top)
 * - Horizontal draggable slider track (bottom)
 */
export default function Timeline({ years, activeYear, onYearChange }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPercent, setDragPercent] = useState(null);
  
  const activeIndex = years.indexOf(activeYear);
  const snapPercent = years.length > 1 
    ? (activeIndex / (years.length - 1)) * 100 
    : 0;
  
  const displayPercent = isDragging && dragPercent !== null ? dragPercent : snapPercent;

  const getPercentFromEvent = (e) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.type?.includes('touch') ? e.touches[0].clientX : e.clientX;
    // Account for 16px inset on each side (left-4 = 16px)
    const inset = 16;
    const trackWidth = rect.width - (inset * 2);
    const x = clientX - rect.left - inset;
    return Math.max(0, Math.min(100, (x / trackWidth) * 100));
  };

  const handleTrackClick = (e) => {
    if (isDragging) return;
    const percent = getPercentFromEvent(e);
    const newIndex = Math.round((percent / 100) * (years.length - 1));
    onYearChange(years[newIndex]);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragPercent(getPercentFromEvent(e));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const percent = getPercentFromEvent(e);
      setDragPercent(percent);
    };

    const handleUp = () => {
      if (dragPercent !== null) {
        const newIndex = Math.round((dragPercent / 100) * (years.length - 1));
        const clampedIndex = Math.max(0, Math.min(years.length - 1, newIndex));
        onYearChange(years[clampedIndex]);
      }
      setIsDragging(false);
      setDragPercent(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, dragPercent, years, onYearChange]);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[400px] max-w-[70vw]">
      {/* Single Glass Pill Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl py-4 px-6">
        {/* Track Container */}
        <div 
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onClick={handleTrackClick}
          className="relative h-8 cursor-pointer flex items-center"
        >
          {/* Track Line */}
          <div className="absolute left-4 right-4 h-[2px] bg-white/20 rounded-full" />
          
          {/* Progress Fill */}
          <motion.div
            className="absolute left-4 h-[2px] bg-white/50 rounded-full"
            style={{ width: `calc((100% - 32px) * ${displayPercent / 100})` }}
            transition={isDragging ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          />
          
          {/* Year Dots */}
          {years.map((year, index) => {
            const dotPercent = (index / (years.length - 1)) * 100;
            const isActive = year === activeYear;
            return (
              <div
                key={year}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `calc(16px + (100% - 32px) * ${dotPercent / 100})` }}
              >
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-white scale-150' : 'bg-white/30'
                  }`}
                />
              </div>
            );
          })}
          
          {/* Draggable Handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            animate={{ 
              left: `calc(16px + (100% - 32px) * ${displayPercent / 100})`,
              scale: isDragging ? 1.2 : 1
            }}
            transition={isDragging ? { duration: 0, scale: { duration: 0.15 } } : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], scale: { duration: 0.15 } }}
          >
            <div 
              className={`w-5 h-5 rounded-full bg-white shadow-lg transition-shadow duration-200 ${
                isDragging ? 'shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'shadow-[0_0_10px_rgba(255,255,255,0.3)]'
              }`}
            />
          </motion.div>
        </div>
        
        {/* Year Labels */}
        <div className="relative h-6 mt-2">
          {years.map((year, index) => {
            const labelPercent = (index / (years.length - 1)) * 100;
            const isActive = year === activeYear;
            return (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                className={`absolute -translate-x-1/2 text-xs font-medium transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  left: `calc(16px + (100% - 32px) * ${labelPercent / 100})`
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
