import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "./register.css";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register", {
        email: form.email,
        fullname: {
          firstname: form.firstname,
          lastname: form.lastname,
        },
        password: form.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="center-min-h-screen">
      <div className="auth-wrapper">
        <div className="auth-title">Create your account</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="First name"
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            required
          />
          <input
            placeholder="Last name"
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button>Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
