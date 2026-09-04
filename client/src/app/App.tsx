import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./contexts/theme-context";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPage } from "./pages/AdminPage";
import { LoadingScreen } from "./components/loading-screen";
import { BackToTop } from "./components/back-to-top";
import { ScrollProgress } from "./components/scroll-progress";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { SocialRail, EmailRail } from "./components/side-rails";
import { AnimatedBackground } from "./components/animated-background";
import { PageTransition } from "./components/page-transition";
import { ScrollToTop } from "./components/scroll-to-top";
import { useSmoothScroll } from "./lib/smooth-scroll";
import { useScrollPageNavigation } from "./lib/scroll-page-nav";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/skills" element={<PageTransition><SkillsPage /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/projects/:id" element={<PageTransition><ProjectDetailPage /></PageTransition>} />
        <Route path="/experience" element={<PageTransition><ExperiencePage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PortfolioLayout() {
  const [isLoading, setIsLoading] = useState(true);
  useSmoothScroll();
  useScrollPageNavigation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>
      {!isLoading && (
        <div className="min-h-screen flex flex-col text-foreground">
          <AnimatedBackground />
          <ScrollToTop />
          <ScrollProgress />
          <BackToTop />
          <Navbar />
          <SocialRail />
          <EmailRail />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/*" element={<PortfolioLayout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}


