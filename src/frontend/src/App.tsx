import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { CareersPage } from "./pages/CareersPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { ContactPage } from "./pages/ContactPage";
import { LandingPage } from "./pages/LandingPage";
import { MembershipPage } from "./pages/MembershipPage";
import { MindfulMeetupPage } from "./pages/MindfulMeetupPage";
import { MySessionsPage } from "./pages/MySessionsPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { PsychologistsPage } from "./pages/PsychologistsPage";
import { SessionDetailPage } from "./pages/SessionDetailPage";
import { SocialGatheringPage } from "./pages/SocialGatheringPage";
import { TaskSharingPage } from "./pages/TaskSharingPage";

// ─── Root Layout ─────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  ),
});

// ─── Routes ───────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const programsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programs/$type",
  component: ProgramsPage,
});

const sessionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sessions/$id",
  component: SessionDetailPage,
});

const mySessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-sessions",
  component: MySessionsPage,
});

const meetupActivitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meetup-activities",
  component: MindfulMeetupPage,
});

const socialActivitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-activities",
  component: SocialGatheringPage,
});

const taskActivitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/task-activities",
  component: TaskSharingPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const careersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/careers",
  component: CareersPage,
});

const membershipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/membership",
  component: MembershipPage,
});

const psychologistsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/psychologists",
  component: PsychologistsPage,
});

const comingSoonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/coming-soon",
  component: ComingSoonPage,
});

// Redirect /programs -> /programs/meetup
const programsRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programs",
  beforeLoad: () => {
    throw redirect({ to: "/programs/$type", params: { type: "meetup" } });
  },
  component: () => null,
});

// ─── Router ─────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  programsRoute,
  programsRedirectRoute,
  sessionDetailRoute,
  mySessionsRoute,
  meetupActivitiesRoute,
  socialActivitiesRoute,
  taskActivitiesRoute,
  aboutRoute,
  contactRoute,
  careersRoute,
  membershipRoute,
  psychologistsRoute,
  comingSoonRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
