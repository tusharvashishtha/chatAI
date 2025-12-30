import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    api
      .post("/api/auth/login", form)
      .then(() => navigate("/"))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="center-min-h-screen">
      <div className="auth-wrapper">
        <div className="auth-title">Sign in to continue</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button disabled={submitting}>Login</button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
