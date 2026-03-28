import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Blocked consumer domains ────────────────────────────────────
const BLOCKED_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "ymail.com",
  "mail.com",
  "zoho.com",
  "rediffmail.com",
  "msn.com",
  "me.com",
]);

function isCorporateEmail(email: string): { valid: boolean; reason?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Please enter a valid email address." };
  }
  const domain = email.split("@")[1].toLowerCase();
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason:
        "Please use your corporate email address. Personal email providers like Gmail, Yahoo, or Outlook are not eligible for membership.",
    };
  }
  return { valid: true };
}

// ─── Email Modal ─────────────────────────────────────────────────
function EmailModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleClose() {
    setEmail("");
    setError("");
    setSuccess(false);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = isCorporateEmail(email.trim());
    if (!result.valid) {
      setError(result.reason ?? "Invalid email.");
      return;
    }
    setSuccess(true);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md" data-ocid="membership.email.dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">
            Enter your work email
          </DialogTitle>
          <DialogDescription>
            Membership is available for corporate email addresses only.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center gap-4 py-6 text-center"
            data-ocid="membership.email.success_state"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Request received!
              </p>
              <p className="text-sm text-muted-foreground">
                We've received your request! Our team will reach out to your
                work email within 24 hours.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="mt-2"
              data-ocid="membership.email.cancel_button"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
                data-ocid="membership.email.input"
                className={
                  error
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {error && (
                <p
                  className="text-sm text-destructive leading-snug"
                  data-ocid="membership.email.error_state"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                data-ocid="membership.email.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 font-semibold"
                data-ocid="membership.email.submit_button"
              >
                Continue
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Page data ───────────────────────────────────────────────────
const features = [
  "All 4 wellness modules",
  "Mindfully Meetup (14 activities)",
  "Social Gathering activities",
  "Task Sharing activities",
  "Movement & Exercise (sports sub-categories)",
  "Anonymous Discussion Board",
  "Session Management & Dashboard",
  "Priority Support",
];

const modules = [
  {
    emoji: "🤝",
    title: "Mindfully Meetup",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    points: [
      "14 curated mindful activities",
      "Chai Pe Charcha, Open Mic, Icebreaker Circle",
      "Walk & Talk, Gratitude Circle & more",
    ],
  },
  {
    emoji: "🏃",
    title: "Movement & Exercise",
    color: "from-orange-500/10 to-amber-500/10",
    border: "border-orange-500/20",
    points: [
      "Box Cricket, Pickleball, Badminton, Tennis",
      "Skill badges: Beginner / Intermediate / Advanced",
      "Indoor & outdoor format tags",
    ],
  },
  {
    emoji: "🎉",
    title: "Social Gathering",
    color: "from-pink-500/10 to-rose-500/10",
    border: "border-pink-500/20",
    points: [
      "12 social activities for team bonding",
      "Themed events, game nights, potlucks",
      "Fully collaborative session management",
    ],
  },
  {
    emoji: "📋",
    title: "Task Allocation",
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/20",
    points: [
      "12 collaborative task-sharing activities",
      "Assign, track, and complete together",
      "Reduces individual stress overload",
    ],
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes! Every new corporate account gets a 14-day free trial with full access to all four modules. No credit card required to start.",
  },
  {
    q: "Can I add more employees later?",
    a: "Absolutely. You can scale up or down at any time. Simply contact our sales team and we'll adjust your plan within 24 hours.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit/debit cards, UPI, net banking, and corporate invoicing (NET-30 terms available for teams of 50+).",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel at any time with no penalty. Your team retains access until the end of the current billing cycle.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-border/50 rounded-xl overflow-hidden"
      data-ocid="membership.faq.panel"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-foreground hover:bg-muted/40 transition-colors"
        data-ocid="membership.faq.toggle"
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────
export function MembershipPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="pt-16">
      <EmailModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Hero */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Simple, transparent pricing
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            One Membership.
            <br />
            <span className="text-primary">Total Wellness.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Unlock every wellness program for your entire team — mindful
            meetups, movement, social activities, and collaborative task
            management — all under one plan.
          </p>
        </motion.div>
      </section>

      {/* Pricing Card */}
      <section className="py-8 px-4" data-ocid="membership.card">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <Card className="relative border-2 border-primary/40 shadow-2xl overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Zap className="w-3 h-3 fill-primary" />
                Most Popular
              </span>
            </div>

            <CardHeader className="pt-10 pb-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Corporate Wellness Plan
              </p>
              <div className="flex items-end gap-2 mt-3">
                <span className="font-display text-6xl font-bold text-foreground">
                  ₹999
                </span>
                <div className="pb-2 text-muted-foreground text-sm">
                  <div>per employee</div>
                  <div>/ month</div>
                </div>
              </div>
              <p className="text-xs text-primary font-medium mt-1">
                Billed annually · Save 20% vs monthly
              </p>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              <ul className="space-y-3">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <BadgeCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 space-y-3">
                <Button
                  size="lg"
                  className="w-full font-semibold text-base"
                  onClick={() => setModalOpen(true)}
                  data-ocid="membership.get_started.primary_button"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full font-medium"
                  asChild
                  data-ocid="membership.contact_sales.secondary_button"
                >
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Module Breakdown */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Everything included in your plan
            </h2>
            <p className="text-muted-foreground">
              Four complete wellness modules, ready to activate for your team.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                data-ocid="membership.module.card"
              >
                <Card
                  className={`h-full border ${mod.border} bg-gradient-to-br ${mod.color}`}
                >
                  <CardHeader className="pb-3">
                    <div className="text-3xl mb-2">{mod.emoji}</div>
                    <CardTitle className="text-base font-semibold">
                      {mod.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {mod.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="mt-1 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10 px-4 bg-muted/30 border-y border-border/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: <Users className="w-5 h-5" />,
              val: "500+",
              label: "Teams enrolled",
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              val: "14",
              label: "Mindful activities",
            },
            {
              icon: <Zap className="w-5 h-5" />,
              val: "4",
              label: "Wellness modules",
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              val: "24/7",
              label: "Priority support",
            },
          ].map(({ icon, val, label }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-center text-primary mb-1">
                {icon}
              </div>
              <div className="font-display text-3xl font-bold text-foreground">
                {val}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know.
            </p>
          </div>
          <div className="space-y-3" data-ocid="membership.faq.list">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-8 py-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to bring wellness to your team?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
                Join hundreds of corporate teams already using the Stress Relief
                Hub to build healthier, happier workplaces.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold"
                  onClick={() => setModalOpen(true)}
                  data-ocid="membership.cta.primary_button"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                  data-ocid="membership.cta.secondary_button"
                >
                  <Link to="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
