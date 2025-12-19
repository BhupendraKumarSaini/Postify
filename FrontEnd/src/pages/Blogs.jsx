import React, { useEffect, useMemo, useState, memo } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/BlogCards";
import BlogFilters from "../components/BlogFilters";
import { getBlogs } from "../services/blog";
import SEO from "../components/SEO";

const Blogs = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBlogs();
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* MEMOIZED FILTERING */
  const filteredBlogs = useMemo(() => {
    const q = search.toLowerCase();

    return blogs.filter((blog) => {
      const title = blog.title?.toLowerCase() || "";
      const author =
        typeof blog.author === "object"
          ? blog.author?.name?.toLowerCase()
          : blog.author?.toLowerCase() || "";

      return (
        (title.includes(q) || author.includes(q)) &&
        (category === "All" || blog.category === category)
      );
    });
  }, [blogs, search, category]);

  return (
    <>
      <SEO title="Blogs" description="Explore all blogs on Postify" />

      <section aria-labelledby="blogs-heading" className="py-20 bg-white ">
        <div className="max-w-7xl mx-auto px-4 font-[Poppins]">
          <h1 id="blogs-heading" className="sr-only">
            Blogs
          </h1>

          <BlogFilters
            search={search}
            category={category}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
          />

          {loading && (
            <p className="text-center text-gray-500">Loading blogs...</p>
          )}

          {!loading && filteredBlogs.length === 0 && (
            <p className="text-center text-gray-500">No blogs found.</p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(Blogs);
