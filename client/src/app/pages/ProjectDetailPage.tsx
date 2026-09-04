import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Star } from "lucide-react";
import { apiClient, endpoints } from "@/utils/api";

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
  technologies?: { name: string; level: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  "Completed": "text-success bg-success/10",
  "In Progress": "text-warning bg-warning/10",
  "Planning": "text-muted-foreground bg-secondary",
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    apiClient
      .get(endpoints.projects.get(id))
      .then((r) => setProject(r.data.project))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const apiBase = import.meta.env.API_URL?.replace("/api", "") ?? "http://localhost:5000";
  const imgSrc = project?.imageUrl
    ? (project.imageUrl.startsWith("http") ? project.imageUrl : `${apiBase}${project.imageUrl}`)
    : null;

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="h-8 w-40 rounded-lg bg-secondary animate-pulse mb-8" />
          <div className="h-72 rounded-2xl bg-secondary animate-pulse mb-8" />
          <div className="h-6 w-2/3 rounded-lg bg-secondary animate-pulse mb-4" />
          <div className="h-4 w-full rounded-lg bg-secondary animate-pulse mb-2" />
          <div className="h-4 w-5/6 rounded-lg bg-secondary animate-pulse" />
        </div>
      </section>
    );
  }

  if (notFound || !project) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-3xl text-center py-20">
          <p className="text-lg font-medium text-foreground">Project not found</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </motion.div>

        {imgSrc && (
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-border bg-secondary mb-8 h-64 sm:h-96"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {project.featured && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Star size={10} />
                Featured
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status] ?? ""}`}>
              {project.status}
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-heading">
            {project.title}
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {project.description}
          </p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-accent text-accent-foreground font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h2 className="section-number text-sm mb-3">Tech Stack</h2>
              <div className="space-y-3">
                {project.technologies.map((tech) => (
                  <div key={tech.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{tech.name}</span>
                      <span className="text-muted-foreground">{tech.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-6 border-t border-border">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
              >
                <Github size={16} />
                View Code
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Live Demo
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
