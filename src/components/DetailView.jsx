import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * DetailView Component
 * 
 * Full-screen detail page for a selected building/landmark.
 * Clean, aesthetic typography with easy navigation back.
 */
export default function DetailView({ point, year, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-stone-900 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content container */}
      <div className="relative min-h-screen flex flex-col items-center px-8 py-16">
        {/* Back button - top left */}
        <motion.button
          onClick={onClose}
          className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-3 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div 
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'rgba(212, 175, 55, 0.1)'
            }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#D4AF37' }} />
          </div>
          <span 
            className="text-sm tracking-widest uppercase hidden md:block transition-opacity duration-300 group-hover:opacity-100 opacity-60"
            style={{ color: '#D4AF37', fontFamily: "'Inter', sans-serif" }}
          >
            Back to Map
          </span>
        </motion.button>

        {/* Main content - centered */}
        <div className="flex-1 flex items-center justify-center w-full">
          <motion.div
            className="max-w-2xl w-full text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Year badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span 
                className="inline-block px-4 py-2 text-xs tracking-[0.3em] uppercase mb-8"
                style={{ 
                  color: '#D4AF37',
                  fontFamily: "'Inter', sans-serif",
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
              >
                {year}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl text-stone-100 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {point.title}
            </motion.h1>

            {/* Architect */}
            {point.architect && (
              <motion.p
                className="text-lg md:text-xl text-stone-400 mb-8 italic"
                style={{ fontFamily: "'Playfair Display', serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {point.architect}
              </motion.p>
            )}

            {/* Decorative line */}
            <motion.div
              className="w-24 h-px mx-auto mb-10"
              style={{ backgroundColor: '#D4AF37' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-stone-300 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {point.description || point.desc}
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom back button - fixed at bottom */}
        <motion.button
          onClick={onClose}
          className="px-8 py-4 border transition-colors duration-300"
          style={{ 
            borderColor: 'rgba(212, 175, 55, 0.5)',
            color: '#D4AF37',
            fontFamily: "'Inter', sans-serif",
            marginTop: '4rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ 
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          }}
        >
          <span className="text-sm tracking-[0.2em] uppercase">
            Return to Archive
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
