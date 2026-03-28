import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Heart, MessageCircle, Send, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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

type Topic = "All" | "Work" | "Stress" | "Task" | "General";

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
  topic: Exclude<Topic, "All">;
  replies: Reply[];
}

const SEED_POSTS: Post[] = [
  {
    id: "d1",
    alias: "Quiet Hawk",
    text: "My manager keeps assigning me tasks outside my role without any extra compensation. I don't know how to bring it up without seeming difficult.",
    minutesAgo: 14,
    likes: 23,
    topic: "Work",
    replies: [
      {
        id: "d1r1",
        alias: "Wise Owl",
        text: "Document everything first. Then frame the conversation around bandwidth and priorities — not about refusing work, but about doing your actual job well.",
        minutesAgo: 11,
      },
      {
        id: "d1r2",
        alias: "Calm River",
        text: "Ask for a 1:1 and present it as wanting clarity on your role scope. Usually opens up the conversation without confrontation.",
        minutesAgo: 9,
      },
    ],
  },
  {
    id: "d2",
    alias: "Brave Lion",
    text: "I've been feeling completely drained after work every single day for the past month. I used to love what I did. Is this just burnout?",
    minutesAgo: 38,
    likes: 41,
    topic: "Stress",
    replies: [
      {
        id: "d2r1",
        alias: "Serene Cloud",
        text: "Sounds exactly like burnout. The loss of enjoyment is a key sign. Please take this seriously — it doesn't get better by pushing harder.",
        minutesAgo: 32,
      },
    ],
  },
  {
    id: "d3",
    alias: "Swift Fox",
    text: "Our team's task list keeps growing but no one talks about deadlines or priorities. Everything feels urgent and I don't know where to start.",
    minutesAgo: 65,
    likes: 17,
    topic: "Task",
    replies: [
      {
        id: "d3r1",
        alias: "Sharp Mind",
        text: "Try the Eisenhower Matrix — urgent vs important. It helps cut through the noise when everything feels on fire.",
        minutesAgo: 60,
      },
      {
        id: "d3r2",
        alias: "Bold Eagle",
        text: "We had the same problem. We started a weekly 10-min priority sync and it completely changed how the team operates.",
        minutesAgo: 55,
      },
    ],
  },
  {
    id: "d4",
    alias: "Free Spirit",
    text: "Genuinely feel like I'm invisible at work. My ideas get ignored in meetings until a colleague repeats them and suddenly they're brilliant.",
    minutesAgo: 110,
    likes: 58,
    topic: "Work",
    replies: [
      {
        id: "d4r1",
        alias: "Open Heart",
        text: "This is incredibly common and incredibly frustrating. Start sending meeting follow-up emails to put your ideas in writing with timestamps.",
        minutesAgo: 100,
      },
    ],
  },
  {
    id: "d5",
    alias: "Warm Light",
    text: "Anxiety before Monday mornings is starting to affect my weekends. I can't fully relax because dread of the week ahead takes over.",
    minutesAgo: 190,
    likes: 33,
    topic: "Stress",
    replies: [],
  },
  {
    id: "d6",
    alias: "Clear Sky",
    text: "Any tips for staying focused on deep work when the office is loud and interruptions are constant? Headphones only go so far.",
    minutesAgo: 250,
    likes: 26,
    topic: "General",
    replies: [
      {
        id: "d6r1",
        alias: "Steady Rock",
        text: "Block 'focus time' on your calendar and set Slack/Teams to DND. Make it visible to the team so they learn to respect it.",
        minutesAgo: 240,
      },
    ],
  },
  {
    id: "d7",
    alias: "Deep Sea",
    text: "I've been procrastinating a huge project for weeks. I know how to start but something keeps stopping me. It's embarrassing at this point.",
    minutesAgo: 320,
    likes: 44,
    topic: "Task",
    replies: [
      {
        id: "d7r1",
        alias: "Curious Tiger",
        text: "Procrastination is almost never laziness — usually it's fear of failure or perfectionism. Break it into the smallest possible first step.",
        minutesAgo: 310,
      },
      {
        id: "d7r2",
        alias: "Bright Star",
        text: "I use the 2-minute rule: if starting takes less than 2 mins, do it now. Just the start breaks the cycle.",
        minutesAgo: 300,
      },
    ],
  },
  {
    id: "d8",
    alias: "Gentle Storm",
    text: "How do people here decompress after a rough day? I'm looking for things that actually work — not just 'go for a walk' advice.",
    minutesAgo: 420,
    likes: 61,
    topic: "General",
    replies: [
      {
        id: "d8r1",
        alias: "Serene Cloud",
        text: "A full shutdown ritual — close every work app, write down tomorrow's top 3 tasks, then physically leave your workspace even if at home.",
        minutesAgo: 410,
      },
      {
        id: "d8r2",
        alias: "Warm Light",
        text: "Cold shower works for me. It forces a hard reset in a way nothing else does.",
        minutesAgo: 405,
      },
    ],
  },
];

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

function getInitials(alias: string): string {
  return alias
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const TOPIC_COLORS: Record<Exclude<Topic, "All">, string> = {
  Work: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Stress: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Task: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  General:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

function PostCard({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Reply[]>(post.replies);

  const handleReply = () => {
    if (!replyText.trim()) return;
    const alias = randomAlias();
    setReplies((prev) => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        alias,
        text: replyText.trim(),
        minutesAgo: 0,
      },
    ]);
    setReplyText("");
    setShowReplyBox(false);
    setExpanded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card border border-border/50 rounded-xl p-5"
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
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-sm font-semibold text-foreground">
              {post.alias}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(post.minutesAgo)}
            </span>
            <Badge
              variant="secondary"
              className={`text-[10px] px-2 py-0 h-4 font-medium ${
                TOPIC_COLORS[post.topic]
              }`}
            >
              {post.topic}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground"
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
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
              {likes}
            </button>
            {replies.length > 0 && (
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setExpanded(!expanded)}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    expanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            )}
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
              onClick={() => setShowReplyBox(!showReplyBox)}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Reply box */}
      <AnimatePresence>
        {showReplyBox && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-12 mt-3"
          >
            <Textarea
              placeholder="Write a reply anonymously…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[60px] resize-none text-sm mb-2 border-border/60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                  handleReply();
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                <Send className="w-3 h-3 mr-1.5" />
                Reply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies */}
      <AnimatePresence>
        {expanded && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-12 mt-3 space-y-3"
          >
            {replies.map((r) => (
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

const TOPICS: Topic[] = ["All", "Work", "Stress", "Task", "General"];

export function DiscussPage() {
  const [activeTopic, setActiveTopic] = useState<Topic>("All");
  const [inputText, setInputText] = useState("");
  const [selectedTopic, setSelectedTopic] =
    useState<Exclude<Topic, "All">>("General");
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);

  const filtered =
    activeTopic === "All"
      ? posts
      : posts.filter((p) => p.topic === activeTopic);

  const handlePost = () => {
    if (!inputText.trim()) return;
    const alias = randomAlias();
    const newPost: Post = {
      id: `user-${Date.now()}`,
      alias,
      text: inputText.trim(),
      minutesAgo: 0,
      likes: 0,
      topic: selectedTopic,
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setInputText("");
  };

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-50 via-background to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Shield className="w-3.5 h-3.5" />
            100% Anonymous — No account needed
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Talk Anonymously
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            A safe space to share what you're going through at work. Post freely
            — your identity is never revealed.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Composer */}
        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Share something on your mind
          </h2>
          <Textarea
            placeholder="What's on your mind? Write freely — this is a safe, anonymous space."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[90px] resize-none mb-3 border-border/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePost();
            }}
          />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Topic:</span>
              {(["Work", "Stress", "Task", "General"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTopic(t)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedTopic === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Posting as a random alias
              </span>
              <Button
                size="sm"
                onClick={handlePost}
                disabled={!inputText.trim()}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Post
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Filter:</span>
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTopic(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeTopic === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {t}{" "}
              {t !== "All" && `(${posts.filter((p) => p.topic === t).length})`}
            </button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No posts in this topic yet</p>
            <p className="text-sm mt-1">
              Be the first to start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
