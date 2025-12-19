import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const BlogCard = memo(({ blog }) => {
  if (!blog) return null;

  const likes = blog.likes?.length || 0;

  const author =
    typeof blog.author === "object"
      ? blog.author?.name
      : blog.author || "Unknown";

  const cover = blog.cover
    ? `${API_BASE_URL}${blog.cover}`
    : "/placeholder.jpg";

  const createdAt = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden focus-within:ring-2 focus-within:ring-[#FACC15]"
    >
      <Link
        to={`/blogs/${blog._id}`}
        aria-label={`Read blog: ${blog.title}`}
        className="flex flex-col h-full"
      >
        {/* IMAGE */}
        <img
          src={cover}
          alt={blog.title || "Blog cover"}
          loading="lazy"
          decoding="async"
          className="h-48 w-full /*object-cover*/"
        />

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-[#064E3B] line-clamp-2 mb-3">
            {blog.title}
          </h3>

          <div className="flex justify-between text-sm text-gray-500  mb-4">
            <span className="truncate max-w-[60%]">{author}</span>
            {createdAt && <time>{createdAt}</time>}
          </div>

          <div
            className="mt-auto flex items-center gap-2 text-sm font-medium text-[#064E3B] "
            aria-label={`${likes} likes`}
          >
            <Heart size={16} className="text-red-500" aria-hidden="true" />
            {likes}
          </div>
        </div>
      </Link>
    </article>
  );
});

export default BlogCard;
