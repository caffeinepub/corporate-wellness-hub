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
