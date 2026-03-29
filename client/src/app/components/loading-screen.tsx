import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-background z-50 flex items-center justify-center"
        >
          <div className="relative">
            {/* Animated background circles */}
            <motion.div
              className="absolute inset-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
              animate={{
                scale: [1.5, 1, 1.5],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main logo container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 100 
              }}
              className="relative w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-1 shadow-2xl shadow-cyan-500/25"
            >
              <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                <Terminal className="w-12 h-12 text-cyan-400" />
              </div>

              {/* Rotating border */}
              <motion.div
                className="absolute inset-0 w-32 h-32 rounded-2xl border-2 border-transparent border-t-cyan-400 border-r-blue-500"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </motion.div>

            {/* Loading dots */}
            <motion.div
              className="flex gap-2 mt-8 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Loading text */}
            <motion.div
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Loading amazing content...</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
