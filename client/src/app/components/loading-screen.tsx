import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: "easeInOut",
      onUpdate: (value) => setPercent(Math.round(value)),
    });
    return () => controls.stop();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
    >
      {/* faint circuit-dot texture, matches the site's electronics motif */}
      <div
        className="absolute inset-0 opacity-[0.07] text-primary"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative flex items-center justify-center w-28 h-28 mb-10">
        {/* slow outer dashed orbit */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        {/* fast inner spinner arc, counter-rotating */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-transparent border-t-primary border-r-primary/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        {/* pulsing glow behind the logo */}
        <motion.div
          className="absolute w-16 h-16 rounded-2xl bg-primary/50 blur-xl"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="text-2xl font-bold text-primary-foreground select-none">A</span>
        </motion.div>
      </div>

      <motion.div
        className="w-56 h-1 bg-border rounded-full overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="h-full bg-primary rounded-full relative overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
        >
          <motion.span
            className="absolute inset-y-0 left-0 w-10 bg-white/50 blur-[2px]"
            animate={{ x: ["-120%", "600%"] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-4 flex items-center gap-2 font-mono text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <span>Loading portfolio</span>
        <span className="text-primary font-semibold tabular-nums w-10">{percent}%</span>
      </motion.div>
    </motion.div>
  );
}

