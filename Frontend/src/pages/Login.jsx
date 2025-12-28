import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

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
      <form onSubmit={handleSubmit}>
        <input name="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input name="password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={submitting}>Login</button>
        <Link to="/register">Register</Link>
      </form>
    </div>
  );
};

export default Login;
