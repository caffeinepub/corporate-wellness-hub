import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ExternalLink,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useAdminStats, useAllUserProfilesAdmin } from "../hooks/useQueries";
import type { UserProfileEntry } from "../hooks/useQueries";

const PROGRAM_COLORS: Record<string, string> = {
  meetup: "bg-emerald-500",
  socialGathering: "bg-blue-500",
  exercise: "bg-orange-500",
  taskAllocation: "bg-purple-500",
  boxCricket: "bg-yellow-500",
  badminton: "bg-pink-500",
  tennis: "bg-cyan-500",
  pickleball: "bg-red-500",
};

const PROGRAM_LABELS: Record<string, string> = {
  meetup: "Mindfully Meetup",
  socialGathering: "Social Gathering",
  exercise: "Movement & Exercise",
  taskAllocation: "Task Allocation",
  boxCricket: "Box Cricket",
  badminton: "Badminton",
  tennis: "Tennis",
  pickleball: "Pickleball",
};

const STAT_SKELETON_KEYS = ["sk-stat-1", "sk-stat-2", "sk-stat-3", "sk-stat-4"];
const CHART_SKELETON_KEYS = [
  "sk-chart-1",
  "sk-chart-2",
  "sk-chart-3",
  "sk-chart-4",
];
const TABLE_SKELETON_KEYS = [
  "sk-row-1",
  "sk-row-2",
  "sk-row-3",
  "sk-row-4",
  "sk-row-5",
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">
                {label}
              </p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {sub && (
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              )}
            </div>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AdminDashboardView() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAllUserProfilesAdmin();

  const totalUsers = stats ? Number(stats.totalUsers) : 0;
  const totalSessions = stats ? Number(stats.totalSessions) : 0;
  const totalTasks = stats ? Number(stats.totalTasks) : 0;
  const completedTasks = stats ? Number(stats.completedTasks) : 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const sessionsByType = stats?.sessionsByType ?? [];
  const maxCount = sessionsByType.reduce(
    (m, [, c]) => Math.max(m, Number(c)),
    1,
  );

  const sortedUsers: UserProfileEntry[] = [...(users ?? [])].sort((a, b) => {
    const aTotal = Number(a.sessionsCreated) + Number(a.sessionsJoined);
    const bTotal = Number(b.sessionsCreated) + Number(b.sessionsJoined);
    return bTotal - aTotal;
  });

  return (
    <main
      className="min-h-screen bg-background pt-24 pb-16 px-4"
      data-ocid="admin.page"
    >
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl p-8 border border-emerald-500/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    Admin Dashboard
                  </h1>
                  <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5">
                    Admin
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Platform overview and employee activity
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            STAT_SKELETON_KEYS.map((k) => (
              <Card key={k}>
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard
                icon={Users}
                label="Total Employees"
                value={totalUsers}
                sub="Registered users"
                color="bg-emerald-500/15 text-emerald-600"
                delay={0.1}
              />
              <StatCard
                icon={Activity}
                label="Total Sessions"
                value={totalSessions}
                sub="Across all programs"
                color="bg-blue-500/15 text-blue-600"
                delay={0.15}
              />
              <StatCard
                icon={ClipboardList}
                label="Total Tasks"
                value={totalTasks}
                sub={`${completedTasks} completed`}
                color="bg-purple-500/15 text-purple-600"
                delay={0.2}
              />
              <StatCard
                icon={CheckCircle2}
                label="Task Completion"
                value={`${completionRate}%`}
                sub={`${completedTasks} of ${totalTasks} tasks`}
                color="bg-amber-500/15 text-amber-600"
                delay={0.25}
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Sessions by Program chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Sessions by Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statsLoading ? (
                  CHART_SKELETON_KEYS.map((k) => (
                    <div key={k} className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))
                ) : sessionsByType.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground text-center py-6"
                    data-ocid="admin.empty_state"
                  >
                    No session data yet
                  </p>
                ) : (
                  sessionsByType.map(([type, count]) => {
                    const label = PROGRAM_LABELS[type] ?? type;
                    const color = PROGRAM_COLORS[type] ?? "bg-gray-500";
                    const pct = Math.round((Number(count) / maxCount) * 100);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-foreground">
                            {label}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {count.toString()}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              delay: 0.4,
                              duration: 0.6,
                              ease: "easeOut",
                            }}
                            className={`h-full rounded-full ${color}`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Admin Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  {
                    icon: Activity,
                    label: "View All Sessions",
                    to: "/programs/$type" as const,
                    params: { type: "meetup" },
                    color: "bg-emerald-500/10 text-emerald-600",
                    ocid: "admin.sessions_link",
                  },
                  {
                    icon: CreditCard,
                    label: "Manage Memberships",
                    to: "/membership" as const,
                    params: undefined,
                    color: "bg-amber-500/10 text-amber-600",
                    ocid: "admin.membership_link",
                  },
                  {
                    icon: Stethoscope,
                    label: "View Psychologists",
                    to: "/psychologists" as const,
                    params: undefined,
                    color: "bg-blue-500/10 text-blue-600",
                    ocid: "admin.psychologists_link",
                  },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    params={action.params}
                    data-ocid={action.ocid}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}
                    >
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex-1">
                      {action.label}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Employee Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-primary" />
                Employee Activity
                {!usersLoading && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {sortedUsers.length} registered
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {usersLoading ? (
                <div className="p-6 space-y-3" data-ocid="admin.loading_state">
                  {TABLE_SKELETON_KEYS.map((k) => (
                    <Skeleton key={k} className="h-10 w-full" />
                  ))}
                </div>
              ) : sortedUsers.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">
                    No employees registered yet
                  </p>
                  <p className="text-xs mt-1">
                    Users will appear here once they sign in
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Employee</TableHead>
                        <TableHead className="text-center">
                          Sessions Created
                        </TableHead>
                        <TableHead className="text-center">
                          Sessions Joined
                        </TableHead>
                        <TableHead className="text-center pr-6">
                          Total Participation
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedUsers.map((user, i) => {
                        const total =
                          Number(user.sessionsCreated) +
                          Number(user.sessionsJoined);
                        const userInitials = user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : "?";
                        return (
                          <TableRow
                            key={user.principal.toString()}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                                  {userInitials}
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">
                                    {user.name || "Anonymous"}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                                    {user.principal.toString().slice(0, 12)}…
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="text-xs">
                                {user.sessionsCreated.toString()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="text-xs">
                                {user.sessionsJoined.toString()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center pr-6">
                              <Badge
                                className={`text-xs ${
                                  total > 5
                                    ? "bg-emerald-500/15 text-emerald-700 border-emerald-200"
                                    : total > 2
                                      ? "bg-blue-500/15 text-blue-700 border-blue-200"
                                      : "bg-muted text-muted-foreground"
                                }`}
                                variant="outline"
                              >
                                {total}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
