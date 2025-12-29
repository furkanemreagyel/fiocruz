import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from './components/Timeline';
import MapOverlay from './components/MapOverlay';
import { timelineData } from './data/timelineData';

// Preload all map images for instant transitions
const preloadImages = () => {
  timelineData.forEach((era) => {
    const img = new Image();
    img.src = era.mapUrl;
  });
  // Also preload welcome image
  const welcomeImg = new Image();
  welcomeImg.src = import.meta.env.BASE_URL + 'welcome.jpg';
};

/**
 * App Component
 * 
 * Digital Archive - immersive architectural timeline.
 * Dark theme with snappy 0.6s transitions.
 * Welcome screen on first load.
 */
function App() {
  // Welcome screen state
  const [showWelcome, setShowWelcome] = useState(true);

  // Preload all images on mount
  useEffect(() => {
    preloadImages();
  }, []);

  // Extract years from timeline data
  const years = useMemo(() => timelineData.map((era) => era.year), []);
  
  // Track the currently selected year
  const [activeYear, setActiveYear] = useState(years[0]);

  // Get the current era data based on selected year
  const currentEra = useMemo(
    () => timelineData.find((era) => era.year === activeYear),
    [activeYear]
  );

  // Handle welcome screen dismiss
  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className="h-screen w-screen bg-stone-900 overflow-hidden relative">
      {/* Welcome Screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-[100] cursor-pointer bg-white flex items-center justify-center"
            onClick={dismissWelcome}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <img
              src={import.meta.env.BASE_URL + 'welcome.jpg'}
              alt="Welcome"
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Map Background */}
      <div className="absolute inset-0">
        {currentEra && (
          <MapOverlay
            mapUrl={currentEra.mapUrl}
            points={currentEra.points}
            year={currentEra.year}
          />
        )}
      </div>

      {/* Header - Bottom Right */}
      <header className="absolute bottom-0 right-0 z-40 p-8 md:p-12 text-right">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl md:text-4xl tracking-wide mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>
            Fiocruz
          </h1>
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400">
            Oswaldo Cruz Foundation
          </p>
        </motion.div>
      </header>

      {/* Timeline - Top Center (positioned by Timeline component) */}
      <Timeline
        years={years}
        activeYear={activeYear}
        onYearChange={setActiveYear}
      />

      {/* Collection indicator - Top Right */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-right"
        >
          <p className="text-stone-500 text-xs tracking-widest uppercase">
            Era
          </p>
          <p className="text-stone-400 text-lg mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {String(years.indexOf(activeYear) + 1).padStart(2, '0')} / {String(years.length).padStart(2, '0')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
