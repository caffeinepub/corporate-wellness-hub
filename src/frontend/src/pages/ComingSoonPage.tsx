import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, Clock, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SPACES = [
  {
    id: "mountain",
    title: "Mountain Peak Office",
    subtitle: "Work above the clouds",
    mood: "Serene & Focused",
    tag: "Nature",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description:
      "Crisp alpine air, snow-capped peaks, and panoramic floor-to-ceiling windows. Perfect for deep focus and big-picture thinking.",
    image: "/assets/generated/cowork-mountain.dim_800x500.jpg",
    vibe: ["🏔️ High altitude", "❄️ Crisp air", "🌄 Sunrise views"],
    available: "Q3 2025",
    gradient: "from-sky-900/80 to-slate-900/60",
  },
  {
    id: "beach",
    title: "Beach Breeze Studio",
    subtitle: "Waves as your background music",
    mood: "Relaxed & Creative",
    tag: "Coastal",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    description:
      "Open breezy interiors, turquoise ocean views, and the gentle sound of waves. Where creativity flows as freely as the tide.",
    image: "/assets/generated/cowork-beach.dim_800x500.jpg",
    vibe: ["🌊 Ocean breeze", "🏖️ Sandy toes", "🌅 Sunset sessions"],
    available: "Q3 2025",
    gradient: "from-cyan-900/80 to-blue-900/60",
  },
  {
    id: "desert",
    title: "Desert Oasis Hub",
    subtitle: "Silence that sharpens the mind",
    mood: "Grounded & Inspired",
    tag: "Desert",
    tagColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    description:
      "Terracotta walls, golden sand dunes, and a vast open sky. The stillness of the desert unlocks clarity like nothing else.",
    image: "/assets/generated/cowork-desert.dim_800x500.jpg",
    vibe: ["🌵 Desert silence", "🌇 Golden hour", "🔥 Warm energy"],
    available: "Q4 2025",
    gradient: "from-orange-900/80 to-amber-900/60",
  },
  {
    id: "gaming",
    title: "PlayZone Co-Work",
    subtitle: "Work hard, play harder",
    mood: "Energetic & Fun",
    tag: "Gaming",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description:
      "RGB lighting, gaming chairs, console stations, and a vibe that makes every sprint feel like leveling up. For teams that ship and celebrate.",
    image: "/assets/generated/cowork-gaming.dim_800x500.jpg",
    vibe: ["🎮 Gaming corners", "💡 RGB lights", "🏆 Win streaks"],
    available: "Q2 2025",
    gradient: "from-purple-900/80 to-violet-900/60",
  },
  {
    id: "forest",
    title: "Forest Canopy Treehouse",
    subtitle: "Rooted in nature, reaching the sky",
    mood: "Calm & Mindful",
    tag: "Forest",
    tagColor: "bg-green-500/20 text-green-300 border-green-500/30",
    description:
      "Nestled among ancient trees with moss walls, hanging plants, and filtered sunlight. The ultimate reset for an overstimulated mind.",
    image: "/assets/generated/cowork-forest.dim_800x500.jpg",
    vibe: ["🌿 Living walls", "🐦 Bird songs", "🍃 Fresh oxygen"],
    available: "Q4 2025",
    gradient: "from-green-900/80 to-emerald-900/60",
  },
  {
    id: "space",
    title: "Orbital Command Station",
    subtitle: "Think at the speed of light",
    mood: "Visionary & Bold",
    tag: "Space",
    tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description:
      "Starfield projections, mission-control layout, and holographic displays. For teams building the future — one orbit at a time.",
    image: "/assets/generated/cowork-space.dim_800x500.jpg",
    vibe: ["🚀 Star ceilings", "🌌 Deep focus", "👨‍🚀 Mission mode"],
    available: "Q1 2026",
    gradient: "from-indigo-900/80 to-slate-900/60",
  },
  {
    id: "winter",
    title: "Winter Cabin Retreat",
    subtitle: "Warm inside, wild outside",
    mood: "Cozy & Productive",
    tag: "Winter",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description:
      "Crackling fireplaces, snow-dusted windows, and the hygge atmosphere that makes long work sessions feel like a cozy adventure.",
    image: "/assets/generated/cowork-winter.dim_800x500.jpg",
    vibe: ["🔥 Fireplace glow", "☃️ Snow outside", "🍵 Hot cocoa"],
    available: "Q4 2025",
    gradient: "from-blue-900/80 to-slate-900/60",
  },
  {
    id: "cave",
    title: "Underground Cave Loft",
    subtitle: "Where depth breeds brilliance",
    mood: "Mysterious & Creative",
    tag: "Underground",
    tagColor: "bg-stone-500/20 text-stone-300 border-stone-500/30",
    description:
      "Natural rock walls, Edison bulb warmth, and the primal quiet of being underground. Unusual spaces spark unusual ideas.",
    image: "/assets/generated/cowork-cave.dim_800x500.jpg",
    vibe: ["🪨 Stone walls", "💡 Edison glow", "🦇 Cave acoustics"],
    available: "Q1 2026",
    gradient: "from-stone-900/80 to-zinc-900/60",
  },
  {
    id: "rooftop",
    title: "Rooftop Sky Lounge",
    subtitle: "The city is your backdrop",
    mood: "Social & Ambitious",
    tag: "Urban",
    tagColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    description:
      "Open-air terraces above a bustling skyline, string-lit canopies, and lounge seating that blurs the line between work and celebration. Best for team bonding and high-energy brainstorms.",
    image: "/assets/generated/cowork-rooftop.dim_800x500.jpg",
    vibe: ["🏙️ City skyline", "✨ String lights", "🌇 Golden hour"],
    available: "Q2 2026",
    gradient: "from-rose-900/80 to-orange-900/60",
  },
  {
    id: "artloft",
    title: "Bohemian Art Loft",
    subtitle: "Where every wall tells a story",
    mood: "Creative & Free-Spirited",
    tag: "Art",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    description:
      "Exposed brick, colorful canvases, eclectic vintage furniture, and the sweet smell of creativity. A space designed to break routine thinking and ignite imagination.",
    image: "/assets/generated/cowork-artloft.dim_800x500.jpg",
    vibe: ["🎨 Canvas walls", "🕯️ Warm Edison glow", "🌀 Boho vibes"],
    available: "Q2 2026",
    gradient: "from-pink-900/80 to-rose-900/60",
  },
  {
    id: "zen",
    title: "Bamboo Zen Garden",
    subtitle: "Stillness that amplifies clarity",
    mood: "Mindful & Balanced",
    tag: "Zen",
    tagColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    description:
      "Bamboo walls, tatami mats, bonsai trees, and koi ponds visible through sliding shoji doors. A Japanese-inspired sanctuary for teams that want to slow down and think deeply.",
    image: "/assets/generated/cowork-zen.dim_800x500.jpg",
    vibe: ["🎋 Bamboo walls", "🍣 Zen garden", "🌸 Cherry blossoms"],
    available: "Q3 2026",
    gradient: "from-teal-900/80 to-emerald-900/60",
  },
  {
    id: "neon",
    title: "Neon City High-Rise",
    subtitle: "Work at the pulse of the future",
    mood: "Intense & Electric",
    tag: "Cyberpunk",
    tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    description:
      "Holographic displays, neon-lit corridors, and rain-streaked panoramic windows overlooking a city that never sleeps. For teams on a mission that won't stop at anything.",
    image: "/assets/generated/cowork-neon.dim_800x500.jpg",
    vibe: ["🌃 Neon nights", "🤖 Futuristic tech", "⚡ High voltage"],
    available: "Q3 2026",
    gradient: "from-fuchsia-900/80 to-purple-900/60",
  },
];

export function ComingSoonPage() {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Something exciting is brewing
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4 leading-tight">
              Co-Working Spaces
              <br />
              <span className="text-primary">in Every Mood</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We're building a new kind of co-working experience — curated
              environments that match your energy, whether you need deep focus,
              creative spark, or pure play.
            </p>

            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-10">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                Launching 2025–2026
              </div>
              <span className="text-border">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                12 unique environments
              </div>
            </div>

            {/* Notify form */}
            {!submitted ? (
              <form
                onSubmit={handleNotify}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Your work email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button type="submit" className="whitespace-nowrap">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium"
              >
                ✅ You're on the list! We'll notify you when we launch.
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="container max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            Explore the Environments
          </h2>
          <p className="text-muted-foreground">
            Every space is designed around a distinct mood and work style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {SPACES.map((space, i) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredId(space.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${space.gradient}`}
                />
                {/* Overlay badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium border ${space.tagColor} backdrop-blur-sm`}
                  >
                    {space.tag}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium border border-white/20 bg-black/30 text-white backdrop-blur-sm"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {space.available}
                  </Badge>
                </div>

                {/* Mood overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/70 text-xs mb-1">{space.subtitle}</p>
                  <h3 className="text-white font-display font-bold text-xl">
                    {space.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Mood:
                  </span>
                  <span className="text-sm text-foreground font-semibold">
                    {space.mood}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {space.description}
                </p>

                {/* Vibe pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {space.vibe.map((v) => (
                    <span
                      key={v}
                      className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs border border-border/50"
                    >
                      {v}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Expected launch:{" "}
                    <strong className="text-foreground">
                      {space.available}
                    </strong>
                  </span>
                  <motion.div
                    animate={{ x: hoveredId === space.id ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1 text-primary text-sm font-medium"
                  >
                    Coming Soon <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20"
        >
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-display font-bold text-foreground mb-2">
            Have a mood in mind?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're open to ideas. If you have a dream office environment you'd
            love to see, tell us and we might just build it.
          </p>
          <Button variant="outline" asChild>
            <a href="/contact">
              Share Your Idea <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
