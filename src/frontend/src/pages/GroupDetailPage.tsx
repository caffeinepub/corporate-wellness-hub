import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { GROUPS } from "./GroupsPage";

const ALIASES = [
  "Curious Tiger",
  "Silent Wave",
  "Bold Eagle",
  "Gentle Storm",
  "Swift Fox",
  "Wise Owl",
  "Calm River",
  "Bright Star",
  "Quiet Hawk",
  "Brave Lion",
  "Keen Falcon",
  "Serene Cloud",
  "Sharp Mind",
  "Open Heart",
  "Steady Rock",
  "Free Spirit",
  "Clear Sky",
  "Deep Sea",
  "Warm Light",
  "Cool Breeze",
];

function randomAlias() {
  return ALIASES[Math.floor(Math.random() * ALIASES.length)];
}

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Reply {
  id: string;
  alias: string;
  text: string;
  minutesAgo: number;
}

interface Post {
  id: string;
  alias: string;
  text: string;
  minutesAgo: number;
  likes: number;
  replies: Reply[];
}

const MOCK_POSTS: Record<string, Post[]> = {
  finance: [
    {
      id: "f1",
      alias: "Wise Owl",
      text: "Has anyone explored index funds as a safer investment option compared to individual stocks? The diversification seems compelling.",
      minutesAgo: 12,
      likes: 14,
      replies: [
        {
          id: "f1r1",
          alias: "Keen Falcon",
          text: "Yes! I've been investing in low-cost index funds for 3 years. The steady returns beat most managed portfolios.",
          minutesAgo: 10,
        },
        {
          id: "f1r2",
          alias: "Bright Star",
          text: "Totally agree. Vanguard's S&P 500 fund has been great for passive income.",
          minutesAgo: 8,
        },
      ],
    },
    {
      id: "f2",
      alias: "Bold Eagle",
      text: "Quarterly budget reviews are coming up. What metrics do you track beyond basic P&L to show real departmental health?",
      minutesAgo: 45,
      likes: 9,
      replies: [
        {
          id: "f2r1",
          alias: "Calm River",
          text: "I track burn rate, headcount cost per project, and ROI on software subscriptions.",
          minutesAgo: 40,
        },
      ],
    },
    {
      id: "f3",
      alias: "Clear Sky",
      text: "Inflation is impacting our supply chain costs significantly this quarter. Anyone else dealing with this and found creative solutions?",
      minutesAgo: 120,
      likes: 21,
      replies: [],
    },
    {
      id: "f4",
      alias: "Swift Fox",
      text: "Which expense management tools does everyone recommend for a 50-100 person company? We're currently on spreadsheets.",
      minutesAgo: 200,
      likes: 33,
      replies: [
        {
          id: "f4r1",
          alias: "Free Spirit",
          text: "Expensify changed our lives. So much easier than manual entry.",
          minutesAgo: 195,
        },
        {
          id: "f4r2",
          alias: "Deep Sea",
          text: "Ramp.com is worth checking out — they have great spend controls.",
          minutesAgo: 180,
        },
      ],
    },
    {
      id: "f5",
      alias: "Steady Rock",
      text: "Tax season tip: Don't forget to categorize all SaaS subscriptions as business expenses before the FY closes.",
      minutesAgo: 360,
      likes: 17,
      replies: [],
    },
  ],
  hr: [
    {
      id: "h1",
      alias: "Open Heart",
      text: "We're redesigning our onboarding process. What's one thing you wish you had in your first week at a new company?",
      minutesAgo: 20,
      likes: 28,
      replies: [
        {
          id: "h1r1",
          alias: "Serene Cloud",
          text: "A buddy system! Having a peer mentor during week one made such a difference for me.",
          minutesAgo: 18,
        },
        {
          id: "h1r2",
          alias: "Brave Lion",
          text: "A clear 30-60-90 day plan so you know what success looks like early on.",
          minutesAgo: 15,
        },
      ],
    },
    {
      id: "h2",
      alias: "Quiet Hawk",
      text: "How are teams handling the return-to-office debate? We're getting pushback on our 3-day hybrid policy.",
      minutesAgo: 90,
      likes: 42,
      replies: [
        {
          id: "h2r1",
          alias: "Curious Tiger",
          text: "We gave employees a choice between office days — instead of fixed days, they choose which 3. Much less resistance.",
          minutesAgo: 85,
        },
      ],
    },
    {
      id: "h3",
      alias: "Silent Wave",
      text: "Reminder: Annual performance reviews are due by end of month. Using OKRs this year instead of traditional ratings.",
      minutesAgo: 150,
      likes: 11,
      replies: [],
    },
    {
      id: "h4",
      alias: "Warm Light",
      text: "Anyone have experience with AI-based screening tools for recruitment? Trying to reduce time-to-hire without sacrificing quality.",
      minutesAgo: 300,
      likes: 19,
      replies: [],
    },
    {
      id: "h5",
      alias: "Cool Breeze",
      text: "Employee burnout survey results are in: 67% feel overwhelmed by meeting overload. Time to rethink our calendar culture.",
      minutesAgo: 480,
      likes: 55,
      replies: [
        {
          id: "h5r1",
          alias: "Gentle Storm",
          text: "We implemented a 'no meeting Wednesday' policy and productivity went up noticeably.",
          minutesAgo: 470,
        },
      ],
    },
  ],
  marketing: [
    {
      id: "m1",
      alias: "Bold Eagle",
      text: "Our Q3 campaign saw a 34% lift in engagement after switching from static posts to short-form video content. Anyone else making this shift?",
      minutesAgo: 30,
      likes: 25,
      replies: [
        {
          id: "m1r1",
          alias: "Bright Star",
          text: "Reels and TikTok-style content are outperforming everything for us too.",
          minutesAgo: 25,
        },
      ],
    },
    {
      id: "m2",
      alias: "Swift Fox",
      text: "Looking for B2B copywriters who understand SaaS. Referrals welcome! Our current team is overwhelmed.",
      minutesAgo: 75,
      likes: 7,
      replies: [],
    },
    {
      id: "m3",
      alias: "Free Spirit",
      text: "Is anyone still investing in SEO in the age of AI search? I feel like organic traffic strategies need a rethink.",
      minutesAgo: 180,
      likes: 31,
      replies: [
        {
          id: "m3r1",
          alias: "Deep Sea",
          text: "SEO is still very much alive — just evolved. Focus on E-E-A-T and structured data.",
          minutesAgo: 170,
        },
        {
          id: "m3r2",
          alias: "Sharp Mind",
          text: "Answer Engine Optimization (AEO) is the new frontier alongside traditional SEO.",
          minutesAgo: 160,
        },
      ],
    },
    {
      id: "m4",
      alias: "Clear Sky",
      text: "We just launched a referral program and it's our cheapest acquisition channel so far. Total CAC down 40%.",
      minutesAgo: 400,
      likes: 44,
      replies: [],
    },
  ],
  technology: [
    {
      id: "t1",
      alias: "Sharp Mind",
      text: "We migrated to a microservices architecture last quarter. Initial velocity improved but now debugging across services is a nightmare. Any tips?",
      minutesAgo: 15,
      likes: 18,
      replies: [
        {
          id: "t1r1",
          alias: "Keen Falcon",
          text: "Distributed tracing with Jaeger or Zipkin is essential. Also structured logging with correlation IDs saved us.",
          minutesAgo: 12,
        },
        {
          id: "t1r2",
          alias: "Wise Owl",
          text: "OpenTelemetry standardizes instrumentation across services — definitely worth adopting.",
          minutesAgo: 10,
        },
      ],
    },
    {
      id: "t2",
      alias: "Curious Tiger",
      text: "AI coding assistants like Copilot have cut our sprint estimates by roughly 20%. Is anyone measuring this rigorously?",
      minutesAgo: 60,
      likes: 36,
      replies: [
        {
          id: "t2r1",
          alias: "Steady Rock",
          text: "We track velocity by sprint. Copilot users are consistently 15-25% faster on boilerplate-heavy tasks.",
          minutesAgo: 55,
        },
      ],
    },
    {
      id: "t3",
      alias: "Calm River",
      text: "Security audit next month. Does anyone use automated vulnerability scanning in CI/CD? Which tools do you recommend?",
      minutesAgo: 200,
      likes: 12,
      replies: [],
    },
    {
      id: "t4",
      alias: "Open Heart",
      text: "We're evaluating IaC options — Terraform vs Pulumi. What's your team's experience with each?",
      minutesAgo: 350,
      likes: 27,
      replies: [],
    },
    {
      id: "t5",
      alias: "Brave Lion",
      text: "PostgreSQL vs MongoDB for a mixed workload? We have both relational and document data. Leaning toward Postgres + JSONB.",
      minutesAgo: 600,
      likes: 41,
      replies: [
        {
          id: "t5r1",
          alias: "Silent Wave",
          text: "Postgres + JSONB all the way. One less system to manage and it's incredibly capable.",
          minutesAgo: 590,
        },
      ],
    },
  ],
  music: [
    {
      id: "mu1",
      alias: "Free Spirit",
      text: "Been obsessing over Hania Rani's piano compositions lately. Perfect focus music for deep work sessions. Anyone else into neo-classical?",
      minutesAgo: 22,
      likes: 31,
      replies: [
        {
          id: "mu1r1",
          alias: "Serene Cloud",
          text: "Also check out Nils Frahm! His album 'All Melody' is incredible for concentration.",
          minutesAgo: 18,
        },
        {
          id: "mu1r2",
          alias: "Warm Light",
          text: "Max Richter's 'Sleep' album is my go-to for deep work too.",
          minutesAgo: 15,
        },
      ],
    },
    {
      id: "mu2",
      alias: "Bold Eagle",
      text: "What's everyone's current workout playlist? Looking for high-energy tracks to keep motivation up in the gym.",
      minutesAgo: 95,
      likes: 22,
      replies: [],
    },
    {
      id: "mu3",
      alias: "Quiet Hawk",
      text: "Attended the Arctic Monkeys concert last weekend. Absolutely electric performance — Alex Turner still brings it after all these years.",
      minutesAgo: 240,
      likes: 47,
      replies: [
        {
          id: "mu3r1",
          alias: "Swift Fox",
          text: "So jealous! They never come to my city. Glad to hear the live show lives up to the records.",
          minutesAgo: 230,
        },
      ],
    },
    {
      id: "mu4",
      alias: "Clear Sky",
      text: "Spotify Wrapped season is approaching. What genre dominated your 2024 listening? Mine was apparently 80% indie folk.",
      minutesAgo: 500,
      likes: 53,
      replies: [],
    },
    {
      id: "mu5",
      alias: "Cool Breeze",
      text: "Local open mic night every Thursday at The Courtyard. Great way to unwind mid-week and discover emerging talent in the city.",
      minutesAgo: 720,
      likes: 19,
      replies: [],
    },
  ],
  movies: [
    {
      id: "mv1",
      alias: "Curious Tiger",
      text: "Just finished Oppenheimer for the second time. The non-linear storytelling holds up even more on rewatch. What's everyone's take?",
      minutesAgo: 18,
      likes: 38,
      replies: [
        {
          id: "mv1r1",
          alias: "Bright Star",
          text: "Cillian Murphy was absolutely phenomenal. Deserved every award he received.",
          minutesAgo: 15,
        },
        {
          id: "mv1r2",
          alias: "Deep Sea",
          text: "The score by Ludwig Goransson elevated every scene. Listened to it at work all week.",
          minutesAgo: 12,
        },
      ],
    },
    {
      id: "mv2",
      alias: "Keen Falcon",
      text: "Looking for underrated Netflix films — nothing in the top 10. Hidden gems only please!",
      minutesAgo: 70,
      likes: 44,
      replies: [
        {
          id: "mv2r1",
          alias: "Gentle Storm",
          text: "'His House' (2020) is brilliant and terrifying. Absolutely not what you expect.",
          minutesAgo: 65,
        },
      ],
    },
    {
      id: "mv3",
      alias: "Wise Owl",
      text: "Dune Part 3 reportedly greenlit. The visual world Denis Villeneuve has built is genuinely stunning cinema.",
      minutesAgo: 160,
      likes: 62,
      replies: [],
    },
    {
      id: "mv4",
      alias: "Silent Wave",
      text: "A24 continues to be the most consistent studio for quality. 'Past Lives' broke me in the best possible way.",
      minutesAgo: 380,
      likes: 55,
      replies: [],
    },
    {
      id: "mv5",
      alias: "Sharp Mind",
      text: "What are the best films to watch in a group setting? Planning a team movie night and need something crowd-pleasing but not generic.",
      minutesAgo: 560,
      likes: 28,
      replies: [
        {
          id: "mv5r1",
          alias: "Warm Light",
          text: "'The Grand Budapest Hotel' is always a hit for mixed groups. Funny, visually stunning, and everyone finds something to love.",
          minutesAgo: 550,
        },
      ],
    },
  ],
  sports: [
    {
      id: "sp1",
      alias: "Brave Lion",
      text: "The Champions League quarter-finals are set. Who do you think goes all the way this year?",
      minutesAgo: 8,
      likes: 29,
      replies: [
        {
          id: "sp1r1",
          alias: "Open Heart",
          text: "Real Madrid always finds a way in the knockout stages. My money is on them.",
          minutesAgo: 5,
        },
      ],
    },
    {
      id: "sp2",
      alias: "Steady Rock",
      text: "Started training for a half marathon in April. Anyone else from the office joining? Would be great to have a running group.",
      minutesAgo: 55,
      likes: 17,
      replies: [
        {
          id: "sp2r1",
          alias: "Cool Breeze",
          text: "I'm in! Training for the same one. Let's set up a weekend long-run group.",
          minutesAgo: 50,
        },
      ],
    },
    {
      id: "sp3",
      alias: "Calm River",
      text: "Badminton court has been booked for every Tuesday evening in January. Sign-up sheet in the break room!",
      minutesAgo: 180,
      likes: 24,
      replies: [],
    },
    {
      id: "sp4",
      alias: "Swift Fox",
      text: "Cricket World Cup analysis: the middle-order batting has been the defining factor across all top 4 teams.",
      minutesAgo: 400,
      likes: 35,
      replies: [],
    },
  ],
  "health-wellness": [
    {
      id: "hw1",
      alias: "Serene Cloud",
      text: "Been doing a 10-minute morning meditation before opening email. It's been transformative for my anxiety levels. Highly recommend.",
      minutesAgo: 25,
      likes: 41,
      replies: [
        {
          id: "hw1r1",
          alias: "Gentle Storm",
          text: "The Waking Up app by Sam Harris is what got me into meditation. Very accessible for beginners.",
          minutesAgo: 20,
        },
      ],
    },
    {
      id: "hw2",
      alias: "Free Spirit",
      text: "Sharing my meal prep routine: Sunday 2-hour prep covers all lunches for the week. Anyone want to share their approach?",
      minutesAgo: 80,
      likes: 33,
      replies: [],
    },
    {
      id: "hw3",
      alias: "Warm Light",
      text: "Research shows standing desks alone aren't enough — it's about regular movement every 45 mins. Using Stretchly app as a reminder.",
      minutesAgo: 200,
      likes: 27,
      replies: [
        {
          id: "hw3r1",
          alias: "Clear Sky",
          text: "Also try the Pomodoro technique — 25 min focus, 5 min walk. Built-in movement and better focus.",
          minutesAgo: 190,
        },
      ],
    },
    {
      id: "hw4",
      alias: "Deep Sea",
      text: "Sleep hygiene reminder: cut screens 60 mins before bed and keep room at a cool temperature for optimal rest.",
      minutesAgo: 360,
      likes: 48,
      replies: [],
    },
  ],
  travel: [
    {
      id: "tr1",
      alias: "Swift Fox",
      text: "Just returned from Kyoto during cherry blossom season. Worth every penny — one of the most beautiful places I've ever seen.",
      minutesAgo: 40,
      likes: 57,
      replies: [
        {
          id: "tr1r1",
          alias: "Curious Tiger",
          text: "I went two years ago and still think about it daily. Did you visit Fushimi Inari?",
          minutesAgo: 35,
        },
      ],
    },
    {
      id: "tr2",
      alias: "Bright Star",
      text: "Best co-working spots in Bali? Planning to work remotely for 3 weeks in March. Budget conscious but need stable wifi.",
      minutesAgo: 120,
      likes: 22,
      replies: [
        {
          id: "tr2r1",
          alias: "Bold Eagle",
          text: "Outpost in Canggu has fast fiber and a great community of remote workers. Highly recommend.",
          minutesAgo: 110,
        },
      ],
    },
    {
      id: "tr3",
      alias: "Calm River",
      text: "Travel hack: book flights on Tuesday evenings for the best prices. Saved 30% on my last three trips following this rule.",
      minutesAgo: 350,
      likes: 64,
      replies: [],
    },
    {
      id: "tr4",
      alias: "Open Heart",
      text: "Hiking the Laugavegur Trail in Iceland this summer. Anyone done this? Tips on preparation and what to pack?",
      minutesAgo: 600,
      likes: 31,
      replies: [],
    },
  ],
  "food-dining": [
    {
      id: "fd1",
      alias: "Warm Light",
      text: "Made butter chicken from scratch for the first time this weekend. The secret is definitely blooming the spices in ghee first.",
      minutesAgo: 30,
      likes: 44,
      replies: [
        {
          id: "fd1r1",
          alias: "Serene Cloud",
          text: "Game-changer right? Also toast the whole spices before grinding if you want even deeper flavour.",
          minutesAgo: 25,
        },
      ],
    },
    {
      id: "fd2",
      alias: "Keen Falcon",
      text: "New ramen spot opened downtown. Tonkotsu broth is genuinely outstanding — 3-hour queue on weekends but absolutely worth it.",
      minutesAgo: 90,
      likes: 38,
      replies: [],
    },
    {
      id: "fd3",
      alias: "Sharp Mind",
      text: "One pan pasta has been my weeknight savior. Pasta, cherry tomatoes, garlic, spinach — everything in 20 mins.",
      minutesAgo: 220,
      likes: 51,
      replies: [
        {
          id: "fd3r1",
          alias: "Brave Lion",
          text: "Add a splash of white wine and some parmesan at the end. Takes it to another level entirely.",
          minutesAgo: 215,
        },
      ],
    },
    {
      id: "fd4",
      alias: "Quiet Hawk",
      text: "Vegetarian lunch options near HQ are painfully limited. Any recommendations within walking distance?",
      minutesAgo: 440,
      likes: 15,
      replies: [],
    },
  ],
  "career-growth": [
    {
      id: "cg1",
      alias: "Steady Rock",
      text: "Just passed the AWS Solutions Architect exam after 6 weeks of study. Happy to share my prep resources if anyone's interested.",
      minutesAgo: 35,
      likes: 49,
      replies: [
        {
          id: "cg1r1",
          alias: "Wise Owl",
          text: "Please share! I'm planning to start studying next month.",
          minutesAgo: 30,
        },
        {
          id: "cg1r2",
          alias: "Cool Breeze",
          text: "Congrats! Which practice test platform did you use most?",
          minutesAgo: 28,
        },
      ],
    },
    {
      id: "cg2",
      alias: "Free Spirit",
      text: "How do you negotiate salary at annual review time? First time I'm doing it seriously and feeling nervous about the conversation.",
      minutesAgo: 140,
      likes: 66,
      replies: [],
    },
    {
      id: "cg3",
      alias: "Bright Star",
      text: "Completed a course on data analytics on Coursera — it's been eye-opening for my marketing role. Cross-functional skills are underrated.",
      minutesAgo: 300,
      likes: 37,
      replies: [],
    },
    {
      id: "cg4",
      alias: "Silent Wave",
      text: "Mentorship programs within companies are massively underutilized. If yours offers one, sign up — it accelerated my growth more than any course.",
      minutesAgo: 550,
      likes: 43,
      replies: [],
    },
  ],
  leadership: [
    {
      id: "l1",
      alias: "Brave Lion",
      text: "Best piece of leadership advice I've received: don't manage people, manage their environment and remove obstacles.",
      minutesAgo: 50,
      likes: 72,
      replies: [
        {
          id: "l1r1",
          alias: "Clear Sky",
          text: "This is the essence of servant leadership. The shift from 'command and control' to 'enable and unblock' is transformative.",
          minutesAgo: 45,
        },
      ],
    },
    {
      id: "l2",
      alias: "Sharp Mind",
      text: "Running retros after every project has cut recurring mistakes by roughly 60% in my team. The key is psychological safety to raise issues.",
      minutesAgo: 130,
      likes: 58,
      replies: [],
    },
    {
      id: "l3",
      alias: "Deep Sea",
      text: "1:1 meeting frequency debate: weekly 30 min or bi-weekly 60 min? What works best for maintaining team connection and momentum?",
      minutesAgo: 310,
      likes: 34,
      replies: [
        {
          id: "l3r1",
          alias: "Gentle Storm",
          text: "Weekly 30 min. Shorter cadence means issues surface before they become crises.",
          minutesAgo: 300,
        },
      ],
    },
  ],
  innovation: [
    {
      id: "in1",
      alias: "Curious Tiger",
      text: "We held our first internal hackathon last month. 3 of the 12 prototypes are being fast-tracked into actual product features.",
      minutesAgo: 28,
      likes: 53,
      replies: [
        {
          id: "in1r1",
          alias: "Keen Falcon",
          text: "This is the model! Structured creativity time yields real innovation. How often do you plan to run these?",
          minutesAgo: 22,
        },
      ],
    },
    {
      id: "in2",
      alias: "Open Heart",
      text: "Reading 'Zero to One' by Peter Thiel again. Still one of the sharpest frameworks for thinking about genuine innovation vs iteration.",
      minutesAgo: 150,
      likes: 28,
      replies: [],
    },
    {
      id: "in3",
      alias: "Warm Light",
      text: "AI is eating software. What jobs do you think will be genuinely resilient to automation over the next decade?",
      minutesAgo: 420,
      likes: 67,
      replies: [
        {
          id: "in3r1",
          alias: "Serene Cloud",
          text: "Roles requiring empathy, creative judgment, and physical presence in unpredictable environments will hold up longest.",
          minutesAgo: 410,
        },
      ],
    },
  ],
  "culture-diversity": [
    {
      id: "cd1",
      alias: "Gentle Storm",
      text: "Our ERG launched a global month-long celebration of cultural heritage. Each week highlights a different region with food, stories and music.",
      minutesAgo: 60,
      likes: 47,
      replies: [
        {
          id: "cd1r1",
          alias: "Free Spirit",
          text: "This is beautiful. These programs build real understanding across teams in ways training never quite achieves.",
          minutesAgo: 55,
        },
      ],
    },
    {
      id: "cd2",
      alias: "Serene Cloud",
      text: "Language exchange program pairing employees for 30-min weekly conversations has had unexpectedly positive impact on cross-team collaboration.",
      minutesAgo: 180,
      likes: 39,
      replies: [],
    },
    {
      id: "cd3",
      alias: "Cool Breeze",
      text: "Making job descriptions gender-neutral and removing degree requirements increased application diversity by 40% in two hiring cycles.",
      minutesAgo: 400,
      likes: 61,
      replies: [],
    },
  ],
  general: [
    {
      id: "g1",
      alias: "Quiet Hawk",
      text: "Friday afternoon reminder: the office rooftop terrace is available for casual gatherings until 6pm. Perfect weather today!",
      minutesAgo: 5,
      likes: 23,
      replies: [
        {
          id: "g1r1",
          alias: "Bold Eagle",
          text: "Already up here! Come join us!",
          minutesAgo: 3,
        },
      ],
    },
    {
      id: "g2",
      alias: "Steady Rock",
      text: "Recommendation thread: what's a product or service that improved your daily work life that nobody talks about enough?",
      minutesAgo: 85,
      likes: 41,
      replies: [
        {
          id: "g2r1",
          alias: "Swift Fox",
          text: "Raycast on Mac. It replaced my launcher, clipboard manager, and half my browser bookmarks.",
          minutesAgo: 80,
        },
        {
          id: "g2r2",
          alias: "Calm River",
          text: "Notion AI — especially for meeting summaries and first drafts. Saves me 45 minutes a day easily.",
          minutesAgo: 75,
        },
      ],
    },
    {
      id: "g3",
      alias: "Silent Wave",
      text: "Anyone else feel like 'quick sync' meetings could be emails 90% of the time? Just putting that out there.",
      minutesAgo: 210,
      likes: 88,
      replies: [],
    },
    {
      id: "g4",
      alias: "Bright Star",
      text: "Book club is starting! First read: 'Atomic Habits' by James Clear. First meetup in two weeks — all welcome.",
      minutesAgo: 440,
      likes: 34,
      replies: [],
    },
    {
      id: "g5",
      alias: "Deep Sea",
      text: "Office dog Tuesdays are officially approved by facilities! Bring your well-behaved pup to brighten everyone's week.",
      minutesAgo: 720,
      likes: 105,
      replies: [
        {
          id: "g5r1",
          alias: "Open Heart",
          text: "THIS IS THE BEST NEWS. Bringing Biscuit next Tuesday no matter what.",
          minutesAgo: 715,
        },
      ],
    },
  ],
};

function getInitials(alias: string): string {
  return alias
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-sky-500",
];

function avatarColor(alias: string): string {
  let hash = 0;
  for (const c of alias) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-card border border-border/50 rounded-xl p-5"
      data-ocid={`group.item.${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9 shrink-0">
          <AvatarFallback
            className={`${avatarColor(post.alias)} text-white text-xs font-semibold`}
          >
            {getInitials(post.alias)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">
              {post.alias}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(post.minutesAgo)}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 bg-muted"
            >
              Anonymous
            </Badge>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {post.text}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                liked
                  ? "text-rose-500"
                  : "text-muted-foreground hover:text-rose-500"
              }`}
              onClick={() => {
                setLiked(!liked);
                setLikes((prev) => prev + (liked ? -1 : 1));
              }}
              data-ocid={`group.like_button.${index + 1}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
              {likes}
            </button>
            {post.replies.length > 0 && (
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setExpanded(!expanded)}
                data-ocid={`group.reply_toggle.${index + 1}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {post.replies.length}{" "}
                {post.replies.length === 1 ? "reply" : "replies"}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {expanded && post.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-12 mt-3 space-y-3"
          >
            {post.replies.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 pl-3 border-l-2 border-border/60"
              >
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback
                    className={`${avatarColor(r.alias)} text-white text-[10px] font-semibold`}
                  >
                    {getInitials(r.alias)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      {r.alias}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(r.minutesAgo)}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/85 leading-relaxed">
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function GroupDetailPage() {
  const { topic } = useParams({ from: "/groups/$topic" });
  const group = GROUPS.find((g) => g.slug === topic);
  const [inputText, setInputText] = useState("");
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS[topic] ?? []);

  if (!group) {
    return (
      <main className="pt-24 pb-20 container max-w-4xl mx-auto px-4">
        <p className="text-muted-foreground">Group not found.</p>
        <Link to="/groups" className="text-primary underline text-sm">
          Back to Groups
        </Link>
      </main>
    );
  }

  const handlePost = () => {
    if (!inputText.trim()) return;
    const alias = randomAlias();
    const newPost: Post = {
      id: `user-${Date.now()}`,
      alias,
      text: inputText.trim(),
      minutesAgo: 0,
      likes: 0,
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setInputText("");
  };

  const otherGroups = GROUPS.filter((g) => g.slug !== topic).slice(0, 8);

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <Link
            to="/groups"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            data-ocid="group.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Groups
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl leading-none">{group.emoji}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {group.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {group.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {group.members.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {group.posts >= 1000
                    ? `${(group.posts / 1000).toFixed(1)}k`
                    : group.posts}{" "}
                  posts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main feed */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Post composer */}
            <div
              className="bg-card border border-border/50 rounded-xl p-4"
              data-ocid="group.composer.panel"
            >
              <Textarea
                data-ocid="group.textarea"
                placeholder="Share your thoughts anonymously…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[80px] resize-none mb-3 border-border/60"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    handlePost();
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Posting as a random anonymous alias
                </span>
                <Button
                  size="sm"
                  onClick={handlePost}
                  disabled={!inputText.trim()}
                  data-ocid="group.submit_button"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Post
                </Button>
              </div>
            </div>

            <Separator />

            {posts.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="group.empty_state"
              >
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No discussions yet</p>
                <p className="text-sm mt-1">
                  Be the first to start a conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: other groups */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-card border border-border/50 rounded-xl p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Other Groups
              </h3>
              <div className="space-y-1">
                {otherGroups.map((g) => (
                  <Link
                    key={g.slug}
                    to="/groups/$topic"
                    params={{ topic: g.slug }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    data-ocid="group.sidebar.link"
                  >
                    <span className="text-base leading-none">{g.emoji}</span>
                    <span className="truncate">{g.name}</span>
                  </Link>
                ))}
                <Separator className="my-2" />
                <Link
                  to="/groups"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors font-medium"
                  data-ocid="group.view_all_link"
                >
                  View all groups
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
