import { motion } from "motion/react";
import { Code, Zap, Brain, Cpu } from "lucide-react";

const skills = [
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
    description:
      "Full-stack web development, UI/UX design, and frontend engineering",
    color: "from-green-500 to-emerald-500",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="min-h-screen py-20 px-6 bg-slate-950 relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8"></div>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            I'm a third-year engineering student passionate about the
            intersection of hardware and software. UI/UX and frontend developer
            and expoloring towards backend and goal is to become a full-stack
            developer along with my Electronics degree. My mission is to bridge
            the gap between physical and digital systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${skill.color} p-0.5 mb-6`}
                  >
                    <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                      <Icon className="h-7 w-7 text-cyan-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {skill.title}
                  </h3>

                  <p className="text-slate-400">{skill.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-cyan-400">
            My Journey
          </h3>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500"></div>

            {[
              {
                year: "Year 1",
                title: "Electronics Fundamentals",
                desc: "Building strong foundation in circuit design and digital systems",
              },
              {
                year: "Year 2",
                title: "Full Stack Development",
                desc: "Mastered UI/UX, frontend, and some fundamentals of backend.",
              },
              {
                year: "Year 3",
                title: "Communication Systems",
                desc: "Currently diving into filter design, embedded systems and wireless technologies",
              },
            ].map((item, index) => (
              <motion.div
                key={item.year}
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
                  <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500 transition-all">
                    <div className="text-cyan-400 font-bold mb-2">
                      {item.year}
                    </div>
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>

                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full border-4 border-slate-950 z-10"></div>
                </div>

                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
