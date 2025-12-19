import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus } from "lucide-react";
import DOMPurify from "dompurify";

import {
  getBlogById,
  getBlogs,
  toggleLikeBlog,
  commentBlog,
  editComment,
  deleteComment,
} from "../services/blog";

import BlogCard from "../components/BlogCards";
import ReadingProgress from "../components/ReadingProgress";
import { calculateReadingTime } from "../utils/readingTime";
import SEO from "../components/SEO";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const BlogDetails = () => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const isOwner = (commentUserId) => user && commentUserId === user._id;

  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(() => {
    try {
      return Number(localStorage.getItem("fontSize")) || 18;
    } catch {
      return 18;
    }
  });

  let isLoggedIn = false;
  let user = null;

  try {
    isLoggedIn = Boolean(localStorage.getItem("token"));
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    isLoggedIn = false;
    user = null;
  }

  /* SCROLL TO TOP */
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  /* LOAD BLOG */
  useEffect(() => {
    const load = async () => {
      try {
        const blogData = await getBlogById(id);
        const blogsData = await getBlogs();

        setBlog(blogData);
        setAllBlogs(Array.isArray(blogsData) ? blogsData : []);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* SAVE FONT SIZE */
  useEffect(() => {
    try {
      localStorage.setItem("fontSize", fontSize);
    } catch {
      /* ignore */
    }
  }, [fontSize]);

  /* LIKE */
  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const updatedBlog = await toggleLikeBlog(id);
      setBlog(updatedBlog);
    } catch {
      /* ignore */
    }
  };

  /* COMMENT */
  const handleComment = async () => {
    if (!isLoggedIn || !comment.trim()) return;

    try {
      await commentBlog(id, comment.trim());

      // 🔔 tell navbar notifications changed
      window.dispatchEvent(new Event("notifications:update"));

      // 🔄 reload blog so comments appear
      const updatedBlog = await getBlogById(id);
      setBlog(updatedBlog);

      setComment("");
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <p className="py-20 text-center">Loading…</p>;
  }

  if (!blog) return null;

  const isLiked = blog.likes?.includes(user?._id);
  const readingTime = calculateReadingTime(blog.content || "");

  const relatedBlogs = allBlogs
    .filter((b) => b._id !== blog._id)
    .filter(
      (b) => b.category === blog.category || b.author?._id === blog.author?._id
    )
    .slice(0, 3);

  const cleanDescription =
    typeof blog.content === "string"
      ? blog.content.replace(/<[^>]+>/g, "").slice(0, 160)
      : "Read this blog on Postify.";

  return (
    <>
      <SEO title={blog.title} description={cleanDescription} />

      <ReadingProgress />

      <article className="bg-white  font-[Poppins]">
        {/* HEADER */}
        <div className="max-w-5xl mx-auto pt-24 px-4">
          <img
            src={
              blog.cover ? `${API_BASE_URL}${blog.cover}` : "/placeholder.jpg"
            }
            alt={blog.title}
            loading="lazy"
            className="w-full h-60 sm:h-100  rounded-2xl shadow /*object-cover*/"
          />

          <h1 className="mt-10 text-4xl md:text-5xl font-bold text-[#064E3B] ">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500 ">
            <span className="font-medium text-[#065F46] ">
              {blog.author?.name}
            </span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>• {readingTime}</span>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                aria-label="Decrease font size"
                className="p-1 border rounded"
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                aria-label="Increase font size"
                className="p-1 border rounded"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto px-4 mt-12">
          <div
            className="prose prose-lg  max-w-none"
            style={{ fontSize }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>

        {/* LIKE */}
        <div className="max-w-3xl mx-auto px-4 mt-16">
          <button
            type="button"
            onClick={handleLike}
            aria-pressed={isLiked}
            className="flex items-center gap-2 px-6 py-3 rounded-full border"
          >
            <Heart
              size={18}
              aria-hidden="true"
              className={
                isLiked ? "fill-[#FACC15] text-[#FACC15]" : "text-gray-600"
              }
            />
            {blog.likes?.length || 0} likes
          </button>
        </div>

        {/* COMMENTS */}
        <div className="max-w-3xl mx-auto px-4 mt-20">
          <h3 className="text-xl font-semibold text-[#064E3B]  mb-6">
            Comments
          </h3>

          {blog.comments?.map((c) => (
            <div key={c._id} className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="flex justify-between items-start">
                <p className="font-medium">{c.user?.name}</p>

                {isOwner(c.user?._id) && (
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditText(c.text);
                      }}
                      className="text-[#065F46]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(c)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* EDIT MODE */}
              {editingId === c._id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border rounded-lg p-2 mt-2"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={async () => {
                        if (!editText.trim()) return;
                        await editComment(blog._id, c._id, editText.trim());
                        const updated = await getBlogById(blog._id);
                        setBlog(updated);
                        setEditingId(null);
                      }}
                      className="px-4 py-1 bg-[#065F46] text-white rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1 border rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 mt-1">{c.text}</p>
              )}
            </div>
          ))}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-xl p-4 "
            placeholder="Write your comment…"
          />

          <button
            type="button"
            onClick={handleComment}
            className="mt-4 bg-[#065F46] text-white px-6 py-3 rounded-lg mb-10"
          >
            Post Comment
          </button>
        </div>

        {/* RELATED */}
        {relatedBlogs.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 mt-28 pb-32">
            <h3 className="text-2xl font-semibold mb-8 ">Related Stories</h3>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          </section>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-semibold text-[#064E3B]">
                Delete comment?
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await deleteComment(blog._id, deleteTarget._id);
                    const updated = await getBlogById(blog._id);
                    setBlog(updated);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default memo(BlogDetails);
