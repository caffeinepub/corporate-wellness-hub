import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Globe,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────
type Specialty =
  | "All"
  | "Stress & Burnout"
  | "Anxiety"
  | "Depression"
  | "Work-Life Balance"
  | "Performance Coaching";

type SessionMode = "Video" | "Voice" | "Chat";

interface Doctor {
  id: number;
  name: string;
  initials: string;
  color: string;
  credentials: string;
  specialties: Specialty[];
  experience: string;
  languages: string[];
  rating: number;
  reviews: number;
  nextSlot: string;
  modes: SessionMode[];
  slots: { day: string; times: string[] }[];
}

// ─── Mock Data ────────────────────────────────────────────────────
const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    initials: "PS",
    color: "oklch(0.72 0.14 175)",
    credentials: "PhD in Clinical Psychology",
    specialties: ["Stress & Burnout", "Anxiety"],
    experience: "12 years experience",
    languages: ["English", "Hindi"],
    rating: 4.9,
    reviews: 214,
    nextSlot: "Today 4:00 PM",
    modes: ["Video", "Voice", "Chat"],
    slots: [
      { day: "Today", times: ["4:00 PM", "5:30 PM", "7:00 PM"] },
      {
        day: "Tomorrow",
        times: ["10:00 AM", "11:30 AM", "3:00 PM", "5:00 PM"],
      },
      { day: "Day after", times: ["9:00 AM", "2:00 PM", "4:30 PM"] },
    ],
  },
  {
    id: 2,
    name: "Dr. Ankit Mehta",
    initials: "AM",
    color: "oklch(0.62 0.16 265)",
    credentials: "M.D. Psychiatry",
    specialties: ["Depression", "Anxiety"],
    experience: "9 years experience",
    languages: ["English", "Hindi", "Gujarati"],
    rating: 4.8,
    reviews: 178,
    nextSlot: "Tomorrow 10:00 AM",
    modes: ["Video", "Voice"],
    slots: [
      { day: "Today", times: ["6:00 PM"] },
      { day: "Tomorrow", times: ["10:00 AM", "11:00 AM", "4:00 PM"] },
      { day: "Day after", times: ["10:30 AM", "1:00 PM", "5:30 PM"] },
    ],
  },
  {
    id: 3,
    name: "Dr. Sarah Collins",
    initials: "SC",
    color: "oklch(0.65 0.18 30)",
    credentials: "MSc Counselling Psychology",
    specialties: ["Work-Life Balance", "Stress & Burnout"],
    experience: "7 years experience",
    languages: ["English"],
    rating: 4.9,
    reviews: 132,
    nextSlot: "Today 6:30 PM",
    modes: ["Video", "Chat"],
    slots: [
      { day: "Today", times: ["6:30 PM", "8:00 PM"] },
      { day: "Tomorrow", times: ["9:00 AM", "11:00 AM", "2:00 PM", "6:00 PM"] },
      { day: "Day after", times: ["10:00 AM", "3:00 PM"] },
    ],
  },
  {
    id: 4,
    name: "Dr. Rohan Nair",
    initials: "RN",
    color: "oklch(0.60 0.14 155)",
    credentials: "PhD in Organisational Psychology",
    specialties: ["Performance Coaching", "Work-Life Balance"],
    experience: "14 years experience",
    languages: ["English", "Malayalam", "Tamil"],
    rating: 4.7,
    reviews: 296,
    nextSlot: "Tomorrow 9:30 AM",
    modes: ["Video", "Voice", "Chat"],
    slots: [
      { day: "Today", times: [] },
      { day: "Tomorrow", times: ["9:30 AM", "11:00 AM", "3:30 PM"] },
      {
        day: "Day after",
        times: ["8:30 AM", "12:00 PM", "4:00 PM", "6:30 PM"],
      },
    ],
  },
  {
    id: 5,
    name: "Dr. Emily Chen",
    initials: "EC",
    color: "oklch(0.68 0.16 75)",
    credentials: "PsyD Clinical Psychology",
    specialties: ["Anxiety", "Performance Coaching"],
    experience: "11 years experience",
    languages: ["English", "Mandarin"],
    rating: 4.8,
    reviews: 189,
    nextSlot: "Today 5:00 PM",
    modes: ["Video", "Chat"],
    slots: [
      { day: "Today", times: ["5:00 PM", "7:30 PM"] },
      { day: "Tomorrow", times: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Day after", times: ["9:30 AM", "2:30 PM", "5:00 PM"] },
    ],
  },
  {
    id: 6,
    name: "Dr. Vikram Das",
    initials: "VD",
    color: "oklch(0.55 0.14 200)",
    credentials: "M.Phil in Psychiatry",
    specialties: ["Stress & Burnout", "Depression"],
    experience: "16 years experience",
    languages: ["English", "Hindi", "Bengali"],
    rating: 4.9,
    reviews: 342,
    nextSlot: "Tomorrow 11:00 AM",
    modes: ["Video", "Voice"],
    slots: [
      { day: "Today", times: ["8:00 PM"] },
      { day: "Tomorrow", times: ["11:00 AM", "2:00 PM", "5:00 PM"] },
      { day: "Day after", times: ["10:00 AM", "12:30 PM", "3:30 PM"] },
    ],
  },
  {
    id: 7,
    name: "Dr. Aisha Khan",
    initials: "AK",
    color: "oklch(0.62 0.17 350)",
    credentials: "MSc Clinical Mental Health",
    specialties: ["Work-Life Balance", "Anxiety"],
    experience: "8 years experience",
    languages: ["English", "Urdu", "Hindi"],
    rating: 4.8,
    reviews: 151,
    nextSlot: "Today 3:30 PM",
    modes: ["Video", "Voice", "Chat"],
    slots: [
      { day: "Today", times: ["3:30 PM", "5:30 PM"] },
      { day: "Tomorrow", times: ["9:00 AM", "11:30 AM", "4:30 PM"] },
      { day: "Day after", times: ["10:30 AM", "2:00 PM", "6:00 PM"] },
    ],
  },
  {
    id: 8,
    name: "Dr. James Wright",
    initials: "JW",
    color: "oklch(0.58 0.13 240)",
    credentials: "PhD Cognitive Behavioural Therapy",
    specialties: ["Performance Coaching", "Stress & Burnout"],
    experience: "10 years experience",
    languages: ["English"],
    rating: 4.7,
    reviews: 203,
    nextSlot: "Tomorrow 2:00 PM",
    modes: ["Video", "Chat"],
    slots: [
      { day: "Today", times: [] },
      { day: "Tomorrow", times: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      {
        day: "Day after",
        times: ["9:00 AM", "11:00 AM", "3:00 PM", "5:30 PM"],
      },
    ],
  },
];

const SPECIALTIES: Specialty[] = [
  "All",
  "Stress & Burnout",
  "Anxiety",
  "Depression",
  "Work-Life Balance",
  "Performance Coaching",
];

const SESSION_MODE_ICONS: Record<SessionMode, React.ReactNode> = {
  Video: <Video className="w-3.5 h-3.5" />,
  Voice: <Phone className="w-3.5 h-3.5" />,
  Chat: <MessageSquare className="w-3.5 h-3.5" />,
};

// ─── Booking Modal ────────────────────────────────────────────────
function BookingModal({
  doctor,
  onClose,
}: { doctor: Doctor; onClose: () => void }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<SessionMode>(
    doctor.modes[0],
  );

  const availableSlots = doctor.slots[selectedDay].times;

  function handleConfirm() {
    if (!selectedTime) return;
    toast.success(
      `Session booked with ${doctor.name} on ${
        doctor.slots[selectedDay].day
      } at ${selectedTime} via ${selectedMode}`,
      { duration: 5000 },
    );
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Book a Session</DialogTitle>
      </DialogHeader>

      {/* Doctor info */}
      <div className="flex items-center gap-3 py-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: doctor.color }}
        >
          {doctor.initials}
        </div>
        <div>
          <p className="font-semibold text-foreground">{doctor.name}</p>
          <p className="text-xs text-muted-foreground">{doctor.credentials}</p>
        </div>
      </div>

      {/* Day selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Select Day
        </p>
        <div className="flex gap-2">
          {doctor.slots.map((slot, i) => (
            <button
              key={slot.day}
              type="button"
              data-ocid="psychologists.booking.day_button"
              onClick={() => {
                setSelectedDay(i);
                setSelectedTime(null);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedDay === i
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
              } ${slot.times.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={slot.times.length === 0}
            >
              {slot.day}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Select Time
        </p>
        {availableSlots.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No slots available
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((time) => (
              <button
                key={time}
                type="button"
                data-ocid="psychologists.booking.time_button"
                onClick={() => setSelectedTime(time)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  selectedTime === time
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Session type */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Session Type
        </p>
        <div className="flex gap-2">
          {doctor.modes.map((mode) => (
            <button
              key={mode}
              type="button"
              data-ocid="psychologists.booking.mode_button"
              onClick={() => setSelectedMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                selectedMode === mode
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
              }`}
            >
              {SESSION_MODE_ICONS[mode]}
              {mode}
            </button>
          ))}
        </div>
      </div>

      <Button
        data-ocid="psychologists.booking.confirm_button"
        className="w-full mt-2"
        disabled={!selectedTime}
        onClick={handleConfirm}
      >
        Confirm Booking
      </Button>
    </DialogContent>
  );
}

// ─── Doctor Card ──────────────────────────────────────────────────
function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        data-ocid={`psychologists.item.${index + 1}`}
        className="bg-card rounded-2xl border border-border/60 p-5 flex flex-col gap-4 hover:shadow-md hover:border-border transition-all"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm"
            style={{ background: doctor.color }}
          >
            {doctor.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base leading-tight">
              {doctor.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doctor.credentials}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">
                {doctor.rating}
              </span>
              <span className="text-xs text-muted-foreground">
                · {doctor.reviews} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5">
          {doctor.specialties.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{doctor.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{doctor.languages.join(", ")}</span>
          </div>
        </div>

        {/* Session modes */}
        <div className="flex items-center gap-2">
          {doctor.modes.map((mode) => (
            <div
              key={mode}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
            >
              {SESSION_MODE_ICONS[mode]}
              <span>{mode}</span>
            </div>
          ))}
        </div>

        {/* Next slot */}
        <div className="bg-accent/50 rounded-xl px-3 py-2">
          <p className="text-xs text-muted-foreground">Next available</p>
          <p className="text-sm font-semibold text-accent-foreground">
            {doctor.nextSlot}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Button
            className="flex-1"
            size="sm"
            data-ocid={`psychologists.book_button.${index + 1}`}
            onClick={() => setOpen(true)}
          >
            Book Session
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            data-ocid={`psychologists.profile_button.${index + 1}`}
          >
            View Profile
          </Button>
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <BookingModal doctor={doctor} onClose={() => setOpen(false)} />
        )}
      </Dialog>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export function PsychologistsPage() {
  const [activeFilter, setActiveFilter] = useState<Specialty>("All");

  const filtered =
    activeFilter === "All"
      ? DOCTORS
      : DOCTORS.filter((d) => d.specialties.includes(activeFilter));

  return (
    <main className="pt-20 pb-16 min-h-screen">
      {/* Hero */}
      <section className="bg-mesh py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 text-xs px-3 py-1 rounded-full">
              Online Sessions
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Talk to a Professional
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              Licensed psychologists & therapists available for confidential
              online sessions, designed for corporate employees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 py-4 px-4">
        <div className="container max-w-6xl mx-auto">
          <div
            className="flex flex-wrap gap-2"
            aria-label="Filter by specialty"
          >
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                data-ocid="psychologists.filter.tab"
                onClick={() => setActiveFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Grid */}
      <section className="py-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="psychologists.empty_state"
                className="col-span-full text-center py-20 text-muted-foreground"
              >
                No doctors found for this specialty.
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((doctor, i) => (
                  <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 px-4 bg-secondary/30">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Browse & Filter",
                  desc: "Find a doctor matching your needs using specialty filters and profiles.",
                  icon: "🔍",
                },
                {
                  step: "02",
                  title: "Book a Slot",
                  desc: "Pick a date and time that suits your schedule. Instant confirmation.",
                  icon: "📅",
                },
                {
                  step: "03",
                  title: "Join Online",
                  desc: "Start your confidential session from anywhere — video, voice, or chat.",
                  icon: "💻",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="bg-card rounded-2xl border border-border/60 p-6 text-center relative"
                >
                  <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-3 mt-2">{item.icon}</div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Confidentiality Banner */}
      <section className="py-12 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-accent rounded-2xl border border-accent-foreground/10 p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-accent-foreground mb-2">
                100% Confidential
              </h3>
              <p className="text-accent-foreground/80 text-sm leading-relaxed">
                All sessions are completely private. Your employer will never be
                notified about your sessions, diagnoses, or any information
                shared with your therapist. Your mental health journey is yours
                alone.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
