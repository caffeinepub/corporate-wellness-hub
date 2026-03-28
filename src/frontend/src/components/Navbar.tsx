import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ChevronDown,
  Leaf,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { PROGRAM_CONFIGS, PROGRAM_ORDER } from "../lib/programConfig";

export function Navbar() {
  const location = useLocation();
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border/50 shadow-glow">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              data-ocid="nav.home_link"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-lg text-foreground hidden sm:block">
                Stress Relief Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                data-ocid="nav.home_link"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Home
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    data-ocid="nav.programs_link"
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/programs")
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Programs
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {PROGRAM_ORDER.map((type) => {
                    const cfg = PROGRAM_CONFIGS[type];
                    return (
                      <DropdownMenuItem key={type} asChild>
                        <Link
                          to="/programs/$type"
                          params={{ type }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-base">{cfg.emoji}</span>
                          <span>{cfg.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/about"
                data-ocid="nav.about_link"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                About
              </Link>

              <Link
                to="/contact"
                data-ocid="nav.contact_link"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/contact")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Contact
              </Link>

              <Link
                to="/careers"
                data-ocid="nav.careers_link"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/careers")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Careers
              </Link>

              <Link
                to="/membership"
                data-ocid="nav.membership_link"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/membership")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Membership
              </Link>

              <Link
                to="/psychologists"
                data-ocid="nav.psychologists_link"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/psychologists")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Psychologists
              </Link>

              <Link
                to="/coming-soon"
                data-ocid="nav.coming_soon_link"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/coming-soon")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Co-Work Spaces
              </Link>

              {isAuthenticated && (
                <Link
                  to="/my-sessions"
                  data-ocid="nav.my_sessions_link"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/my-sessions")
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  My Sessions
                </Link>
              )}
            </div>

            {/* Auth + Mobile toggle */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-xs font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span className="max-w-[80px] truncate">
                      {identity.getPrincipal().toString().slice(0, 8)}…
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clear}
                    data-ocid="nav.login_button"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn || isInitializing}
                  data-ocid="nav.login_button"
                  className="hidden md:flex"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  {isLoggingIn ? "Connecting…" : "Sign in"}
                </Button>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50"
            >
              <div className="container px-4 py-4 space-y-1">
                <Link
                  to="/"
                  data-ocid="nav.home_link"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  Programs
                </div>
                {PROGRAM_ORDER.map((type) => {
                  const cfg = PROGRAM_CONFIGS[type];
                  return (
                    <Link
                      key={type}
                      to="/programs/$type"
                      params={{ type }}
                      data-ocid="nav.programs_link"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{cfg.emoji}</span>
                      {cfg.label}
                    </Link>
                  );
                })}
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  Company
                </div>
                <Link
                  to="/about"
                  data-ocid="nav.about_link"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  data-ocid="nav.contact_link"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact Us
                </Link>
                <Link
                  to="/careers"
                  data-ocid="nav.careers_link"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Careers
                </Link>
                <Link
                  to="/membership"
                  data-ocid="nav.membership_link"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Membership
                </Link>
                <Link
                  to="/psychologists"
                  data-ocid="nav.psychologists_link"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Stethoscope className="w-4 h-4" />
                  Psychologists
                </Link>
                <Link
                  to="/coming-soon"
                  data-ocid="nav.coming_soon_link"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  Co-Work Spaces
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-sessions"
                    data-ocid="nav.my_sessions_link"
                    className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Sessions
                  </Link>
                )}
                <div className="pt-2 border-t border-border/50">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        clear();
                        setMobileOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        login();
                        setMobileOpen(false);
                      }}
                      disabled={isLoggingIn || isInitializing}
                      data-ocid="nav.login_button"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {isLoggingIn ? "Connecting…" : "Sign in"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
