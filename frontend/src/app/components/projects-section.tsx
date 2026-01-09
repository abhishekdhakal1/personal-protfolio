import { motion } from "motion/react";
import { Github, ExternalLink, Cpu, Wifi, Code, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const projects = [
  {
    title: "Tic-Tac-Toe",
    description:
      "Interactive and animated Tic-Tac-Toe game built with React and Tailwind CSS. Includes smooth motion-based animations, turn indicators, win detection, and responsive UI for all devices.",
    icon: Code,
    tags: ["React", "Tailwind", "Motion", "Vite"],
    color: "from-pink-500 to-rose-500",
    github: "https://github.com/abhishekdhakal1/tic-tac-toe",
    demo: "https://tic-tac-toe-wine-six.vercel.app/",
  },
  {
    title: "Thapathali College Website Development",
    description:
      "Design and development of a content management system (CMS) for a college website, enabling administrators to manage courses, notices, events, faculty profiles, and announcements through a secure dashboard. Built with a full-stack architecture, focusing on scalability, role-based access control, and responsive design. Currently under active development.",
    icon: Code,
    tags: ["Full Stack", "CMS", "React", "Tailwind"],
    color: "from-pink-500 to-rose-500",
    github: "https://github.com/ManishJoc14/tcioe-cms",
    demo: "",
  },
  {
    title: "Automatic Waste Segregation Device",
    description:
      "Hardware-based automatic waste segregation system that detects biodegradable and non-biodegradable waste using sensors and embedded control logic. The device classifies waste in real time and mechanically directs it into appropriate bins. Hardware integration, sensor calibration, and control algorithm tuning are currently in progress. No public demo available.",
    icon: Cpu,
    tags: ["Embedded", "Sensors", "IoT", "Hardware"],
    color: "from-pink-500 to-rose-500",
    github: "https://github.com/kesharfdse/waste-segeration",
    demo: "https://tcioe.edu.np/",
  },
  {
    title: "Embedded Systems Project (Currently Working)",
    description:
      "Ongoing embedded systems project focused on hardware–software integration using microcontrollers and peripheral sensors. The work involves circuit design, firmware development, and real-time data processing. System testing and optimization are currently in progress. No public demo available.",
    icon: Cpu,
    tags: ["Embedded", "Microcontroller", "Firmware", "Hardware"],
    color: "from-pink-500 to-rose-500",
    github: "",
    demo: "",
  },
];

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="min-h-screen py-20 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            Explore my portfolio of cyber-physical systems, quantum computing
            experiments, and full-stack applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group h-full bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                  <div className="p-6 h-full flex flex-col">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} p-0.5 mb-4`}
                    >
                      <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-cyan-400" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-slate-400 mb-4 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-800/50 border border-cyan-500/20 rounded text-cyan-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black"
                      >
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
