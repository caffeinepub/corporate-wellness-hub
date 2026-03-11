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
import { LandingPage } from "./pages/LandingPage";
import { MindfulMeetupPage } from "./pages/MindfulMeetupPage";
import { MySessionsPage } from "./pages/MySessionsPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { SessionDetailPage } from "./pages/SessionDetailPage";

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

// ─── Routes ──────────────────────────────────────────────────────
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

// Redirect /programs -> /programs/meetup
const programsRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programs",
  beforeLoad: () => {
    throw redirect({ to: "/programs/$type", params: { type: "meetup" } });
  },
  component: () => null,
});

// ─── Router ──────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  programsRoute,
  programsRedirectRoute,
  sessionDetailRoute,
  mySessionsRoute,
  meetupActivitiesRoute,
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
