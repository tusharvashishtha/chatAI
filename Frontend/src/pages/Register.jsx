import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

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

      toast.success("Registered successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="w-full h-screen flex bg-black">
      <div className="h-full w-1/2">
        <img
          src="https://w.wallhaven.cc/full/4v/wallhaven-4v2535.jpg"
          className="w-full h-full object-cover brightness-60"
          alt=""
        />
      </div>

      <div className="h-full w-1/2 flex flex-col items-center justify-center gap-y-4 text-white">
        <h1 className="font-Chillax text-5xl font-medium mb-5">
          Wellcome to Aiva
        </h1>

        <form
          className="px-6 py-5 border font-Satoshi border-white/20 w-3/5 rounded-md"
          onSubmit={handleSubmit}
        >
          <h1 className="font-Chillax text-2xl font-medium mb-4 uppercase tracking-widest text-center">
            Register
          </h1>

          <div className="w-full flex flex-col gap-y-1 mb-4">
            <small>Email</small>
            <input
              type="email"
              placeholder="example@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="outline-none border-2 rounded px-2 py-1 border-white/20 bg-transparent text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-y-1 mb-4">
            <small>First Name</small>
            <input
              placeholder="First name"
              value={form.firstname}
              onChange={(e) =>
                setForm({ ...form, firstname: e.target.value })
              }
              required
              className="outline-none border-2 rounded px-2 py-1 border-white/20 bg-transparent text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-y-1 mb-4">
            <small>Last Name</small>
            <input
              placeholder="Last name"
              value={form.lastname}
              onChange={(e) =>
                setForm({ ...form, lastname: e.target.value })
              }
              required
              className="outline-none border-2 rounded px-2 py-1 border-white/20 bg-transparent text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-y-1 mb-8">
            <small>Password</small>
            <input
              type="password"
              placeholder="•••••••••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              className="outline-none border-2 rounded px-2 py-1 border-white/20 bg-transparent text-white"
            />
          </div>

          <button className="bg-white cursor-pointer transition-colors duration-300 hover:bg-white/70 text-black w-full rounded py-2 mb-4">
            Register
          </button>

          <div className="text-sm text-zinc-400 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:text-white/70 transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
