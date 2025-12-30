import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./register.css";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/api/auth/register", {
        email: form.email,
        fullname: {
          firstname: form.firstname,
          lastname: form.lastname,
        },
        password: form.password,
      })
      .then(() => navigate("/"));
  };

  return (
    <div className="center-min-h-screen">
      <div className="auth-wrapper">
        <div className="auth-title">Create a new account</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="First name"
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          />
          <input
            placeholder="Last name"
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
