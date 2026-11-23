
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";

import "./App.css";

// PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" replace />;
}

// PUBLIC ROUTE
function PublicRoute({ children }) {
  const { token } = useAuth();

  return token ? <Navigate to="/" replace /> : children;
}

// APP ROUTES AND THEME MANAGEMENT
function AppRoutes() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("connectly-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("connectly-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <div className="app-wrapper">

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />

        {/* EXPLORE */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />

        {/* INVALID ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </div>
  );
}

// MAIN APP
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
