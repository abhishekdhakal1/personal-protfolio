import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Github, Linkedin, Twitter, MapPin } from "lucide-react";
import { apiClient } from "@/utils/api";

interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  profileImage: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const TITLES = [
  "Full Stack Developer",
  "Electronics Engineer",
  "IoT Enthusiast",
  "Open Source Contributor",
];

function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index % texts.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, texts]);

  return (
    <span className="text-primary">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    apiClient.get("/profile").then((r) => setProfile(r.data.profile)).catch(() => {});
  }, []);

  const name = profile?.name ?? "Abhishek Dhakal";
  const bio = profile?.bio ?? "Passionate developer building modern web applications and embedded systems at the intersection of software and hardware.";
  const location = profile?.location ?? "Kathmandu, Nepal";
  const social = profile?.socialLinks ?? {};
  const profileImage = profile?.profileImage;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center section-padding overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground mb-6"
            >
              <MapPin size={13} className="text-primary" />
              {location}
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-4"
            >
              Hi, I&apos;m{" "}
              <span className="text-primary">{name.split(" ")[0]}</span>
              <br />
              {name.split(" ").slice(1).join(" ")}
            </motion.h1>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-xl sm:text-2xl font-medium text-muted-foreground mb-6"
            >
              <TypingText texts={TITLES} />
            </motion.div>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mb-8"
            >
              {bio}
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 mb-8"
            >
              <button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get in Touch
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                View Projects
              </button>
            </motion.div>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3"
            >
              {social.github && (
                <SocialLink href={social.github} label="GitHub"><Github size={18} /></SocialLink>
              )}
              {social.linkedin && (
                <SocialLink href={social.linkedin} label="LinkedIn"><Linkedin size={18} /></SocialLink>
              )}
              {social.twitter && (
                <SocialLink href={social.twitter} label="Twitter"><Twitter size={18} /></SocialLink>
              )}
              {!social.github && !social.linkedin && !social.twitter && (
                <>
                  <SocialLink href="https://github.com" label="GitHub"><Github size={18} /></SocialLink>
                  <SocialLink href="https://linkedin.com" label="LinkedIn"><Linkedin size={18} /></SocialLink>
                  <SocialLink href="mailto:abhishekdhakal1826@gmail.com" label="Email"><Mail size={18} /></SocialLink>
                </>
              )}
            </motion.div>
          </div>

          {/* Right — profile image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-3xl border border-border opacity-50" />
              <div className="absolute -inset-8 rounded-3xl border border-border opacity-25" />

              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden bg-secondary border border-border">
                {profileImage ? (
                  <img
                    src={profileImage.startsWith("http") ? profileImage : `${import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:5000"}${profileImage}`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-7xl font-bold text-primary/30">{name[0]}</span>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Available for work</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs text-muted-foreground font-medium">Scroll to explore</span>
          <motion.div
            className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center pt-1.5"
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-muted-foreground"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-accent transition-all"
    >
      {children}
    </a>
  );
}
