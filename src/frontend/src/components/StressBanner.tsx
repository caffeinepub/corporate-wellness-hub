import {
  Activity,
  AlertOctagon,
  BarChart2,
  Brain,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  {
    id: 1,
    icon: Brain,
    title: "What Is Stress?",
    subtitle: "Understanding the silent global threat",
    type: "explainer" as const,
    body: 'Stress is the body\'s physiological response to any demand or challenge. It triggers a cascade of hormones — cortisol, adrenaline — preparing you for "fight or flight". In short bursts it can sharpen focus. But prolonged, unmanaged stress becomes silently toxic, eroding your health, relationships, and career. The World Health Organization now classifies burnout as an occupational phenomenon.',
    pills: ["Acute Stress", "Chronic Stress", "Episodic Stress"],
  },
  {
    id: 2,
    icon: TrendingUp,
    title: "The Global Corporate Stress Crisis",
    subtitle: "A worldwide epidemic — not just a US problem",
    type: "stats-row" as const,
    stats: [
      {
        value: "1B+",
        label: "workers worldwide affected by work-related stress",
        source: "WHO 2023",
      },
      {
        value: "12B",
        label: "working days lost per year to depression & anxiety globally",
        source: "WHO",
      },
      {
        value: "76%",
        label:
          "of workers globally report at least one symptom of poor mental health",
        source: "McKinsey 2022",
      },
    ],
  },
  {
    id: 3,
    icon: Activity,
    title: "How Stress Hits Your People",
    subtitle: "The effects are real and measurable",
    type: "columns" as const,
    columns: [
      {
        emoji: "🫀",
        heading: "Physical",
        items: [
          "Persistent headaches",
          "Chronic fatigue",
          "Sleep disorders",
          "Elevated blood pressure",
          "Weakened immunity",
        ],
      },
      {
        emoji: "🧠",
        heading: "Mental",
        items: [
          "Anxiety & panic attacks",
          "Clinical depression",
          "Poor concentration",
          "Memory impairment",
          "Decision fatigue",
        ],
      },
      {
        emoji: "⚡",
        heading: "Behavioral",
        items: [
          "Rising absenteeism",
          "Reduced productivity",
          "Substance dependency",
          "Interpersonal conflict",
          "Presenteeism",
        ],
      },
    ],
  },
  {
    id: 4,
    icon: BarChart2,
    title: "The Numbers Don't Lie",
    subtitle: "Global workplace stress by the data",
    type: "grid-stats" as const,
    gridStats: [
      {
        value: "$1T",
        label: "lost annually to global productivity from depression & anxiety",
      },
      {
        value: "745K",
        label: "deaths per year from overwork (long hours) — WHO/ILO",
      },
      {
        value: "$322B",
        label:
          "global cost of employee burnout in turnover & lost productivity",
      },
      {
        value: "44%",
        label:
          "of employees worldwide say their stress has increased in the past year",
      },
    ],
    source: "Sources: WHO, ILO, McKinsey, Gallup 2023",
  },
  {
    id: 5,
    icon: Globe,
    title: "Stress by Region",
    subtitle: "No continent is immune",
    type: "bars" as const,
    bars: [
      { label: "South Asia (India, Bangladesh)", pct: 82 },
      { label: "North America (US, Canada)", pct: 79 },
      { label: "East Asia (Japan, China, S. Korea)", pct: 75 },
      { label: "Europe (UK, Germany, France)", pct: 68 },
      { label: "Middle East & Africa", pct: 65 },
      { label: "Latin America", pct: 62 },
    ],
  },
  {
    id: 6,
    icon: Building2,
    title: "Industries Hit Hardest",
    subtitle: "No sector is immune — globally",
    type: "bars" as const,
    bars: [
      { label: "Finance & Banking", pct: 79 },
      { label: "Healthcare", pct: 74 },
      { label: "Technology", pct: 69 },
      { label: "Legal", pct: 67 },
      { label: "Manufacturing", pct: 60 },
    ],
  },
  {
    id: 7,
    icon: AlertOctagon,
    title: "The Burnout Spiral",
    subtitle: "When stress goes unaddressed",
    type: "spiral" as const,
    stages: [
      "Unmanaged Stress",
      "Chronic Fatigue",
      "Emotional Exhaustion",
      "Disengagement",
      "Burnout",
      "High Turnover",
    ],
  },
];

const SLIDE_DURATION = 5000;

export function StressBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const progressRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const goTo = useCallback((index: number, dir: 1 | -1) => {
    setDirection(dir);
    setCurrent(index);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = performance.now();
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => {
      const n = (c + 1) % slides.length;
      setDirection(1);
      setProgress(0);
      progressRef.current = 0;
      startTimeRef.current = performance.now();
      return n;
    });
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => {
      const n = (c - 1 + slides.length) % slides.length;
      setDirection(-1);
      setProgress(0);
      progressRef.current = 0;
      startTimeRef.current = performance.now();
      return n;
    });
  }, []);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (!paused) {
        const elapsed = now - startTimeRef.current;
        const p = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        setProgress(p);
        progressRef.current = p;
        if (p >= 100) {
          setCurrent((c) => (c + 1) % slides.length);
          setDirection(1);
          setProgress(0);
          progressRef.current = 0;
          startTimeRef.current = now;
        }
      } else {
        startTimeRef.current =
          now - (progressRef.current / 100) * SLIDE_DURATION;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section
      className="relative bg-zinc-950 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-ocid="stress_banner.section"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 40%, #e11d48 0%, transparent 55%), radial-gradient(circle at 85% 60%, #7c3aed 0%, transparent 50%)",
        }}
      />

      {/* Section Header */}
      <div className="relative container max-w-6xl mx-auto px-4 pt-14 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-rose-400 mb-3">
            🌍 Global Awareness Series
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            The Stress Reality
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">
            Why corporate wellness isn&apos;t optional anymore — worldwide
          </p>
        </motion.div>
      </div>

      {/* Slider area */}
      <div className="relative container max-w-6xl mx-auto px-4 pb-6">
        <div className="relative flex items-center gap-2 md:gap-4">
          {/* Prev button */}
          <button
            type="button"
            onClick={prev}
            data-ocid="stress_banner.pagination_prev"
            className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide container */}
          <div className="flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60 min-h-[340px] md:min-h-[300px] relative">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: "easeInOut" }}
                className="p-6 md:p-10"
              >
                <SlideContent slide={slides[current]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={next}
            data-ocid="stress_banner.pagination_next"
            className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div
          className="flex items-center justify-center gap-2 mt-5"
          data-ocid="stress_banner.tab"
        >
          {slides.map((s, i) => (
            <button
              type="button"
              key={s.id}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-rose-500"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full bg-rose-500 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

function SlideContent({ slide }: { slide: (typeof slides)[number] }) {
  const Icon = slide.icon;

  const header = (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-rose-400" />
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-0.5">
          {String(slide.id).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </p>
        <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
          {slide.title}
        </h3>
        <p className="text-zinc-400 text-sm mt-0.5">{slide.subtitle}</p>
      </div>
    </div>
  );

  if (slide.type === "explainer") {
    return (
      <div>
        {header}
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-5">
          {slide.body}
        </p>
        <div className="flex flex-wrap gap-2">
          {slide.pills.map((p) => (
            <span
              key={p}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === "stats-row") {
    return (
      <div>
        {header}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slide.stats.map((s) => (
            <div
              key={s.value}
              className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-rose-400 mb-1">
                {s.value}
              </div>
              <div className="text-zinc-300 text-sm leading-snug mb-2">
                {s.label}
              </div>
              <div className="text-zinc-600 text-xs">{s.source}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === "columns") {
    return (
      <div>
        {header}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slide.columns.map((col) => (
            <div
              key={col.heading}
              className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]"
            >
              <div className="text-2xl mb-2">{col.emoji}</div>
              <div className="font-semibold text-white mb-2 text-sm">
                {col.heading}
              </div>
              <ul className="space-y-1">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-zinc-400 flex items-start gap-1.5"
                  >
                    <span className="mt-1 w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === "grid-stats") {
    return (
      <div>
        {header}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {slide.gridStats.map((s) => (
            <div
              key={s.value}
              className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-amber-400 mb-1">
                {s.value}
              </div>
              <div className="text-zinc-400 text-xs leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-zinc-600 text-xs">{slide.source}</p>
      </div>
    );
  }

  if (slide.type === "bars") {
    return (
      <div>
        {header}
        <div className="space-y-3">
          {slide.bars.map((bar, i) => (
            <div key={bar.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-zinc-300">{bar.label}</span>
                <span className="text-sm font-bold text-rose-400">
                  {bar.pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.pct}%` }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === "spiral") {
    return (
      <div>
        {header}
        <div className="flex flex-wrap gap-1.5 items-center mb-6">
          {slide.stages.map((stage, i) => (
            <div key={stage} className="flex items-center gap-1.5">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  i === slide.stages.length - 1
                    ? "bg-rose-500/25 border-rose-500/50 text-rose-300"
                    : "bg-white/5 border-white/15 text-zinc-300"
                }`}
              >
                {stage}
              </span>
              {i < slide.stages.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-5">
          <p className="text-amber-300 text-sm">
            💸 Globally, replacing one employee costs{" "}
            <strong className="text-amber-200">150–200%</strong> of their annual
            salary — a universal cost across all markets
          </p>
        </div>

        <a
          href="/discuss"
          data-ocid="stress_banner.primary_button"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors"
        >
          Talk Anonymously →
        </a>
      </div>
    );
  }

  return null;
}
