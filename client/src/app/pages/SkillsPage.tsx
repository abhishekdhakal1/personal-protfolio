import { motion } from 'framer-motion';
import { SkillsSection } from '../components/skills-section';
import { Footer } from '../components/footer';
import { Navbar } from '../components/navbar';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -50,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export function SkillsPage() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Navbar />
      <div className="pt-20">
        <SkillsSection />
      </div>
      <Footer />
    </motion.div>
  );
}
