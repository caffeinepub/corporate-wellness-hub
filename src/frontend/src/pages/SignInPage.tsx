import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  CalendarCheck,
  Loader2,
  LogIn,
  MessageCircle,
  Shield,
  Stethoscope,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Access Wellness Sessions",
    desc: "Join or create mindful meetups, social gatherings, and exercise sessions with your team.",
  },
  {
    icon: Stethoscope,
    title: "Book Psychologists",
    desc: "Schedule confidential one-on-one sessions with licensed mental health professionals.",
  },
  {
    icon: BarChart2,
    title: "Track Your Progress",
    desc: "Monitor participation, session history, and wellness milestones on your personal dashboard.",
  },
  {
    icon: MessageCircle,
    title: "Join Anonymous Discussions",
    desc: "Share thoughts and challenges freely under auto-generated aliases in the discussion board.",
  },
];

export function SignInPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      void navigate({ to: "/dashboard" });
    }
  }, [identity, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Hero */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Secure & Private
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-4">
              Your wellness journey{" "}
              <span className="text-primary">starts here.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Sign in to unlock all four wellness programs, book psychologist
              sessions, track your progress, and connect with your team
              anonymously.
            </p>

            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <b.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {b.title}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Sign-in card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="bg-card border border-border rounded-3xl p-8 shadow-glow">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground text-sm">
                  Sign in with Internet Identity — no password needed.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full rounded-xl text-base font-semibold py-6"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                data-ocid="signin.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In with Internet Identity
                  </>
                )}
              </Button>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Internet Identity is a secure, passwordless authentication
                  system built on the Internet Computer. No data is shared with
                  third parties.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  "256-bit encryption",
                  "No password",
                  "Private by default",
                ].map((item) => (
                  <div
                    key={item}
                    className="text-center bg-muted/50 rounded-xl py-2.5 px-1"
                  >
                    <p className="text-xs text-muted-foreground font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
