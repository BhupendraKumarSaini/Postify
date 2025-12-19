import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* DATA */
const categories = [
  "Technology",
  "Programming",
  "Design",
  "AI",
  "Career",
  "Lifestyle",
];

/* ANIMATION */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Categories = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleSelect = (category) => {
    navigate(`/blogs?category=${encodeURIComponent(category)}`);
  };

  return (
    <section
      aria-labelledby="categories-heading"
      className="py-20 bg-white font-[Poppins]"
    >
      <motion.div
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 text-center"
      >
        <motion.h2
          id="categories-heading"
          variants={reduceMotion ? undefined : fadeUp}
          className="text-2xl md:text-3xl font-semibold text-[#064E3B] mb-12"
        >
          Explore by Category
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              variants={reduceMotion ? undefined : fadeUp}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      boxShadow: "0 0 32px rgba(250, 204, 21, 0.55)",
                    }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
              }}
              onClick={() => handleSelect(cat)}
              aria-label={`Browse blogs in ${cat}`}
              className="p-6 rounded-xl border border-gray-200 bg-white text-[#064E3B] font-medium transition hover:border-[#FACC15] focus:outline-none focus:ring-2 focus:ring-[#FACC15] active:scale-95"
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(Categories);
