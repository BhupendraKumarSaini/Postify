import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";

import BlogCard from "../components/BlogCards";
import { getFavoriteBlogs } from "../services/blog";
import SEO from "../components/SEO";

/* FAVORITES */
const Favorites = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch {
    token = null;
  }

  /* LOAD FAVORITES */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadFavorites = async () => {
      try {
        const data = await getFavoriteBlogs();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [token, navigate]);

  return (
    <>
      <SEO title="Favorites" description="Your favorite blogs on Postify" />

      <section
        aria-labelledby="favorites-heading"
        className="py-20 bg-white  font-[Poppins]"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1
            id="favorites-heading"
            className="text-2xl font-semibold text-[#064E3B] mb-8 text-center"
          >
            Your Favorites
          </h1>

          {/* Loading */}
          {loading && (
            <p className="text-gray-500 text-center">Loading favorites...</p>
          )}

          {/* Empty */}
          {!loading && blogs.length === 0 && (
            <p className="text-gray-500 text-center">No favorite blogs yet.</p>
          )}

          {/* Grid */}
          {!loading && blogs.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default memo(Favorites);
