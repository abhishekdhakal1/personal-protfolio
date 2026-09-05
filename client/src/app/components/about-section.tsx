import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, GraduationCap, Calendar } from "lucide-react";
import { apiClient } from "@/utils/api";
import { AnimatedCounter } from "./animated-counter";
import { TextReveal } from "./animations/text-reveal";

interface Profile {
  name: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  title: string;
  profileImage: string;
  stats: {
    projectsCompleted: number;
    technicalSkills: number;
    yearsExperience: number;
    hoursOfCode: number;
  };
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
      <div className="text-3xl font-bold text-foreground mb-1">
        <AnimatedCounter value={value} suffix="+" />
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function AboutSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    apiClient.get("/profile").then((r) => setProfile(r.data.profile)).catch(() => {});
  }, []);

  const stats = profile?.stats ?? {
    projectsCompleted: 25,
    technicalSkills: 15,
    yearsExperience: 3,
    hoursOfCode: 1000,
  };

  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          className="mb-14 max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="section-heading">
            <span className="section-number text-sm">01.</span>
            <TextReveal as="h2" text="About Me" className="text-2xl sm:text-3xl font-bold text-foreground" />
          </div>
          <p className="mt-5 text-xl sm:text-2xl font-heading font-semibold text-foreground/90 leading-snug">
            Building digital experiences with code, curiosity and creativity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Bio */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {profile?.name ?? "Abhishek Dhakal"}
            </h3>
            <p className="text-sm font-medium text-primary mb-4">
              {profile?.title ?? "Electronics, Communication & Information Engineering"}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {profile?.bio ?? "Passionate about building high-quality software and embedded systems. I enjoy solving complex problems and creating elegant solutions at the intersection of hardware and software."}
            </p>

            {/* Contact details */}
            <div className="space-y-3">
              {profile?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-primary shrink-0" />
                  <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-primary shrink-0" />
                  <span className="text-muted-foreground">{profile.phone}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span className="text-muted-foreground">{profile.location}</span>
                </div>
              )}
            </div>

            {/* Education placeholder */}
            <div className="mt-8 p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    Tribhuvan University, IOE
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    B.E. Electronics, Communication & Information Engineering
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar size={11} />
                    2021 – 2025
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.15, ease: "easeOut" } } }}
          >
            <div className="grid grid-cols-2 gap-4">
              <StatCard value={stats.projectsCompleted} label="Projects Completed" />
              <StatCard value={stats.technicalSkills} label="Technical Skills" />
              <StatCard value={stats.yearsExperience} label="Years Experience" />
              <StatCard value={stats.hoursOfCode} label="Hours of Code" />
            </div>

            {/* What I do */}
            <div className="mt-6 p-6 rounded-2xl border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4">What I do</h4>
              <div className="space-y-3">
                {[
                  { title: "Web Development", desc: "Full-stack web apps with React, Node.js, and MongoDB" },
                  { title: "Embedded Systems", desc: "Microcontroller programming, RTOS, PCB design" },
                  { title: "IoT Solutions", desc: "Connected devices with MQTT, REST APIs, cloud platforms" },
                ].map((item) => (
                  <div key={item.title} className="arrow-bullet flex items-start">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
