import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Github, Linkedin, Twitter, MapPin, Wifi } from "lucide-react";
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

// Types the backend-provided title once, then rests with a blinking cursor.
function TypedTitle({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, [text]);

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
  const { scrollY } = useScroll();
  const blobYSlow = useTransform(scrollY, [0, 600], [0, 120]);
  const blobYFast = useTransform(scrollY, [0, 600], [0, -160]);

  // Subtle depth tilt on the profile photo, tracking the pointer within the hero.
  const containerRef = useRef<HTMLElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 120, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    apiClient.get("/profile").then((r) => setProfile(r.data.profile)).catch(() => {});
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(relX * 10);
    tiltX.set(relY * -10);
  }

  function handlePointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  const name = profile?.name ?? "Abhishek Dhakal";
  const title = profile?.title ?? "Full Stack Developer";
  const bio = profile?.bio ?? "Passionate developer building modern web applications and embedded systems at the intersection of software and hardware.";
  const location = profile?.location ?? "Kathmandu, Nepal";
  const social = profile?.socialLinks ?? {};
  const profileImage = profile?.profileImage;
  const hasSocial = Boolean(social.github || social.linkedin || social.twitter);

  return (
    <section
      id="home"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen flex items-center section-padding overflow-hidden"
    >
      {/* Accent blobs — drift at different speeds as you scroll, hero's own atmosphere layer */}
      <motion.div style={{ y: blobYSlow }} className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div style={{ y: blobYFast }} className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground mb-6 font-mono"
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
              className="text-xl sm:text-2xl font-medium text-muted-foreground mb-6 font-mono min-h-[2rem]"
            >
              <TypedTitle text={title} />
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
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore My Work
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Contact Me
              </Link>
            </motion.div>

            {hasSocial && (
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
              </motion.div>
            )}
          </div>

          {/* Right — profile image, cinematic clip-path reveal + pointer-tracked depth tilt */}
          <motion.div
            className="flex justify-center lg:justify-end"
            style={{ perspective: 800 }}
            initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div className="relative" style={{ rotateX: springX, rotateY: springY }}>
              {/* Decorative rings + soft glow */}
              <div className="absolute -inset-4 rounded-3xl border border-border opacity-50" />
              <div className="absolute -inset-8 rounded-3xl border border-border opacity-25" />
              <div className="absolute -inset-6 rounded-3xl bg-primary/20 blur-2xl opacity-60" />

              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden bg-secondary border border-border shadow-[0_0_60px_-15px_var(--primary)]">
                {profileImage ? (
                  <img
                    src={profileImage.startsWith("http") ? profileImage : `${import.meta.env.API_URL?.replace("/api", "") ?? "http://localhost:5000"}${profileImage}`}
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
                  <span className="relative flex w-2.5 h-2.5 items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-success"
                      animate={{ scale: [1, 2.4, 2.4], opacity: [0.6, 0, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                    <span className="relative w-2 h-2 rounded-full bg-success" />
                  </span>
                  <span className="text-xs font-medium text-foreground">Available for work</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator — a radiating signal, nod to the electronics side of things */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs text-muted-foreground font-medium font-mono">Scroll to explore</span>
          <div className="relative w-9 h-9 flex items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border border-primary"
              animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border border-primary"
              animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
            />
            <div className="relative w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary">
              <Wifi size={15} />
            </div>
          </div>
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
