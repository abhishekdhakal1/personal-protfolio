import { motion } from "motion/react";
import { Terminal, Database, Cpu } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="text-6xl mb-4">👋</div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Hello, I'm Abhishek Dhakal
          </h1>

          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-2xl">🚀</div>
          </motion.div>

          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
            BE in Electronics, Communication and Information
          </p>

          <p className="text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Bridging hardware and software to create next gen cyber physical
            systems. Architecting the digital future with quantum inspired
            algorithms and neuromorphic computing principles.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <motion.a
              href="#terminal"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                <Terminal className="mr-2 h-4 w-4" />
                Access Neural Terminal
              </Button>
            </motion.a>

            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Database className="mr-2 h-4 w-4" />
                Explore Quantum Repositories
              </Button>
            </motion.a>
          </div>

          <motion.div
            className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              "Web Development",
              "VLSI Design",
              "Embedded AI",
              "IoT Networks",
              "5G/6G Systems",
              "FPGA Acceleration",
            ].map((tech, index) => (
              <motion.div
                key={tech}
                className="px-4 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-full text-cyan-300 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  borderColor: "rgba(34, 211, 238, 0.8)",
                  boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
                }}
              >
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-cyan-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
