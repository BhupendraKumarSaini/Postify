import React, { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import BlogCards from "./BlogCards";
import { fetchTrendingBlogs } from "../services/blog";

/* ANIMATION VARIANTS */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* TRENDING STORIES */
const TrendingStories = () => {
  const [blogs, setBlogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTrendingBlogs = async () => {
      try {
        const data = await fetchTrendingBlogs();

        const safeData = Array.isArray(data) ? data : [];

        // Backend-safe trending logic (most likes)
        const sortedByLikes = [...safeData]
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 6);

        setBlogs(sortedByLikes);
      } catch (error) {
        console.error("Failed to fetch trending blogs:", error);
        setBlogs([]);
      } finally {
        setLoaded(true);
      }
    };

    loadTrendingBlogs();
  }, []);

  return (
    <section
      aria-labelledby="trending-heading"
      className="py-20 bg-[#F9FAFB] font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <h2
          id="trending-heading"
          className="text-3xl font-semibold text-center text-[#064E3B] mb-12"
        >
          Trending Stories
        </h2>

        {loaded && blogs.length === 0 && (
          <p className="text-center text-gray-500">No trending stories yet.</p>
        )}

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog) => (
            <motion.div key={blog._id} variants={itemVariants}>
              <BlogCards blog={blog} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(TrendingStories);
