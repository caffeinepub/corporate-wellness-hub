import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Globe,
  Heart,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const roles = [
  {
    title: "Wellness Program Manager",
    team: "Programs",
    location: "Hybrid · Bengaluru",
    type: "Full-time",
    description:
      "Design, launch, and iterate on wellness programs that genuinely move the needle on employee wellbeing. You'll work closely with corporate partners and our community to shape what great looks like.",
    tags: ["Program Design", "Corporate Wellness", "Facilitation"],
  },
  {
    title: "Community Coordinator",
    team: "Community",
    location: "Remote · India",
    type: "Full-time",
    description:
      "Be the heartbeat of our communities. Onboard new corporate groups, keep energy high, and ensure every employee who joins a session leaves feeling a little lighter than when they arrived.",
    tags: ["Community Building", "Operations", "People Skills"],
  },
  {
    title: "Product Designer",
    team: "Product",
    location: "Remote · Anywhere",
    type: "Full-time",
    description:
      "Shape the visual and interaction language of a platform that thousands of employees use to find their calm. We care deeply about craft and are looking for someone who does too.",
    tags: ["Figma", "Design Systems", "User Research"],
  },
  {
    title: "Backend Engineer",
    team: "Engineering",
    location: "Remote · Anywhere",
    type: "Full-time",
    description:
      "Build the systems that power real-time session management, anonymous discussions, and collaborative task allocation. We use modern web technologies and care about clean, maintainable code.",
    tags: ["Motoko", "TypeScript", "ICP"],
  },
];

const perks = [
  {
    icon: Globe,
    text: "Fully remote-friendly — work from wherever you're calmest",
  },
  {
    icon: Heart,
    text: "Free access to all wellness programs for you and one family member",
  },
  {
    icon: Users,
    text: "Small, caring team — no bureaucracy, lots of ownership",
  },
  {
    icon: Sparkles,
    text: "Learning budget of ₹50,000/year for books, courses, and events",
  },
];

function RoleCard({
  role,
  index,
}: { role: (typeof roles)[number]; index: number }) {
  function handleApply() {
    toast.success(
      `Application opened for ${role.title}! We'll be in touch soon. 🌿`,
    );
  }

  return (
    <motion.div
      data-ocid={`careers.role.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {role.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {role.team}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {role.location}
            </span>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {role.type}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {role.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {role.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent/50 text-accent-foreground border border-accent-foreground/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <Button
        data-ocid={`careers.apply_button.${index + 1}`}
        onClick={handleApply}
        className="gap-2 group/btn"
        size="sm"
      >
        Apply Now
        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </Button>
    </motion.div>
  );
}

export function CareersPage() {
  function handleSpontaneous() {
    toast.success("Spontaneous application sent! We love initiative. 🌿");
  }

  return (
    <main className="pt-20">
      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-16 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
        <div className="relative container max-w-3xl mx-auto px-4 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/70 text-accent-foreground text-xs font-medium mb-6 border border-accent-foreground/10">
                <Sparkles className="w-3.5 h-3.5" />
                We're hiring
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-5 text-balance"
            >
              Work that actually{" "}
              <span className="text-primary italic">matters</span> to people.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
            >
              We're a small, mission-driven team building tools that help
              employees breathe a little easier. If that resonates, we'd love to
              meet you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Culture / Perks ────────────────────────────────── */}
      <section className="py-16 bg-muted/20 border-y border-border/40">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Life at the Hub
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We practice what we preach. Our team runs its own wellness
              sessions, takes real breaks, and genuinely looks out for each
              other.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.text}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-card rounded-2xl border border-border p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/60 flex items-center justify-center mx-auto mb-3">
                  <perk.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {perk.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Open Roles ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Open roles
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Four roles right now. More coming as we grow.
            </p>
          </motion.div>

          <div className="space-y-4">
            {roles.map((role, i) => (
              <RoleCard key={role.title} role={role} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Spontaneous ────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-primary rounded-3xl p-10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                Don't see your role?
              </h2>
              <p className="text-primary-foreground/80 mb-7 max-w-sm mx-auto text-sm leading-relaxed">
                We love people who reach out before there's a job posting. Tell
                us what you do and how you'd make the Hub better.
              </p>
              <Button
                variant="secondary"
                className="rounded-full px-8 gap-2"
                onClick={handleSpontaneous}
                data-ocid="careers.apply_button.5"
              >
                Send a spontaneous application
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
