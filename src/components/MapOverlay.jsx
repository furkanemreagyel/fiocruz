import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import DetailView from './DetailView';

/**
 * MapOverlay Component
 * 
 * Full-screen archival map with paper-pin style markers.
 * Clicking a marker opens a full-screen detail view.
 */
export default function MapOverlay({ mapUrl, points, year }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Snappy cross-fade for maps (0.6s)
  const mapVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { duration: 0.6, ease: 'easeInOut' } 
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.6, ease: 'easeInOut' } 
    },
  };

  // Spring animation for hotspots
  const dotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.4 + i * 0.1,
      },
    }),
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-stone-950">
      {/* Map Image with Archival Filter */}
      <AnimatePresence mode="wait">
        <motion.div
          key={year}
          className="absolute inset-0"
          variants={mapVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img
            src={mapUrl}
            alt={`Historical map from ${year}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80';
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Paper Pin Markers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`points-${year}`}
          className="absolute inset-0 z-30"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {points.map((point, index) => (
            <motion.button
              key={`${year}-${index}`}
              className="absolute group cursor-pointer"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              variants={dotVariants}
              custom={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedPoint(point)}
            >
              {/* Gold ping ring - centered */}
              <span 
                className="absolute inset-0 flex items-center justify-center"
              >
                <span 
                  className="w-6 h-6 rounded-full animate-ping" 
                  style={{ animationDuration: '2s', backgroundColor: 'rgba(212, 175, 55, 0.3)' }} 
                />
              </span>
              
              {/* White circle marker - centered */}
              <span className="relative flex items-center justify-center w-3 h-3">
                <span className="w-3 h-3 rounded-full bg-white shadow-lg" />
              </span>

              {/* Tooltip */}
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-stone-950/90 text-stone-200 text-xs tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                {point.title}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Full-screen Detail View */}
      <AnimatePresence>
        {selectedPoint && (
          <DetailView 
            point={selectedPoint} 
            year={year} 
            onClose={() => setSelectedPoint(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
