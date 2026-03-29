import { motion } from 'framer-motion';
import { ContactSection } from '../components/contact-section';
import { Footer } from '../components/footer';
import { Navbar } from '../components/navbar';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.05,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export function ContactPage() {
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
        <ContactSection />
      </div>
      <Footer />
    </motion.div>
  );
}
