import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Send } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@stressreliefhub.in",
    sub: "We respond within one business day",
  },
  {
    icon: Clock,
    label: "Office hours",
    value: "Mon – Fri, 9 am – 6 pm IST",
    sub: "Async-friendly team — we read every message",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Bengaluru, India",
    sub: "Serving corporate teams across India",
  },
];

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success("Message sent! We'll be in touch soon.");
    }, 900);
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
                <Mail className="w-3.5 h-3.5" />
                Get in touch
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-5 text-balance"
            >
              We'd love to <span className="text-primary italic">hear</span>{" "}
              from you.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
            >
              Questions about a program, feedback on an experience, or just
              wanting to say hi — drop us a message and a real human will
              respond.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Form + Info ────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-3 bg-card rounded-3xl border border-border p-8 shadow-glow"
            >
              {submitted ? (
                <div
                  data-ocid="contact.success_state"
                  className="flex flex-col items-center justify-center text-center py-12 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/60 flex items-center justify-center text-3xl">
                    🎉
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Message received!
                  </h2>
                  <p className="text-muted-foreground max-w-xs">
                    Thanks for reaching out. We'll get back to you within one
                    business day.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        data-ocid="contact.name_input"
                        placeholder="Priya Mehta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        data-ocid="contact.email_input"
                        type="email"
                        placeholder="priya@company.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      data-ocid="contact.subject_input"
                      placeholder="Question about Mindfully Meetup programs"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.message_textarea"
                      placeholder="Tell us what's on your mind…"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    className="w-full gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Sending…"
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Info sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 space-y-5"
            >
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-card rounded-2xl border border-border p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/60 flex items-center justify-center shrink-0 mt-0.5">
                      <info.icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {info.label}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {info.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {info.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="bg-primary/10 rounded-2xl border border-primary/20 p-5">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">A friendly note:</span> We're
                  a small team that genuinely cares about every message we
                  receive. We don't use automated replies — a real person will
                  read yours and respond thoughtfully. 🌿
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
