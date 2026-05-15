import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/LandingPage";
import Students from "./pages/AdminPanel";
import Users from "./pages/AdminPanel";
import Login from "./pages/Login";

function App() {
  // Check if user data exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* If already logged in, redirect Login attempts to Home */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />

        {/* Public Routes */}
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/students"
          element={isAuthenticated ? <Students /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-user"
          element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
