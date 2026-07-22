import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./contexts/theme-context";
import { HomePage } from "./pages/HomePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPage } from "./pages/AdminPage";
import { LoadingScreen } from "./components/loading-screen";
import { BackToTop } from "./components/back-to-top";
import { ScrollProgress } from "./components/scroll-progress";

function PortfolioLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>
      {!isLoading && (
        <>
          <ScrollProgress />
          <BackToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </>
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


