import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ORB CONFIG */

const orbVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0.7, 1, 1, 0.8],
    y: [0, -6, 0], // subtle life movement
  },
};

const ORBS = [
  // top area
  { top: "12%", left: "15%", size: 7, delay: 0.2, color: "green" },
  { top: "18%", left: "30%", size: 9, delay: 1.1, color: "gold" },
  { top: "15%", left: "55%", size: 6, delay: 2.4, color: "green" },
  { top: "22%", left: "75%", size: 8, delay: 0.8, color: "gold" },

  // middle
  { top: "38%", left: "10%", size: 10, delay: 1.9, color: "gold" },
  { top: "42%", left: "28%", size: 6, delay: 0.4, color: "green" },
  { top: "45%", left: "50%", size: 8, delay: 2.8, color: "gold" },
  { top: "40%", left: "70%", size: 7, delay: 1.3, color: "green" },
  { top: "48%", left: "85%", size: 9, delay: 2.1, color: "gold" },

  // bottom
  { top: "65%", left: "20%", size: 8, delay: 0.6, color: "green" },
  { top: "72%", left: "35%", size: 6, delay: 1.7, color: "gold" },
  { top: "68%", left: "55%", size: 9, delay: 2.6, color: "green" },
  { top: "75%", left: "72%", size: 7, delay: 0.9, color: "gold" },
  { top: "80%", left: "88%", size: 6, delay: 2.2, color: "green" },
];

const Hero = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  let isLoggedIn = false;
  try {
    isLoggedIn = Boolean(localStorage.getItem("token"));
  } catch {
    isLoggedIn = false;
  }

  const handleStartWriting = () => {
    navigate(isLoggedIn ? "/write" : "/login");
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden py-28 md:py-37 text-center font-[Poppins] bg-white"
    >
      {/* LIVING ORBS BACKGROUND */}
      {!reduceMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {ORBS.map((orb, i) => (
            <motion.span
              key={i}
              variants={orbVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 4.5,
                delay: orb.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full"
              style={{
                top: orb.top,
                left: orb.left,
                width: orb.size,
                height: orb.size,
                backgroundColor: orb.color === "gold" ? "#FACC15" : "#047857",
                boxShadow:
                  orb.color === "gold"
                    ? "0 0 10px rgba(250,204,21,0.6)"
                    : "0 0 8px rgba(4,120,87,0.5)",
              }}
            />
          ))}
        </div>
      )}

      {/* CONTENT */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto px-4"
      >
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl font-bold text-[#064E3B]"
        >
          Write. Publish. Inspire.
        </h1>

        <p className="mt-6 text-lg text-gray-600 ">
          Create beautiful blog posts, share your ideas with the world, and grow
          your audience on{" "}
          <span className="font-medium text-[#064E3B]">Postify</span>.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <motion.button
            onClick={handleStartWriting}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-[#065F46] text-white font-medium hover:bg-[#047857] shadow-md"
          >
            Start Writing
          </motion.button>

          <motion.button
            onClick={() => navigate("/blogs")}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg border border-[#064E3B] text-[#064E3B] hover:bg-[#ECFDF5]"
          >
            Explore Blogs
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default memo(Hero);
