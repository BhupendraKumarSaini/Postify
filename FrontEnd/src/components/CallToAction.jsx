import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ANIMATION */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/* CALL TO ACTION */
const CallToAction = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleClick = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const isLoggedIn = Boolean(localStorage.getItem("token"));
      navigate(isLoggedIn ? "/write" : "/login");
    } catch {
      navigate("/login");
    }
  };

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative py-24 text-white text-center font-[Poppins] overflow-hidden bg-linear-to-r from-[#064E3B] to-[#047857]"
    >
      {/* Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.6),transparent_70%)]" />

      <motion.div
        variants={reduceMotion ? undefined : fadeUp}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto px-4"
      >
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-semibold">
          Share your ideas with the world — start writing today.
        </h2>

        <motion.button
          type="button"
          onClick={handleClick}
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          aria-label="Create your first blog post"
          className="mt-8 px-8 py-3 rounded-lg bg-[#FACC15] text-[#064E3B] font-medium shadow-lg focus-visible:ring-2 focus-visible:ring-white"
        >
          Create Your First Post
        </motion.button>
      </motion.div>
    </section>
  );
};

export default memo(CallToAction);
