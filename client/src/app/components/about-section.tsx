import { motion } from 'framer-motion';
import { Code, Zap, Brain, Cpu, User, Award, Target, Calendar } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';

const expertise = [
  {
    icon: Cpu,
    title: "Hardware Design",
    description: "VLSI, FPGA, and embedded systems architecture",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "AI & ML",
    description: "Embedded AI, neuromorphic computing, and quantum algorithms",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Communication Systems",
    description: "IoT networks, 5G/6G technologies, and wireless protocols",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Full-stack web development, UI/UX design, and frontend engineering",
    color: "from-green-500 to-emerald-500",
  },
];

const timeline = [
  {
    year: "2021",
    title: "Started Engineering Journey",
    desc: "Began BE in Electronics, Communication and Information Engineering at Thapathali Campus",
    type: "education"
  },
  {
    year: "2022",
    title: "Web Development Foundation",
    desc: "Mastered frontend technologies and started exploring full-stack development",
    type: "skill"
  },
  {
    year: "2023",
    title: "Hardware-Software Integration",
    desc: "Focused on embedded systems, VLSI design, and IoT applications",
    type: "project"
  },
  {
    year: "2024",
    title: "Advanced AI & Communication",
    desc: "Currently diving into embedded AI, 5G/6G systems, and FPGA acceleration",
    type: "current"
  }
];

const stats = [
  { icon: Target, value: 25, suffix: "+", label: "Projects Completed" },
  { icon: Award, value: 15, suffix: "+", label: "Technical Skills" },
  { icon: User, value: 3, suffix: "+", label: "Years Experience" },
  { icon: Calendar, value: 1000, suffix: "+", label: "Hours of Code" }
];

function TimelineItem({ item, index }: { item: typeof timeline[0]; index: number }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'education': return 'from-blue-500 to-cyan-500';
      case 'skill': return 'from-green-500 to-emerald-500';
      case 'project': return 'from-purple-500 to-pink-500';
      case 'current': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center mb-12 ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div
        className={`w-5/12 ${
          index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
        }`}
      >
        <div className="bg-card border border-border rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getTypeColor(item.type)} text-white text-xs font-bold rounded-full mb-3`}>
            {item.year}
          </div>
          <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
          <p className="text-muted-foreground text-sm">{item.desc}</p>
        </div>
      </div>

      <div className="w-2/12 flex justify-center">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.2 }}
        >
          <div className={`w-4 h-4 bg-gradient-to-r ${getTypeColor(item.type)} rounded-full border-4 border-background z-10`}></div>
          {item.type === 'current' && (
            <motion.div
              className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>

      <div className="w-5/12"></div>
    </motion.div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            I'm a passionate third-year engineering student at the intersection of hardware and software. 
            My mission is to bridge the gap between physical and digital systems, creating innovative 
            solutions that push the boundaries of what's possible in cyber-physical systems.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 bg-card border border-border rounded-xl hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
                  <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Expertise Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {expertise.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative p-8 bg-card border border-border rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${skill.color} p-0.5 mb-6`}
                  >
                    <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-cyan-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-cyan-400 transition-colors">
                    {skill.title}
                  </h3>

                  <p className="text-muted-foreground">{skill.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            My Journey
          </h3>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-orange-500"></div>

            {timeline.map((item, index) => (
              <TimelineItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
