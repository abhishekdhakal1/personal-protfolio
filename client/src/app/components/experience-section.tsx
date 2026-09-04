import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { apiClient } from "@/utils/api";

interface Experience {
  _id: string;
  role: string;
  company: string;
  location?: string;
  type: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/experience")
      .then((r) => { setExperiences(r.data.experiences ?? r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Placeholder if no data
  const displayItems: Experience[] = experiences.length > 0 ? experiences : [
    {
      _id: "1",
      role: "Full Stack Developer Intern",
      company: "Tech Company",
      location: "Remote",
      type: "Internship",
      startDate: "2024-01-01",
      endDate: undefined,
      current: true,
      description: "Built and maintained web applications using React, Node.js, and MongoDB. Collaborated with a cross-functional team to deliver features on time.",
      skills: ["React", "Node.js", "MongoDB", "Express"],
    },
  ];

  return (
    <section id="experience" className="section-padding">
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
            <span className="section-number text-sm">02.</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Journey
            </h2>
          </div>
        </motion.div>

        {loading ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {displayItems.map((exp, i) => (
                  <motion.div
                    key={exp._id}
                    className="relative pl-16"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-5 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                      <Briefcase size={18} className="text-primary" />
                    </div>

                    <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{exp.role}</h3>
                          <p className="text-sm text-primary font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={11} />
                            {formatDate(exp.startDate)} – {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 justify-end">
                              <MapPin size={11} />
                              {exp.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-accent text-accent-foreground font-medium">
                            {s}
                          </span>
                        ))}
                        {exp.type && (
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-secondary text-muted-foreground font-medium ml-auto">
                            {exp.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
