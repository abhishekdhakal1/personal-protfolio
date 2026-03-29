import { motion } from 'framer-motion';
import { HeroSection } from '../components/hero-section';
import { AboutSection } from '../components/about-section';
import { ProjectsSection } from '../components/projects-section';
import { SkillsSection } from '../components/skills-section';
import { ContactSection } from '../components/contact-section';
import { Footer } from '../components/footer';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export function HomePage() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </motion.div>
  );
}
