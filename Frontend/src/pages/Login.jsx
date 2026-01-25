import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "./login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/auth/login", form);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };
return (
  <div className="w-full h-screen flex bg-black">
    {/* LEFT IMAGE SIDE */}
    <div className="h-full w-1/2">
      <img
        src="https://w.wallhaven.cc/full/4v/wallhaven-4v2535.jpg"
        className="w-full h-full object-cover"
        alt=""
      />
    </div>

    {/* RIGHT FORM SIDE */}
    <div className="h-full w-1/2 flex flex-col items-center justify-center gap-y-4 text-white">
      <h1 className="font-Chillax text-5xl font-medium mb-5">
        Wellcome to Aiva
      </h1>

      <form
        className="px-6 py-5 border font-Satoshi border-white/20 w-3/5 rounded-md"
        onSubmit={handleSubmit}
      >
        <h1 className="font-Chillax text-2xl font-medium mb-4 uppercase tracking-widest text-center">
          Login
        </h1>

        {/* EMAIL */}
        <div className="w-full flex flex-col gap-y-1 mb-5">
          <small>Email</small>
          <input
            type="email"
            placeholder="example@example.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="outline-none border-2 rounded px-2 py-1 border-white/20 bg-transparent text-white"
          />
        </div>

        {/* PASSWORD */}
        <div className="w-full flex flex-col gap-y-1 mb-8">
          <small>Password</small>
          <input
            type="password"
            placeholder="•••••••••••••••"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="outline-none border-2 rounded px-2 py-1 border-white/20 bg-transparent text-white"
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={submitting}
          className="bg-white cursor-pointer transition-colors duration-300 hover:bg-white/70 text-black w-full rounded py-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>

        {/* FOOTER */}
        <div className="flex justify-between items-center text-sm text-zinc-400">
          <abbr
            title="Forget your password"
            className="no-underline cursor-pointer transition-colors duration-300 hover:text-zinc-200"
          >
            Forget Password?
          </abbr>

          <p>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-white hover:text-white/70 transition-colors duration-300"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
);

};

export default Login;
