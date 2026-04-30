import React, { useState } from "react";
import authService from "../api/authService";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!trimmedPassword) {
      setError("Please enter your password");
      return;
    }

    try {
      const data = await authService.login(trimmedEmail, trimmedPassword);
      localStorage.setItem("userId", data.data.userId);
      localStorage.setItem("Token", data.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again " + err.message);
    }
  };
  return (
    <div className={`page-container ${styles.loginWrapper}`}>
      <div className={`card ${styles.formCard}`}>
        <h1 className={styles.heading}>Login Page</h1>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={`btn btn-primary ${styles.submitBtn}`} type="submit">Login</button>

          <div className={styles.footerText}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
