import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export function ProfileCard() {
  return (
    <motion.div
      className="relative w-48 h-48 md:w-64 md:h-64 mb-8"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        delay: 0.2, 
        duration: 0.8, 
        type: "spring", 
        stiffness: 100 
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 10,
        rotateX: -10
      }}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-2xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Card background */}
      <motion.div
        className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 shadow-2xl overflow-hidden"
        whileHover={{
          boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3)"
        }}
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full" />
        
        {/* Profile image placeholder */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center backdrop-blur-sm">
          <User className="w-20 h-20 md:w-24 md:h-24 text-cyan-400" />
        </div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: `${20 + (i * 15)}%`,
              left: `${10 + (i * 12)}%`
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </motion.div>
    </motion.div>
  );
}
