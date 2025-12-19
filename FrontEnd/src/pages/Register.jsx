import React, { useEffect, useState, memo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import SEO from "../components/SEO";

/* REGISTER */
const Register = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* SCROLL TO TOP */
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // ignore
    }
  }, []);

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirm.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Create account"
        description="Create a Postify account and start sharing your ideas with the world."
      />

      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]  px-4 font-[Poppins]">
        <motion.form
          onSubmit={handleSubmit}
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { duration: 0.5 }}
          className="bg-white  p-8 rounded-2xl w-full max-w-md shadow-xl"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-[#064E3B]">
            Create account
          </h1>

          {/* ERROR */}
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* NAME */}
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Name"
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:border-[#065F46]"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          {/* EMAIL */}
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:border-[#065F46]"
            value={form.email}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
              if (error) setError("");
            }}
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showP ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:border-[#065F46]"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => setShowP((v) => !v)}
              aria-label={showP ? "Hide password" : "Show password"}
              className="absolute right-4 top-3 text-gray-400 active:scale-95 transition disabled:opacity-50"
            >
              {showP ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-6">
            <label htmlFor="confirm" className="sr-only">
              Confirm password
            </label>
            <input
              id="confirm"
              type={showC ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:border-[#065F46]"
              value={form.confirm}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  confirm: e.target.value,
                }))
              }
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => setShowC((v) => !v)}
              aria-label={
                showC ? "Hide confirm password" : "Show confirm password"
              }
              className="absolute right-4 top-3 text-gray-400 active:scale-95 transition disabled:opacity-50"
            >
              {showC ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#065F46] text-white rounded-lg hover:bg-[#047857] transition disabled:opacity-50 active:scale-95"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#065F46] font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </motion.form>
      </div>
    </>
  );
};

export default memo(Register);
