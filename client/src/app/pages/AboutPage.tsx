import { motion } from 'framer-motion';
import { AboutSection } from '../components/about-section';
import { Footer } from '../components/footer';
import { Navbar } from '../components/navbar';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export function AboutPage() {
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
        <AboutSection />
      </div>
      <Footer />
    </motion.div>
  );
}
