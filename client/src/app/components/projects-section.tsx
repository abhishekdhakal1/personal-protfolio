import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Star, Search } from "lucide-react";
import { apiClient } from "@/utils/api";
import { CardTilt } from "./animations/card-tilt";
import { TextReveal } from "./animations/text-reveal";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  status: "Completed" | "In Progress" | "Planning";
}

const STATUS_COLORS: Record<string, string> = {
  "Completed": "text-success bg-success/10",
  "In Progress": "text-warning bg-warning/10",
  "Planning": "text-muted-foreground bg-secondary",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const apiBase = import.meta.env.API_URL?.replace("/api", "") ?? "http://localhost:5000";
  const imgSrc = project.imageUrl
    ? (project.imageUrl.startsWith("http") ? project.imageUrl : `${apiBase}${project.imageUrl}`)
    : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <CardTilt className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-[0_0_30px_-12px_var(--primary)] transition-all duration-300">
      {/* Image */}
      <Link to={`/projects/${project._id}`} className="relative h-44 bg-secondary overflow-hidden block">
        {imgSrc ? (
          <img src={imgSrc} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-border">{project.title[0]}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="level-number px-2 py-1 rounded-full bg-background/70 backdrop-blur-sm text-[10px] font-semibold text-muted-foreground">
            N°{String(index + 1).padStart(2, "0")}
          </span>
          {project.featured && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium backdrop-blur-sm">
              <Star size={10} />
              Featured
            </span>
          )}
        </div>
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status] ?? ""}`}>
          {project.status}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground leading-tight">
            <Link to={`/projects/${project._id}`} className="hover:text-primary transition-colors">
              {project.title}
            </Link>
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {project.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-lg bg-accent text-accent-foreground font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <Link
            to={`/projects/${project._id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
          >
            Details
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={14} />
              Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors ml-auto"
            >
              Live Demo
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      </CardTilt>
    </motion.article>
  );
}

// Large "mission briefing" spotlight for the top featured project — game-inspired
// but still professional: objective/stack/status pulled straight from real project data.
function FeaturedMission({ project }: { project: Project }) {
  const apiBase = import.meta.env.API_URL?.replace("/api", "") ?? "http://localhost:5000";
  const imgSrc = project.imageUrl
    ? (project.imageUrl.startsWith("http") ? project.imageUrl : `${apiBase}${project.imageUrl}`)
    : null;

  return (
    <motion.div
      className="relative mb-14 rounded-3xl border border-primary/30 bg-card overflow-hidden glass-panel"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative h-64 lg:h-auto bg-secondary overflow-hidden">
          {imgSrc ? (
            <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-bold text-border">{project.title[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <span className="level-number text-xs font-semibold text-primary tracking-widest mb-3">MISSION 01</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{project.title}</h3>

          <div className="space-y-3 mb-6">
            <div>
              <span className="level-number text-[11px] font-semibold text-muted-foreground tracking-wide">OBJECTIVE</span>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{project.description}</p>
            </div>
            <div>
              <span className="level-number text-[11px] font-semibold text-muted-foreground tracking-wide">TECHNOLOGY</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-lg bg-accent text-accent-foreground font-medium">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="level-number text-[11px] font-semibold text-muted-foreground tracking-wide">STATUS</span>
              <p className={`inline-block ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[project.status] ?? ""}`}>{project.status}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/projects/${project._id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
            >
              View Case Study
            </Link>
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Live Demo <ExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Github size={14} /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    apiClient
      .get("/projects?limit=100")
      .then((r) => { setProjects(r.data.projects); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const featuredProject = projects.find((p) => p.featured);
  const filtered = projects
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-heading">
            <span className="section-number text-sm">03.</span>
            <TextReveal as="h2" text="Selected Work" className="text-2xl sm:text-3xl font-bold text-foreground" />
          </div>
        </motion.div>

        {!loading && featuredProject && <FeaturedMission project={featuredProject} />}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No projects found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <ProjectCard key={project._id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
