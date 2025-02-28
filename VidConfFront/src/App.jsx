import React from "react";
import RequireAuth from "./pages/RequireAuth";
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
const LandingView = lazy(() => import("./pages/LandingView"));
const SignupView = lazy(() => import("./pages/SignupView"));
const LoginView = lazy(() => import("./pages/LoginView"));
const DashboardView = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Component to handle loading state during lazy loading
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <div className="overflow-hidden min-h-screen flex-col flex">
      <Navbar />
      {children}
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
      <RequireAuth>
        <SuspenseWrapper>
          <DashboardView />
        </SuspenseWrapper>
      </RequireAuth>
    ),
  },
  // {
  //   path: "/room/:roomId",
  //   element: (
  //     <RequireAuth>
  //       <SuspenseWrapper>
  //         <Meeting />
  //       </SuspenseWrapper>
  //     </RequireAuth>
  //   ),
  // },
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
