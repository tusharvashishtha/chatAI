import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input onChange={(e) => setForm({ ...form, firstname: e.target.value })} />
        <input onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
        <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;
