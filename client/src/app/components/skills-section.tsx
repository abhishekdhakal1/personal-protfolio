import { motion } from 'framer-motion';
import { 
  Code, 
  Cpu, 
  Microchip, 
  Wifi, 
  Database, 
  Globe, 
  Smartphone, 
  Cloud,
  Zap,
  Brain,
  Shield,
  Terminal
} from 'lucide-react';

const skillsData = {
  "Web Development": {
    icon: Code,
    color: "from-cyan-500 to-blue-500",
    skills: [
      { name: "React/Next.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Node.js", level: 82 },
      { name: "Python/Django", level: 78 }
    ]
  },
  "Embedded Systems": {
    icon: Cpu,
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "C/C++", level: 92 },
      { name: "Arduino", level: 88 },
      { name: "STM32", level: 85 },
      { name: "Raspberry Pi", level: 82 },
      { name: "RTOS", level: 75 }
    ]
  },
  "VLSI & FPGA": {
    icon: Microchip,
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "Verilog/VHDL", level: 87 },
      { name: "Xilinx Vivado", level: 83 },
      { name: "Digital Design", level: 85 },
      { name: "ASIC Design", level: 78 },
      { name: "Timing Analysis", level: 80 }
    ]
  },
  "AI & Machine Learning": {
    icon: Brain,
    color: "from-orange-500 to-red-500",
    skills: [
      { name: "TensorFlow", level: 82 },
      { name: "PyTorch", level: 80 },
      { name: "Computer Vision", level: 78 },
      { name: "Neural Networks", level: 85 },
      { name: "Data Science", level: 83 }
    ]
  },
  "IoT & Networks": {
    icon: Wifi,
    color: "from-blue-500 to-indigo-500",
    skills: [
      { name: "MQTT", level: 88 },
      { name: "LoRaWAN", level: 82 },
      { name: "5G/6G", level: 75 },
      { name: "Network Protocols", level: 85 },
      { name: "Edge Computing", level: 80 }
    ]
  },
  "Cloud & DevOps": {
    icon: Cloud,
    color: "from-gray-500 to-slate-500",
    skills: [
      { name: "AWS", level: 83 },
      { name: "Docker", level: 87 },
      { name: "Kubernetes", level: 78 },
      { name: "CI/CD", level: 85 },
      { name: "Linux", level: 90 }
    ]
  }
};

function SkillBar({ skill, index }: { skill: { name: string; level: number }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="mb-4"
    >
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ 
            duration: 1, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}

function SkillCard({ category, data, index }: { 
  category: string; 
  data: typeof skillsData[string]; 
  index: number;
}) {
  const Icon = data.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="h-full bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${data.color} p-0.5 mr-4`}>
            <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground">{category}</h3>
        </div>
        
        <div className="space-y-1">
          {data.skills.map((skill, skillIndex) => (
            <SkillBar key={skill.name} skill={skill} index={skillIndex} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Comprehensive expertise spanning embedded systems, web development, AI/ML, and cutting-edge technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsData).map(([category, data], index) => (
            <SkillCard key={category} category={category} data={data} index={index} />
          ))}
        </div>

        {/* Additional Skills Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-foreground">Additional Technologies</h3>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {[
              "Git", "REST APIs", "GraphQL", "MongoDB", "PostgreSQL", 
              "Redis", "WebSocket", "WebRTC", "TensorFlow Lite", 
              "OpenCV", "MATLAB", "Simulink", "LabVIEW", "Kicad",
              "Arduino IDE", "PlatformIO", "Jupyter", "Docker Swarm"
            ].map((tech, index) => (
              <motion.div
                key={tech}
                className="px-4 py-2 bg-accent/50 border border-cyan-500/20 rounded-full text-cyan-300 backdrop-blur-sm text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{
                  scale: 1.1,
                  borderColor: "rgba(34, 211, 238, 0.8)",
                  boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)",
                  backgroundColor: "rgba(34, 211, 238, 0.1)"
                }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
