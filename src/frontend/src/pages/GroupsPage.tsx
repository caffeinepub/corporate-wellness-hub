import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { MessageSquare, Plus, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export const GROUPS = [
  {
    slug: "finance",
    emoji: "💰",
    name: "Finance",
    description: "Budgeting, investments, market trends and financial strategy",
    color: "border-l-emerald-500",
    accent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    members: 842,
    posts: 1200,
  },
  {
    slug: "hr",
    emoji: "👥",
    name: "HR",
    description: "People, policies, hiring strategies and workplace culture",
    color: "border-l-blue-500",
    accent: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    members: 671,
    posts: 987,
  },
  {
    slug: "marketing",
    emoji: "📣",
    name: "Marketing",
    description: "Campaigns, branding, growth strategies and audience insights",
    color: "border-l-orange-500",
    accent: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    members: 543,
    posts: 743,
  },
  {
    slug: "technology",
    emoji: "💻",
    name: "Technology",
    description: "Tools, software, IT infrastructure and digital innovation",
    color: "border-l-violet-500",
    accent: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    members: 1100,
    posts: 2300,
  },
  {
    slug: "music",
    emoji: "🎵",
    name: "Music",
    description: "Artists, playlists, concerts, genres and music discovery",
    color: "border-l-pink-500",
    accent: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
    members: 924,
    posts: 1800,
  },
  {
    slug: "movies",
    emoji: "🎬",
    name: "Movies",
    description: "Films, reviews, recommendations and streaming picks",
    color: "border-l-red-500",
    accent: "bg-red-500/10 text-red-700 dark:text-red-400",
    members: 1300,
    posts: 2700,
  },
  {
    slug: "sports",
    emoji: "⚽",
    name: "Sports",
    description: "Teams, matches, fitness goals and tournament discussions",
    color: "border-l-lime-500",
    accent: "bg-lime-500/10 text-lime-700 dark:text-lime-400",
    members: 988,
    posts: 1600,
  },
  {
    slug: "health-wellness",
    emoji: "🌿",
    name: "Health & Wellness",
    description: "Mental health, nutrition, workout tips and wellbeing",
    color: "border-l-teal-500",
    accent: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
    members: 756,
    posts: 1100,
  },
  {
    slug: "travel",
    emoji: "✈️",
    name: "Travel",
    description: "Destinations, travel tips, remote work and exploration",
    color: "border-l-sky-500",
    accent: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    members: 612,
    posts: 845,
  },
  {
    slug: "food-dining",
    emoji: "🍔",
    name: "Food & Dining",
    description: "Recipes, restaurants, cuisine culture and culinary arts",
    color: "border-l-amber-500",
    accent: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    members: 835,
    posts: 1400,
  },
  {
    slug: "career-growth",
    emoji: "📈",
    name: "Career Growth",
    description: "Skills, certifications, promotions and career development",
    color: "border-l-indigo-500",
    accent: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
    members: 489,
    posts: 678,
  },
  {
    slug: "leadership",
    emoji: "🧠",
    name: "Leadership",
    description: "Management, team building, executive strategy and vision",
    color: "border-l-purple-500",
    accent: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    members: 367,
    posts: 512,
  },
  {
    slug: "innovation",
    emoji: "💡",
    name: "Innovation",
    description: "Startups, disruptive ideas, R&D and emerging technologies",
    color: "border-l-yellow-500",
    accent: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    members: 421,
    posts: 589,
  },
  {
    slug: "culture-diversity",
    emoji: "🌍",
    name: "Culture & Diversity",
    description: "Inclusion, global perspectives and celebrating differences",
    color: "border-l-rose-500",
    accent: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    members: 298,
    posts: 387,
  },
  {
    slug: "general",
    emoji: "💬",
    name: "General",
    description: "Off-topic conversations, casual chat and random discussions",
    color: "border-l-slate-500",
    accent: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
    members: 1500,
    posts: 3200,
  },
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

const POPULAR_SLUGS = [
  "general",
  "movies",
  "technology",
  "music",
  "sports",
  "finance",
  "health-wellness",
  "food-dining",
];

function GroupCard({
  group,
  index,
}: { group: (typeof GROUPS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link to="/groups/$topic" params={{ topic: group.slug }}>
        <div
          className={`group relative bg-card border border-border/50 rounded-xl p-5 border-l-4 ${group.color} hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer h-full flex flex-col`}
          data-ocid={`groups.item.${index + 1}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{group.emoji}</span>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {group.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {formatCount(group.members)} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {formatCount(group.posts)} posts
              </span>
            </div>
            <Badge variant="secondary" className={`text-xs ${group.accent}`}>
              Join
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function GroupsPage() {
  const [search, setSearch] = useState("");

  const filtered = GROUPS.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()),
  );

  const popular = POPULAR_SLUGS.map(
    (slug) => GROUPS.find((g) => g.slug === slug)!,
  ).filter(Boolean);
  const filteredPopular = popular.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Users className="w-4 h-4" />
            Corporate Groups
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
            Connect &amp; Discuss
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Share ideas, ask questions and grow together with your colleagues
            across topics that matter.
          </p>
        </motion.div>

        {/* Search + New Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="groups.search_input"
              placeholder="Search groups by name or topic…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            data-ocid="groups.new_group_button"
            onClick={() =>
              toast.info("Coming soon for admins!", {
                description:
                  "Group creation will be available in the next release.",
              })
            }
            variant="outline"
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Group
          </Button>
        </div>
      </section>

      {/* Tabs */}
      <section className="container max-w-6xl mx-auto px-4">
        <Tabs defaultValue="all">
          <TabsList className="mb-6" data-ocid="groups.filter.tab">
            <TabsTrigger value="all" data-ocid="groups.all.tab">
              All Groups ({GROUPS.length})
            </TabsTrigger>
            <TabsTrigger value="popular" data-ocid="groups.popular.tab">
              Popular
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filtered.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground"
                data-ocid="groups.empty_state"
              >
                <p className="text-lg font-medium">No groups found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((g, i) => (
                  <GroupCard key={g.slug} group={g} index={i} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular">
            {filteredPopular.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground"
                data-ocid="groups.popular.empty_state"
              >
                <p className="text-lg font-medium">No groups found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPopular.map((g, i) => (
                  <GroupCard key={g.slug} group={g} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
