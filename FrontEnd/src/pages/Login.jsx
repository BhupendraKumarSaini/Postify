import React, { useEffect, useState, memo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/auth";
import { useAuth } from "../context/AuthContext";

/* LOGIN */
const Login = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* SCROLL TO TOP */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginRequest({
        email: email.trim(),
        password: password.trim(),
      });

      // CENTRALIZED AUTH
      login(data.token, data.user);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]  px-4 font-[Poppins]">
      <motion.form
        onSubmit={handleSubmit}
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { duration: 0.5 }}
        className="bg-white  p-8 rounded-2xl w-full max-w-md shadow-xl"
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-[#064E3B]">
          Login to Postify
        </h1>

        {/* ERROR */}
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoFocus
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:border-[#065F46]"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
        />

        {/* PASSWORD */}
        <div className="relative mb-6">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:border-[#065F46]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-4 top-3 text-gray-400 active:scale-95 transition disabled:opacity-50"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#065F46] text-white rounded-lg hover:bg-[#047857] transition disabled:opacity-50 active:scale-95"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER */}
        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-[#065F46] font-medium hover:underline"
          >
            Register
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default memo(Login);
