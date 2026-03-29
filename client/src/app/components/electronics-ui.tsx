import { motion } from 'framer-motion';
import { Zap, Cpu, Wifi, Activity } from 'lucide-react';

// Neon Button Component
export function NeonButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: any;
  [key: string]: any;
}) {
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:from-cyan-600 hover:to-blue-600",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40",
    outline: "border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} rounded-lg`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Circuit trace effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(6,182,212,0.1)_50%,transparent_70%)]" />
      </div>
      
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
    </motion.button>
  );
}

// Circuit Card Component
export function CircuitCard({ 
  children, 
  className = "",
  hover = true,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}) {
  return (
    <motion.div
      className={`relative bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 overflow-hidden ${className}`}
      whileHover={hover ? { y: -5, borderColor: "rgba(6, 182, 212, 0.5)" } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(6,182,212,0.05)_60%,transparent_80%)] bg-[length:2rem_2rem]" />
      </div>
      
      {/* Corner indicators */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Oscilloscope Waveform Component
export function Oscilloscope({ 
  frequency = 1,
  amplitude = 1,
  color = '#06b6d4'
}: {
  frequency?: number;
  amplitude?: number;
  color?: string;
}) {
  return (
    <div className="relative w-full h-20 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[...Array(9)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 10}
            x2="400"
            y2={i * 10}
            stroke="rgba(6, 182, 212, 0.1)"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Waveform */}
        <motion.path
          d={`M 0,40 ${Array.from({ length: 100 }, (_, i) => {
            const x = i * 4;
            const y = 40 + Math.sin((i * 0.1 * frequency) * Math.PI / 180) * 20 * amplitude;
            return `L ${x},${y}`;
          }).join(' ')}`}
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Glow effect */}
        <motion.path
          d={`M 0,40 ${Array.from({ length: 100 }, (_, i) => {
            const x = i * 4;
            const y = 40 + Math.sin((i * 0.1 * frequency) * Math.PI / 180) * 20 * amplitude;
            return `L ${x},${y}`;
          }).join(' ')}`}
          stroke={color}
          strokeWidth="4"
          fill="none"
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      
      {/* Control panel */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <div className="text-xs text-cyan-400 font-mono">CH{frequency}</div>
      </div>
    </div>
  );
}

// Status Monitor Component
export function StatusMonitor({ 
  stats = [],
  title = "System Monitor"
}: {
  stats?: Array<{ label: string; value: string | number; unit?: string; color?: string }>;
  title?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-cyan-400">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10"
          >
            <span className="text-gray-300 text-sm">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span 
                className={`font-bold font-mono ${stat.color || 'text-cyan-400'}`}
              >
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-gray-500 text-xs">{stat.unit}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// PCB Trace Background Component
export function PCBTrace({ 
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* PCB Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_60%,rgba(6,182,212,0.02)_80%,transparent_100%)] bg-[length:3rem_3rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_70%,rgba(6,182,212,0.03)_90%,transparent_100%)] bg-[length:4rem_4rem]" />
      </div>
      
      {/* Circuit traces */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="circuitPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 10,50 L 30,50 L 50,30 L 70,30 L 90,50"
              stroke="#06b6d4"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="30" cy="50" r="1" fill="#06b6d4" />
            <circle cx="70" cy="30" r="1" fill="#06b6d4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuitPattern)" />
      </svg>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Glitch Text Component
export function GlitchText({ 
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Main text */}
      <div className="relative z-20">
        {children}
      </div>
      
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 z-10 text-cyan-400 opacity-0"
        whileHover={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 z-10 text-blue-400 opacity-0"
        whileHover={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
