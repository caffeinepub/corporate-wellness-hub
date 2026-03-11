import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { Inbox, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { CreateSessionModal } from "../components/CreateSessionModal";
import { SessionCard, SessionCardSkeleton } from "../components/SessionCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSessionsByType } from "../hooks/useQueries";
import { ProgramType } from "../hooks/useQueries";
import { getProgramConfig, getProgramTypeFromPath } from "../lib/programConfig";

const EXERCISE_SPORTS = [
  {
    emoji: "🏏",
    name: "Box Cricket",
    description: "Fast-paced team cricket in a compact arena",
    levels: ["Beginner", "Intermediate", "Advanced"],
    formats: ["Indoor"],
  },
  {
    emoji: "🏓",
    name: "Pickleball",
    description: "Easy to learn, endlessly fun racket sport",
    levels: ["Beginner", "Intermediate"],
    formats: ["Indoor", "Outdoor"],
  },
  {
    emoji: "🏸",
    name: "Badminton",
    description: "Full-body workout with rapid rallies",
    levels: ["Beginner", "Intermediate", "Advanced"],
    formats: ["Indoor"],
  },
  {
    emoji: "🎾",
    name: "Tennis",
    description: "Serve, volley, and unwind on the court",
    levels: ["Beginner", "Intermediate", "Advanced"],
    formats: ["Outdoor"],
  },
  {
    emoji: "🧘",
    name: "Yoga",
    description: "Mindful movement for stress relief",
    levels: ["Beginner", "Intermediate"],
    formats: ["Indoor"],
  },
  {
    emoji: "🏃",
    name: "Running",
    description: "Group runs to clear the mind",
    levels: ["Beginner", "Intermediate", "Advanced"],
    formats: ["Outdoor"],
  },
  {
    emoji: "💪",
    name: "Group Workout",
    description: "HIIT and strength sessions together",
    levels: ["Beginner", "Intermediate"],
    formats: ["Indoor"],
  },
];

const LEVEL_STYLES: Record<string, string> = {
  Beginner:
    "bg-[oklch(0.92_0.08_145)] text-[oklch(0.30_0.12_145)] border-[oklch(0.76_0.10_145)]",
  Intermediate:
    "bg-[oklch(0.94_0.09_85)] text-[oklch(0.38_0.14_75)] border-[oklch(0.82_0.11_80)]",
  Advanced:
    "bg-[oklch(0.93_0.08_50)] text-[oklch(0.38_0.14_40)] border-[oklch(0.78_0.12_48)]",
};

const FORMAT_STYLES: Record<string, string> = {
  Indoor:
    "bg-[oklch(0.92_0.05_230)] text-[oklch(0.34_0.12_230)] border-[oklch(0.77_0.09_230)]",
  Outdoor:
    "bg-[oklch(0.92_0.05_155)] text-[oklch(0.32_0.12_155)] border-[oklch(0.75_0.08_155)]",
};

function SportCategoriesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-xl font-bold text-foreground">
          Sport Categories
        </h2>
        <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/50">
          {EXERCISE_SPORTS.length} activities
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {EXERCISE_SPORTS.map((sport, i) => (
          <motion.div
            key={sport.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            data-ocid={`exercise.sport.item.${i + 1}`}
            className="bg-card rounded-2xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-250"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl leading-none mt-0.5">
                {sport.emoji}
              </span>
              <div>
                <h3 className="font-semibold text-sm text-foreground leading-tight">
                  {sport.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {sport.description}
                </p>
              </div>
            </div>

            {/* Skill level badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              {sport.levels.map((level) => (
                <span
                  key={level}
                  className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${LEVEL_STYLES[level]}`}
                >
                  {level}
                </span>
              ))}
            </div>

            {/* Format tags */}
            <div className="flex flex-wrap gap-1">
              {sport.formats.map((fmt) => (
                <span
                  key={fmt}
                  className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${FORMAT_STYLES[fmt]}`}
                >
                  {fmt === "Indoor" ? "🏢" : "🌿"} {fmt}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export function ProgramsPage() {
  const { type } = useParams({ from: "/programs/$type" });
  const programType = getProgramTypeFromPath(type) ?? ProgramType.meetup;
  const cfg = getProgramConfig(programType);

  const { data: sessions, isLoading, isError } = useSessionsByType(programType);
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${cfg.bgClass} text-3xl mb-4 shadow-sm`}
          >
            {cfg.emoji}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {cfg.label}
              </h1>
              <p className="text-muted-foreground max-w-xl">
                {cfg.description}
              </p>
            </div>

            {isAuthenticated ? (
              <CreateSessionModal defaultType={programType} />
            ) : (
              <Button
                variant="outline"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login_button"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign in to create
              </Button>
            )}
          </div>
        </motion.div>

        {/* Sport Categories — only for exercise */}
        {programType === ProgramType.exercise && <SportCategoriesSection />}

        {/* Sessions */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="session.loading_state"
          >
            <SessionCardSkeleton key="sk1" />
            <SessionCardSkeleton key="sk2" />
            <SessionCardSkeleton key="sk3" />
            <SessionCardSkeleton key="sk4" />
            <SessionCardSkeleton key="sk5" />
            <SessionCardSkeleton key="sk6" />
          </div>
        ) : isError ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="session.error_state"
          >
            Failed to load sessions. Please try again.
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
            data-ocid="session.empty_state"
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${cfg.bgClass} text-4xl mx-auto mb-4`}
            >
              <Inbox className={`w-7 h-7 ${cfg.textClass}`} />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No sessions yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Be the first to create a {cfg.label.toLowerCase()} session and
              invite others to join.
            </p>
            {isAuthenticated ? (
              <CreateSessionModal defaultType={programType} />
            ) : (
              <Button onClick={login} disabled={isLoggingIn}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign in to create a session
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5">
              <Badge variant="secondary" className="text-xs">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session, i) => (
                <SessionCard
                  key={session.id.toString()}
                  session={session}
                  index={i}
                  showJoinLeave
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
