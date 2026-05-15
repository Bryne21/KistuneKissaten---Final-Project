import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import "./Login.css";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:1337/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.user.id);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }),
      );

      window.location.href = "/";
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        "Unable to reach the server. Please check if your backend is running.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <div className="login-card">
          <Typography component="h1" variant="h5" className="login-title">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 1, textAlign: "center", fontWeight: "bold" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="login-button"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

          </Box>
        </div>
        <Link href="/" className="back-link">
          ← Back to Kitsune Kissaten
        </Link>
      </Container>
    </div>
  );
}

export default Login;
