import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "./components/navbar";
import { Hero3D } from "./components/3d-hero";
import { AboutSection } from "./components/about-section";
import { ProjectsSection } from "./components/projects-section";
import { SkillsSection } from "./components/skills-section";
import { ContactSection } from "./components/contact-section";
import { Footer } from "./components/footer";
import { ThemeProvider } from "./contexts/theme-context";
import { AuthProvider } from "./contexts/auth-context";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPage } from "./pages/AdminPage";
import { CustomCursor } from "./components/custom-cursor";
import { ScrollProgress } from "./components/scroll-progress";
import { LoadingScreen } from "./components/loading-screen";
import { BackToTop } from "./components/back-to-top";
import { PerformanceOptimizer } from "./components/performance-optimizer";
import { ScrollEffects } from "./components/3d-scroll-effects";

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [use3D, setUse3D] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PerformanceOptimizer />
      <LoadingScreen isVisible={isLoading} />
      {!isLoading && (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          {use3D ? (
            <ScrollEffects>
              <Hero3D />
              <div className="relative z-10">
                <AboutSection />
                <SkillsSection />
                <ProjectsSection />
                <ContactSection />
                <Footer />
              </div>
            </ScrollEffects>
          ) : (
            <>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </>
          )}
        </div>
      )}

      {/* 3D Toggle Button */}
      <button
        onClick={() => setUse3D(!use3D)}
        className="fixed bottom-8 left-8 z-40 px-4 py-3 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {use3D ? "2D Mode" : "3D Mode"}
      </button>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/*"
              element={
                <>
                  <CustomCursor />
                  <ScrollProgress />
                  <BackToTop />
                  <AppContent />
                </>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
