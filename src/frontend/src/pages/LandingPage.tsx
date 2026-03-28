import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Shield, Sparkles, Users } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { StressBanner } from "../components/StressBanner";
import { ProgramType } from "../hooks/useQueries";
import { PROGRAM_CONFIGS, PROGRAM_ORDER } from "../lib/programConfig";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  { icon: Users, value: "2,400+", label: "Community members" },
  { icon: Sparkles, value: "180+", label: "Weekly sessions" },
  { icon: Heart, value: "94%", label: "Satisfaction rate" },
  { icon: Shield, value: "100%", label: "Safe & confidential" },
];

const EXERCISE_SPORT_PILLS = [
  { emoji: "🏏", name: "Box Cricket" },
  { emoji: "🏓", name: "Pickleball" },
  { emoji: "🏸", name: "Badminton" },
  { emoji: "🎾", name: "Tennis" },
  { emoji: "🧘", name: "Yoga" },
];

// Which program types get dedicated activity pages
const ACTIVITY_PAGE_ROUTES: Partial<Record<ProgramType, string>> = {
  [ProgramType.meetup]: "/meetup-activities",
  [ProgramType.socialGathering]: "/social-activities",
  [ProgramType.taskAllocation]: "/task-activities",
};

export function LandingPage() {
  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background" />

        <div className="relative container max-w-6xl mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/70 text-accent-foreground text-xs font-medium mb-6 border border-accent-foreground/10">
                <Sparkles className="w-3.5 h-3.5" />
                Wellness programs for real life
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 text-balance"
            >
              Find your calm.{" "}
              <span className="text-primary italic">Connect</span> with others.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto"
            >
              Stress Relief Hub brings people together through mindful programs
              — from gentle meetups to collaborative task management. You don't
              have to navigate stress alone.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link to="/meetup-activities">
                <Button
                  size="lg"
                  data-ocid="hero.primary_button"
                  className="rounded-full px-7 text-base gap-2 shadow-lg"
                >
                  Explore Programs
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/my-sessions">
                <Button
                  size="lg"
                  variant="outline"
                  data-ocid="hero.secondary_button"
                  className="rounded-full px-7 text-base"
                >
                  My Sessions
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-14 max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src="/assets/generated/hero-wellness.dim_1200x600.jpg"
                alt="Serene wellness atmosphere"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="py-12 border-y border-border/40 bg-muted/20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/60 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="font-display font-bold text-2xl text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stress Banner ───────────────────────────────────── */}
      <StressBanner />

      {/* ─── Programs Grid ────────────────────────────────────── */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose your path to calm
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four thoughtfully designed programs — from mindful meetups and
              social gatherings to movement and collaborative task sharing —
              helping you reduce stress and build real connections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
            {PROGRAM_ORDER.map((type, i) => {
              const cfg = PROGRAM_CONFIGS[type];
              const isExercise = type === ProgramType.exercise;
              const activityRoute = ACTIVITY_PAGE_ROUTES[type];

              const cardContent = (
                <div
                  data-ocid={`programs.${type}.card`}
                  className="group relative bg-card rounded-2xl border border-border hover:border-primary/30 shadow-glow hover:shadow-xl transition-all duration-300 overflow-hidden p-6 cursor-pointer h-full"
                >
                  <div
                    className={`absolute inset-0 ${cfg.bgClass} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="relative">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${cfg.bgClass} mb-4 text-2xl shadow-sm`}
                    >
                      {cfg.emoji}
                    </div>
                    <h3
                      className={`font-display font-bold text-xl text-foreground mb-1.5 group-hover:${cfg.textClass} transition-colors`}
                    >
                      {cfg.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {cfg.description}
                    </p>

                    {/* Sport pills for exercise card */}
                    {isExercise && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {EXERCISE_SPORT_PILLS.map((sport) => (
                          <span
                            key={sport.name}
                            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}
                          >
                            {sport.emoji} {sport.name}
                          </span>
                        ))}
                        <span
                          className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.badgeClass} opacity-70`}
                        >
                          +2 more
                        </span>
                      </div>
                    )}

                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.textClass}`}
                    >
                      <span className="italic">{cfg.tagline}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                >
                  {activityRoute ? (
                    <Link to={activityRoute as never}>{cardContent}</Link>
                  ) : (
                    <Link to="/programs/$type" params={{ type }}>
                      {cardContent}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-primary rounded-3xl p-10 md:p-14 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to feel better together?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
                Join thousands of people who have found their community and
                their calm on Stress Relief Hub.
              </p>
              <Link to="/meetup-activities">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-8"
                  data-ocid="cta.primary_button"
                >
                  Browse All Programs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
