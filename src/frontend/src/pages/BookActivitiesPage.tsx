import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, LogIn, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CreateSessionModal } from "../components/CreateSessionModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ProgramType } from "../hooks/useQueries";

type FilterTab = "all" | "meetup" | "social" | "task";

interface Activity {
  emoji: string;
  name: string;
  description: string;
  tags: string[];
  size: string;
  programType: ProgramType;
  programLabel: string;
  programColor: string;
}

const ACTIVITIES: Activity[] = [
  // Mindful Meetup
  {
    emoji: "☕",
    name: "Chai Pe Charcha",
    description:
      "Informal conversations over chai — share ideas, vent, laugh, or just unwind with colleagues",
    tags: ["Casual", "Open Discussion"],
    size: "4–10 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🎙️",
    name: "Open Mic Stories",
    description:
      "Share a 2-minute story, joke, or experience in a safe, supportive circle",
    tags: ["Creative", "Supportive"],
    size: "6–15 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🧩",
    name: "Icebreaker Circle",
    description:
      "Quick fun questions and activities to spark connections across teams",
    tags: ["Fun", "Team Bonding"],
    size: "5–20 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🌿",
    name: "Mindful Check-in",
    description:
      "A gentle round of sharing how you're really doing — no advice, just listening",
    tags: ["Mindful", "Safe Space"],
    size: "3–8 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🚶",
    name: "Walk & Talk",
    description:
      "Side-by-side strolls that make deep conversations feel easier and lighter",
    tags: ["Active", "1:1 or Small Group"],
    size: "2–6 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "📖",
    name: "Book / Podcast Club",
    description:
      "Discuss a chapter, episode, or idea that made you think differently",
    tags: ["Intellectual", "Curious"],
    size: "4–12 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🎨",
    name: "Doodle & Chill",
    description:
      "Freeform sketching together — no skill needed, just vibes and creative freedom",
    tags: ["Creative", "Relaxed"],
    size: "3–10 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🎵",
    name: "Playlist Battle",
    description:
      "Each person adds one song, then the group vibes together — discover new favorites",
    tags: ["Fun", "Casual"],
    size: "4–12 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🌅",
    name: "Sunrise / Sunset Watch",
    description:
      "Gather to watch the sky change colors as a team — a shared moment of quiet wonder",
    tags: ["Mindful", "Outdoor"],
    size: "Any",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🍜",
    name: "Lunch Roulette",
    description:
      "Random pairing for lunch with a new colleague every week — grow your circle one meal at a time",
    tags: ["Social", "1:1 or Small Group"],
    size: "2 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🎲",
    name: "Board Game Hour",
    description:
      "Strategy and laughs with classic or modern board games — friendly competition that bonds",
    tags: ["Fun", "Team Bonding"],
    size: "4–8 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🌱",
    name: "Gratitude Circle",
    description:
      "Each person shares one thing they're grateful for today — small moments of joy, amplified",
    tags: ["Mindful", "Safe Space"],
    size: "3–10 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🤸",
    name: "Stretch & Breathe",
    description:
      "A gentle 10-minute group stretch and breathing break to reset during a busy day",
    tags: ["Active", "Mindful"],
    size: "Any",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    emoji: "🍕",
    name: "Friday Unwinding",
    description:
      "End-of-week informal hangout to celebrate small wins, share laughs, and recharge",
    tags: ["Casual", "Supportive"],
    size: "5–20 people",
    programType: ProgramType.meetup,
    programLabel: "Mindful Meetup",
    programColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  // Social Gathering
  {
    emoji: "🍕",
    name: "Pizza & Chill Night",
    description:
      "A relaxed evening with great food and even better company — unwind and connect over slices.",
    tags: ["Casual", "Evening"],
    size: "6–20 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🎭",
    name: "Improv Comedy Night",
    description:
      "Team improvisation games that build trust, quick thinking, and genuine laughter.",
    tags: ["Fun", "Interactive"],
    size: "8–20 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🌿",
    name: "Terrace Hangout",
    description:
      "Fresh air, great views, and open conversations on the terrace — a breath of fresh energy.",
    tags: ["Outdoor", "Relaxed"],
    size: "4–15 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🎮",
    name: "Game Tournament",
    description:
      "Competitive but fun — bracket-style gaming tournament that unites teams and creates stories.",
    tags: ["Fun", "Team Bonding"],
    size: "8–24 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🎨",
    name: "Paint & Sip",
    description:
      "Guided painting session with your beverage of choice — creativity and calm in equal measure.",
    tags: ["Creative", "Relaxed"],
    size: "4–16 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🍳",
    name: "Potluck Cook-Off",
    description:
      "Everyone brings a homemade dish — discover the cultures and stories behind each recipe.",
    tags: ["Cultural", "Social"],
    size: "8–25 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🏕️",
    name: "Bonfire Circle",
    description:
      "Stories, warmth, and togetherness around a fire — the original team bonding ritual.",
    tags: ["Outdoor", "Evening"],
    size: "6–20 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "📸",
    name: "Photo Walk",
    description:
      "Explore the neighbourhood with cameras out — capture moments and see through new eyes.",
    tags: ["Outdoor", "Creative"],
    size: "4–12 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🧩",
    name: "Puzzle Relay",
    description:
      "Teams race to complete puzzle sections and hand off — collaboration with a friendly competitive twist.",
    tags: ["Team Bonding", "Indoor"],
    size: "6–20 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🎶",
    name: "Karaoke Bash",
    description:
      "Bold voices, terrible solos, and unforgettable memories — the perfect stress-buster.",
    tags: ["Fun", "Evening"],
    size: "8–30 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🌸",
    name: "Flower Arranging",
    description:
      "Meditative and creative — learn floral design while enjoying quiet, focused togetherness.",
    tags: ["Creative", "Relaxed"],
    size: "4–12 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    emoji: "🎪",
    name: "Talent Show",
    description:
      "From magic tricks to poetry readings — a stage for everyone's hidden talents and big personalities.",
    tags: ["Fun", "Interactive"],
    size: "10–50 people",
    programType: ProgramType.socialGathering,
    programLabel: "Social Gathering",
    programColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  // Task Sharing
  {
    emoji: "🗺️",
    name: "Project Kick-off Mapping",
    description:
      "Visualise the full project together — align on goals, owners, and milestones from day one.",
    tags: ["Planning", "Team"],
    size: "3–10 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🔁",
    name: "Weekly Responsibility Shuffle",
    description:
      "Rotate recurring tasks across the team to prevent burnout and build shared ownership.",
    tags: ["Routine", "Balanced"],
    size: "4–12 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🤝",
    name: "Buddy Task System",
    description:
      "Pair up to tackle a challenge together — accountability and collaboration in its simplest form.",
    tags: ["Collaborative", "1:1"],
    size: "2 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🧹",
    name: "Backlog Blitz",
    description:
      "Clear the backlog together in one focused session — divide, conquer, and celebrate the clean slate.",
    tags: ["Focused", "Team"],
    size: "3–8 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "📋",
    name: "Skill-Match Assignment",
    description:
      "Assign tasks based on individual strengths — the right person for the right job, every time.",
    tags: ["Growth", "Planning"],
    size: "Any",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "⏱️",
    name: "Time-Box Sprint",
    description:
      "60-minute focused sprint with a clear goal — beat the clock and boost collective momentum.",
    tags: ["Focused", "Energising"],
    size: "4–15 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🎯",
    name: "Priority Poker",
    description:
      "Use planning poker to democratically decide what matters most — fast, fair, and engaging.",
    tags: ["Decision-Making", "Team"],
    size: "4–12 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🧑‍🏫",
    name: "Teach-to-Help",
    description:
      "If you know it, teach it — peer-to-peer skill sharing that grows the whole team together.",
    tags: ["Learning", "Collaborative"],
    size: "2–8 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🌀",
    name: "Async Handoff Session",
    description:
      "Structured async handoffs to keep remote workflows clean, documented, and bottleneck-free.",
    tags: ["Remote-Friendly", "Handoff"],
    size: "2–5 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "📊",
    name: "Workload Check-in",
    description:
      "An honest round-table on capacity — redistribute fairly before burnout quietly sets in.",
    tags: ["Wellbeing", "Routine"],
    size: "3–10 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🗓️",
    name: "Sprint Retrospective",
    description:
      "Celebrate wins, flag blockers, and improve as a team — the ritual that powers continuous growth.",
    tags: ["Reflective", "Team"],
    size: "3–15 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    emoji: "🎁",
    name: "Task Appreciation Round",
    description:
      "Acknowledge contributions publicly — recognition fuels motivation and strengthens team culture.",
    tags: ["Celebratory", "Team"],
    size: "4–20 people",
    programType: ProgramType.taskAllocation,
    programLabel: "Task Sharing",
    programColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
];

const PROGRAM_BADGE_COLORS: Record<string, string> = {
  meetup:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  social:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  task: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

function getProgramKey(pt: ProgramType): string {
  if (pt === ProgramType.meetup) return "meetup";
  if (pt === ProgramType.socialGathering) return "social";
  if (pt === ProgramType.taskAllocation) return "task";
  return "meetup";
}

export function BookActivitiesPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalActivity, setModalActivity] = useState<Activity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const meetupCount = ACTIVITIES.filter(
    (a) => a.programType === ProgramType.meetup,
  ).length;
  const socialCount = ACTIVITIES.filter(
    (a) => a.programType === ProgramType.socialGathering,
  ).length;
  const taskCount = ACTIVITIES.filter(
    (a) => a.programType === ProgramType.taskAllocation,
  ).length;

  const filtered = ACTIVITIES.filter((a) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "meetup" && a.programType === ProgramType.meetup) ||
      (filter === "social" && a.programType === ProgramType.socialGathering) ||
      (filter === "task" && a.programType === ProgramType.taskAllocation);
    const matchesSearch =
      search.trim() === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleBook = (activity: Activity) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setModalActivity(activity);
    setModalOpen(true);
  };

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <CalendarCheck className="w-4 h-4" />
              Corporate Wellness Activities
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Book an Activity
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Browse all {ACTIVITIES.length} curated wellness activities from
              our three programmes. Sign in to create a session and invite your
              team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Search */}
      <section className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border/50 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterTab)}
            className="w-full sm:w-auto"
          >
            <TabsList
              className="grid grid-cols-4 w-full sm:w-auto"
              data-ocid="book.tab"
            >
              <TabsTrigger value="all" data-ocid="book.tab">
                All ({ACTIVITIES.length})
              </TabsTrigger>
              <TabsTrigger value="meetup" data-ocid="book.tab">
                Meetup ({meetupCount})
              </TabsTrigger>
              <TabsTrigger value="social" data-ocid="book.tab">
                Social ({socialCount})
              </TabsTrigger>
              <TabsTrigger value="task" data-ocid="book.tab">
                Tasks ({taskCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="book.search_input"
            />
          </div>
        </div>
      </section>

      {/* Activity Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="book.empty_state"
          >
            <p className="text-lg font-medium">
              No activities match your search.
            </p>
            <p className="text-sm mt-1">
              Try a different keyword or clear your filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((activity, i) => (
              <ActivityCard
                key={activity.name}
                activity={activity}
                index={i + 1}
                isAuthenticated={isAuthenticated}
                onBook={() => handleBook(activity)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Hidden modal triggered programmatically */}
      {modalActivity && (
        <CreateSessionModal
          key={modalActivity.name}
          defaultType={modalActivity.programType}
          defaultTitle={modalActivity.name}
          trigger={
            <button
              type="button"
              style={{ display: "none" }}
              ref={(el) => {
                if (el && modalOpen) {
                  el.click();
                  setModalOpen(false);
                }
              }}
            />
          }
        />
      )}
    </main>
  );
}

function ActivityCard({
  activity,
  index,
  isAuthenticated,
  onBook,
}: {
  activity: Activity;
  index: number;
  isAuthenticated: boolean;
  onBook: () => void;
}) {
  const programKey = getProgramKey(activity.programType);
  const badgeClass = PROGRAM_BADGE_COLORS[programKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.5) }}
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
      data-ocid={`book.item.${index}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl">{activity.emoji}</span>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeClass}`}
        >
          {activity.programLabel}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-base leading-snug">
          {activity.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed line-clamp-3">
          {activity.description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="w-3.5 h-3.5 shrink-0" />
        <span>{activity.size}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {activity.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-auto pt-1">
        {isAuthenticated ? (
          <CreateSessionModal
            defaultType={activity.programType}
            defaultTitle={activity.name}
            trigger={
              <Button
                className="w-full"
                size="sm"
                data-ocid={`book.primary_button.${index}`}
              >
                <CalendarCheck className="w-4 h-4 mr-1.5" />
                Book Activity
              </Button>
            }
          />
        ) : (
          <Button
            className="w-full"
            size="sm"
            variant="outline"
            onClick={onBook}
            data-ocid={`book.primary_button.${index}`}
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            Sign in to Book
          </Button>
        )}
      </div>
    </motion.div>
  );
}
