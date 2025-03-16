import React from "react";
import RequireAuth from "./pages/RequireAuth";
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import AboutView from "./pages/AboutView";
import Footer from "./components/Footer";
const LandingView = lazy(() => import("./pages/LandingView"));
const SignupView = lazy(() => import("./pages/SignupView"));
const LoginView = lazy(() => import("./pages/LoginView"));
const DashboardView = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MeetingView = lazy(() => import("./pages/MeetingView"));

// Component to handle loading state during lazy loading
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <div className="overflow-hidden min-h-screen flex-col flex">
      <Navbar />
      <div className="flex-grow min-h-screen">{children}</div>
      <Footer />
    </div>
  </Suspense>
);

// Create router configuration
const App = createBrowserRouter([
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <LandingView />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/about",
    element: (
      <SuspenseWrapper>
        <AboutView />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <SuspenseWrapper>
        <SignupView />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginView />
      </SuspenseWrapper>
    ),
  },
  // {
  //   path: "/about",
  //   element: (
  //     <SuspenseWrapper>
  //       <AboutView />
  //     </SuspenseWrapper>
  //   ),
  // },
  {
    path: "/dashboard",
    element: (
      <SuspenseWrapper>
        <RequireAuth>
          <DashboardView />
        </RequireAuth>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/room/:roomId",
    element: (
      <RequireAuth>
        <SuspenseWrapper>
          <MeetingView />
        </SuspenseWrapper>
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
]);

export default App;
