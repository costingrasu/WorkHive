import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MakeReservationPage from "./pages/MakeReservationPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import IntroAnimation from "./components/IntroAnimation";
import { useAuth } from "./context/AuthContext";

const MainLayout = () => {
  const { isLoggedIn } = useAuth();

  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !introFinished) {
      setShowIntro(true);
    }
  }, [isLoggedIn, introFinished]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIntroFinished(false);
      setShowIntro(false);
    }
  }, [isLoggedIn]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIntroFinished(true);
  };

  return (
    <div className="App">
      <Navbar />

      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <main>
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reserve",
        element: (
          <ProtectedRoute>
            <MakeReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading Application...</div>;

  return <RouterProvider router={router} />;
}

export default App;
