import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const features = [
  "Clean Writing Experience",
  "SEO-Friendly Blogs",
  "Like & Comment System",
  "Fast Performance",
  "Secure Authentication",
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const WhyChoosePostify = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="why-postify-heading"
      className="py-20 bg-[#F9FAFB] font-[Poppins]"
    >
      <motion.div
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 text-center"
      >
        <motion.h2
          id="why-postify-heading"
          variants={reduceMotion ? undefined : popIn}
          className="text-2xl md:text-3xl font-semibold text-[#064E3B]  mb-12"
        >
          Why Choose Postify
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((text) => (
            <motion.div
              key={text}
              variants={reduceMotion ? undefined : popIn}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="bg-white p-6 rounded-xl font-medium text-[#064E3B] shadow-sm"
            >
              {text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(WhyChoosePostify);
