import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Github,
  ExternalLink,
  Cpu,
  Wifi,
  Code,
  Zap,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const projects = [
  {
    title: "Tic-Tac-Toe",
    description:
      "Interactive and animated Tic-Tac-Toe game built with React and Tailwind CSS. Includes smooth motion-based animations, turn indicators, win detection, and responsive UI for all devices.",
    icon: Code,
    tags: ["React", "Tailwind", "Motion", "Vite"],
    color: "from-cyan-500 to-blue-500",
    category: "Web",
    github: "https://github.com/abhishekdhakal1/tic-tac-toe",
    demo: "https://tic-tac-toe-wine-six.vercel.app/",
    featured: true,
  },
  {
    title: "Thapathali College Website Development",
    description:
      "Design and development of a content management system (CMS) for a college website, enabling administrators to manage courses, notices, events, faculty profiles, and announcements through a secure dashboard.",
    icon: Code,
    tags: ["Full Stack", "CMS", "React", "Tailwind"],
    color: "from-green-500 to-emerald-500",
    category: "Web",
    github: "https://github.com/ManishJoc14/tcioe-cms",
    demo: "",
    featured: true,
  },
  {
    title: "Automatic Waste Segregation Device",
    description:
      "Hardware-based automatic waste segregation system that detects biodegradable and non-biodegradable waste using sensors and embedded control logic. The device classifies waste in real time.",
    icon: Cpu,
    tags: ["Embedded", "Sensors", "IoT", "Hardware"],
    color: "from-orange-500 to-red-500",
    category: "Embedded",
    github: "https://github.com/kesharfdse/waste-segeration",
    demo: "",
    featured: true,
  },
  {
    title: "Embedded Systems Project",
    description:
      "Ongoing embedded systems project focused on hardware–software integration using microcontrollers and peripheral sensors. The work involves circuit design, firmware development, and real-time data processing.",
    icon: Cpu,
    tags: ["Embedded", "Microcontroller", "Firmware", "Hardware"],
    color: "from-purple-500 to-pink-500",
    category: "Embedded",
    github: "",
    demo: "",
    featured: false,
  },
  {
    title: "5G Network Optimization",
    description:
      "Research and implementation of advanced algorithms for 5G network optimization, focusing on latency reduction and throughput enhancement in IoT scenarios.",
    icon: Wifi,
    tags: ["5G", "Network", "IoT", "Research"],
    color: "from-blue-500 to-indigo-500",
    category: "IoT",
    github: "",
    demo: "",
    featured: false,
  },
  {
    title: "FPGA Accelerator for AI",
    description:
      "Design and implementation of FPGA-based acceleration system for machine learning inference, achieving significant performance improvements over CPU-based solutions.",
    icon: Zap,
    tags: ["FPGA", "AI", "Hardware", "Acceleration"],
    color: "from-yellow-500 to-orange-500",
    category: "VLSI",
    github: "",
    demo: "",
    featured: true,
  },
];

const categories = ["All", "Web", "Embedded", "IoT", "VLSI"];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const Icon = project.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Card className="h-full bg-card border-border hover:border-cyan-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10">
        {/* Project Header */}
        <div className="relative p-6 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.color} p-0.5`}
            >
              <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                <Icon className="h-7 w-7 text-cyan-400" />
              </div>
            </div>
            {project.featured && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full"
              >
                Featured
              </motion.div>
            )}
          </div>

          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div className="px-6 mb-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                className="px-3 py-1 text-xs bg-accent/50 border border-cyan-500/20 rounded-full text-cyan-300 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 mt-auto">
          <div className="flex gap-3">
            {project.github && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 group"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Code
                </a>
              </Button>
            )}

            {project.demo ? (
              <Button
                asChild
                size="sm"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white group"
              >
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Demo
                </a>
              </Button>
            ) : (
              <Button
                disabled
                size="sm"
                className="flex-1 bg-muted text-muted-foreground cursor-not-allowed"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section
      id="projects"
      className="py-20 px-6 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="max-w-7xl mx-auto">
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
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Explore my portfolio of cyber-physical systems, quantum computing
            experiments, and full-stack applications.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-lg shadow-cyan-500/25"
                  : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="h-4 w-4 mr-2" />
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No projects found in the "{selectedCategory}" category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
