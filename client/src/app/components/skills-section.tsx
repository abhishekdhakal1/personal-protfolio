import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/utils/api";
import { CardTilt } from "./animations/card-tilt";
import { TextReveal } from "./animations/text-reveal";

interface Skill {
  _id: string;
  name: string;
  level: number;
  icon: string;
  category: string;
}

const CATEGORY_ORDER = [
  "Web Development",
  "Embedded Systems",
  "VLSI & FPGA",
  "AI & ML",
  "IoT & Networks",
  "Cloud & DevOps",
];

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
        <span className="text-xs font-medium text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const [grouped, setGrouped] = useState<Record<string, Skill[]>>({});
  const [active, setActive] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/skills?visible=true")
      .then((r) => { setGrouped(r.data.skills); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...Object.keys(grouped).sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b))];
  const displayed = active === "All" ? grouped : { [active]: grouped[active] ?? [] };

  return (
    <section id="skills" className="section-padding">
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
            <TextReveal as="h2" text="Tech Ecosystem" className="text-2xl sm:text-3xl font-bold text-foreground" />
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(displayed).map(([category, skills]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <CardTilt className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_-10px_var(--primary)] transition-all duration-300">
                  <h3 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border group-hover:border-primary/30 transition-colors">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <SkillBar key={skill._id} skill={skill} />
                    ))}
                  </div>
                </CardTilt>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
