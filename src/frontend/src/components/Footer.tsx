import { Link } from "@tanstack/react-router";
import { Heart, Leaf } from "lucide-react";
import { PROGRAM_CONFIGS, PROGRAM_ORDER } from "../lib/programConfig";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-20">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">
                Stress Relief Hub
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A calm space to connect, move, and support each other through
              life's pressures.
            </p>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Programs
            </h3>
            <ul className="space-y-2">
              {PROGRAM_ORDER.map((type) => {
                const cfg = PROGRAM_CONFIGS[type];
                return (
                  <li key={type}>
                    <Link
                      to="/programs/$type"
                      params={{ type }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <span>{cfg.emoji}</span>
                      {cfg.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/my-sessions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Sessions
                </Link>
              </li>
              <li>
                <Link
                  to="/meetup-activities"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mindfully Meetup
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {year}. Built with{" "}
            <Heart className="w-3 h-3 inline-block mx-0.5 text-destructive fill-current" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-muted-foreground/60">
            Find your calm. Connect with others.
          </p>
        </div>
      </div>
    </footer>
  );
}
