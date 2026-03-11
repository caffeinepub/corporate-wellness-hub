import {
  Eye,
  Heart,
  Leaf,
  Lightbulb,
  Scale,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const values = [
  {
    icon: Users,
    title: "Connection",
    tagline: "People over processes.",
    description:
      "We believe stress shrinks when shared. Our programs create genuine bonds between teammates — not just colleagues.",
    color: "bg-accent/60 text-accent-foreground",
  },
  {
    icon: Zap,
    title: "Movement",
    tagline: "A body in motion energises the mind.",
    description:
      "From Box Cricket to evening walks, physical activity is one of the most proven antidotes to workplace stress.",
    color: "bg-[oklch(0.88_0.08_155/0.6)] text-[oklch(0.3_0.12_155)]",
  },
  {
    icon: Leaf,
    title: "Mindfulness",
    tagline: "Slow down to move forward.",
    description:
      "Chai Pe Charcha, Mindful Check-ins, and quiet circles help teams slow down and actually listen to each other.",
    color: "bg-[oklch(0.88_0.07_175/0.6)] text-[oklch(0.3_0.11_175)]",
  },
  {
    icon: Scale,
    title: "Balance",
    tagline: "Equilibrium is a performance strategy.",
    description:
      "Great work happens when people feel grounded. We design programs that restore equilibrium, not just pass the time.",
    color: "bg-[oklch(0.9_0.07_280/0.5)] text-[oklch(0.32_0.1_280)]",
  },
  {
    icon: Heart,
    title: "Empathy",
    tagline: "Safe spaces unlock honest voices.",
    description:
      "Anonymous discussion boards and open circles mean people can express themselves without fear of judgment.",
    color: "bg-[oklch(0.9_0.08_30/0.5)] text-[oklch(0.45_0.15_30)]",
  },
  {
    icon: Lightbulb,
    title: "Growth",
    tagline: "Every session is a new beginning.",
    description:
      "Every session is a chance to discover something new — a skill, a friend, a different perspective on hard problems.",
    color: "bg-[oklch(0.92_0.09_75/0.5)] text-[oklch(0.4_0.14_75)]",
  },
];

const team = [
  {
    initials: "PM",
    name: "Priya Mehta",
    role: "Wellness Lead",
    bio: "Former organizational psychologist who saw burnout firsthand across three large companies. Built this hub to be the resource she wished had existed.",
    color: "bg-accent/60",
  },
  {
    initials: "RK",
    name: "Rohan Kapoor",
    role: "Community Architect",
    bio: "Designed team rituals at startups and enterprises alike. Believes even a five-minute chai break can rebuild a fractured team dynamic.",
    color: "bg-[oklch(0.88_0.07_175/0.6)]",
  },
  {
    initials: "SA",
    name: "Sneha Agarwal",
    role: "Program Curator",
    bio: "Trained mindfulness facilitator and sports enthusiast. She personally runs Chai Pe Charcha sessions every Friday.",
    color: "bg-[oklch(0.9_0.07_280/0.5)]",
  },
];

export function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
        <div className="relative container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/70 text-accent-foreground text-xs font-medium mb-6 border border-accent-foreground/10">
                <Leaf className="w-3.5 h-3.5" />
                Our Story
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6 text-balance"
            >
              We built the space we{" "}
              <span className="text-primary italic">needed</span> at work.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              Corporate Wellness Hub started from a simple observation: most
              workplace stress programs feel clinical, mandatory, and entirely
              disconnected from the way humans actually recharge. We set out to
              change that — one genuine connection at a time.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-muted/30 border-y border-border/40">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>

              {/* Pull-quote callout */}
              <motion.blockquote
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative mb-6 pl-5 border-l-4 border-primary"
              >
                <p className="font-display text-xl md:text-2xl font-bold text-primary leading-snug">
                  &ldquo;To make employee wellbeing a daily practice, not an
                  annual survey.&rdquo;
                </p>
              </motion.blockquote>

              <p className="text-muted-foreground leading-relaxed mb-5">
                We design programs that fit naturally into the rhythms of a
                working week — short enough to actually join, meaningful enough
                to actually remember.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether it&apos;s a quick game of Pickleball at lunch, an
                anonymous post on the discussion board at midnight, or a Chai Pe
                Charcha before the Monday standup — we&apos;re here to lower the
                barrier to real human connection inside corporate life.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden border border-border/50 shadow-glow">
                <img
                  src="/assets/generated/hero-wellness.dim_1200x600.jpg"
                  alt="Team wellness session"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full bg-accent/40 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6 mx-auto"
            >
              <Eye className="w-7 h-7 text-primary" />
            </motion.div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Vision
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="font-display text-xl md:text-2xl font-semibold text-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
            >
              &ldquo;A world where every workplace feels like a community —
              where showing up on Monday doesn&apos;t cost you your
              peace.&rdquo;
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="w-16 h-0.5 bg-primary/40 mx-auto mb-6 origin-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base md:text-lg"
            >
              We envision corporate spaces where movement, conversation, and
              rest are built into the culture — not treated as perks or
              afterthoughts. Where a team&apos;s health is measured not just in
              output, but in how people feel at the end of the day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-2 mt-8 text-primary/50"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium tracking-widest uppercase text-primary/60">
                Building better workplaces, together
              </span>
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              What we stand for
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Six pillars guide every program we design and every session we
              facilitate.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${v.color} mb-4`}
                >
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  {v.title}
                </h3>
                <p className="text-xs italic text-primary font-medium mb-2">
                  {v.tagline}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              The humans behind it
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A small, passionate team that still joins sessions every week.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 text-xl font-display font-bold text-foreground`}
                >
                  {member.initials}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
