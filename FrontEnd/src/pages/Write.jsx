import React, { useEffect, useRef, useState, memo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { createBlog, getBlogById, updateBlog } from "../services/blog";

const categories = [
  "Technology",
  "Programming",
  "Design",
  "AI",
  "Career",
  "Lifestyle",
];

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/* WRITE / EDIT BLOG */
const Write = () => {
  const [showWarning, setShowWarning] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const editorRef = useRef(null);

  const [initialContent, setInitialContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(id);

  /* CLEANUP COVER PREVIEW */
  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  /* AUTH + LOAD BLOG */
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // ignore
    }

    let token = null;
    try {
      token = localStorage.getItem("token");
    } catch {
      token = null;
    }

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isEditMode) return;

    const loadBlog = async () => {
      try {
        const blog = await getBlogById(id);

        setTitle(blog.title || "");
        setCategory(blog.category || "");
        setInitialContent(blog.content || "");

        if (blog.cover) {
          setCoverPreview(`${API_BASE_URL}${blog.cover}`);
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      }
    };

    loadBlog();
  }, [id, isEditMode, navigate]);

  /* PUBLISH / UPDATE */
  const handlePublish = async () => {
    if (loading) return;

    const content = editorRef.current?.getContent();

    if (!title.trim() || !category || !content?.trim()) {
      setShowWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("content", content);
    if (cover) formData.append("cover", cover);

    try {
      setLoading(true);

      if (isEditMode) {
        await updateBlog(id, formData);
      } else {
        await createBlog(formData);
      }

      navigate("/blogs", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Failed to publish blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={isEditMode ? "Edit Story" : "Write a New Story"}
        description="Create and publish a blog post on Postify."
      />

      {/* VALIDATION MODAL */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowWarning(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-xl font-semibold text-[#064E3B] mb-3">
              Missing information
            </h3>

            <p className="text-gray-600 mb-6">
              Please add a title, select a category, and write some content
              before publishing your story.
            </p>

            <button
              type="button"
              onClick={() => setShowWarning(false)}
              className="px-6 py-2 rounded-lg bg-[#065F46] text-white hover:bg-[#047857] transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-white  font-[Poppins]"
      >
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-28 ">
          {/* HEADER */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#064E3B] mb-2">
            {isEditMode ? "Edit story" : "Write a new story"}
          </h1>
          <p className="text-gray-500 mb-10">
            Share your ideas with clarity and style.
          </p>

          {/* COVER IMAGE */}
          <div className="mb-10">
            {!coverPreview && (
              <label className="inline-flex items-center px-6 py-3 bg-[#065F46] hover:bg-[#047857] text-white rounded-lg cursor-pointer transition">
                Add cover image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCover(file);
                    setCoverPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}

            {coverPreview && (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-56 sm:h-80 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCover(null);
                    setCoverPreview("");
                  }}
                  aria-label="Remove cover image"
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* TITLE */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
            className="w-full text-2xl sm:text-4xl font-bold outline-none mb-10 border-b pb-2"
          />

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-8 border rounded-lg px-0 py-2 cursor-pointer focus:outline-none focus:border-[#065F46]"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* EDITOR */}
          <div className="mb-12">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_KEY}
              onInit={(_, editor) => (editorRef.current = editor)}
              initialValue={initialContent}
              init={{
                height: 420,
                menubar: false,
                branding: false,
                plugins: ["lists", "link", "image", "table", "code"],
                toolbar: "undo redo | bold italic underline | bullist numlist | link image table code",
                content_style: "body { font-family: Poppins, sans-serif; font-size: 16px }",
              }}
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-[#065F46] hover:bg-[#047857] text-white font-medium transition disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Publishing..."
                : isEditMode
                ? "Update story"
                : "Publish story"}
            </button>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default memo(Write);
