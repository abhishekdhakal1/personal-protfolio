import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "Home",       to: "/home" },
  { label: "About",      to: "/about" },
  { label: "Skills",     to: "/skills" },
  { label: "Projects",   to: "/projects" },
  { label: "Experience", to: "/experience" },
  { label: "Contact",    to: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActivePath = (to: string) => pathname === to || (to === "/home" && pathname === "/");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-sm font-bold text-primary-foreground font-heading">A</span>
              </div>
              <span className="font-heading font-semibold text-foreground hidden sm:block">Abhishek</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, to }) => {
                const isActive = isActivePath(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                <FileText size={14} />
                Resume
              </a>
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-foreground/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 z-[75] w-72 bg-background border-l border-border md:hidden flex flex-col p-6 pt-20"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, to }) => {
                  const isActive = isActivePath(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto pt-6 border-t border-border">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <FileText size={16} />
                  Download Resume
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

