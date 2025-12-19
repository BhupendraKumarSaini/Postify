import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Camera, Pencil, Trash2 } from "lucide-react";
import API from "../services/api";
import SEO from "../components/SEO";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/* USER PROFILE */
const UserProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* EDIT FIELDS */
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  /* CLEANUP AVATAR PREVIEW */
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* LOAD PROFILE */
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

    const loadProfile = async () => {
      try {
        const res = await API.get("/users/me");

        setProfile(res.data.user);
        setBlogs(res.data.blogs || []);
        setAvatarPreview(
          res.data.user.avatar ? `${API_BASE_URL}${res.data.user.avatar}` : ""
        );
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return <p className="py-20 text-center">Loading profile...</p>;
  }

  if (!profile) return null;

  /* AVATAR */
  const avatarUrl = profile.avatar
    ? `${API_BASE_URL}${profile.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.name
      )}&background=065F46&color=fff`;

  /* EDIT PROFILE */
  const openEditProfile = () => {
    setEditName(profile.name);
    setEditBio(profile.bio || "");
    setAvatarPreview(avatarUrl);
    setAvatarFile(null);
    setEditOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("bio", editBio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await API.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setEditOpen(false);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  /* DELETE BLOG */
  const confirmDelete = async () => {
    try {
      await API.delete(`/blogs/${deleteTarget._id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* STATS */
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);

  return (
    <>
      <SEO
        title="My Profile"
        description="Manage your Postify profile and blogs."
      />

      <section className="py-20 max-w-6xl mx-auto px-4 bg-white  font-[Poppins]">
        {/* PROFILE HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 bg-gray-100 px-5 py-5 rounded-3xl border border-gray-200">
          <img
            src={avatarUrl}
            alt={profile.name}
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-[#064E3B]">
              {profile.name}
            </h1>

            <p className="text-gray-600 mt-1 whitespace-pre-line">
              {profile.bio || "No bio added yet."}
            </p>

            <div className="flex justify-center sm:justify-start gap-6 mt-4 text-sm">
              <span>📝 {blogs.length} Blogs</span>
              <span>❤️ {totalLikes} Likes</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openEditProfile}
            className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* MY BLOGS */}
        <h2 className="text-xl font-semibold mb-6">My Blogs</h2>

        {blogs.length === 0 && (
          <div className="text-gray-500 text-center py-10">
            <p>No blogs yet.</p>
            <button
              type="button"
              onClick={() => navigate("/write")}
              className="mt-4 text-[#065F46] underline"
            >
              Write your first blog
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white  rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <Link to={`/blogs/${blog._id}`}>
                <img
                  src={`${API_BASE_URL}${blog.cover}`}
                  alt={blog.title}
                  className="h-40 w-full object-cover"
                />
              </Link>

              <div className="p-4">
                <h3 className="font-medium text-[#064E3B] line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toDateString()}
                </p>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/edit/${blog._id}`}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Pencil size={14} /> Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(blog)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DELETE MODAL */}
        {deleteTarget && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          >
            <div className="bg-white  w-full max-w-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[#064E3B]">
                Delete Blog?
              </h3>

              <p className="text-gray-600 mt-2">
                Are you sure you want to delete{" "}
                <span className="font-medium">“{deleteTarget.title}”</span>?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {editOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          >
            <div className="bg-white  w-full max-w-md rounded-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold text-[#064E3B] mb-6">
                Edit Profile
              </h2>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={avatarPreview || avatarUrl}
                    className="w-24 h-24 rounded-full object-cover border"
                    alt="Avatar"
                  />
                  <label className="absolute bottom-0 right-0 bg-[#065F46] p-2 rounded-full cursor-pointer">
                    <Camera size={16} className="text-white" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                placeholder="Name"
              />

              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full mb-6 px-4 py-2 border rounded-lg resize-none"
                placeholder="Bio"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  className="px-6 py-2 bg-[#065F46] hover:bg-[#047857] text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default memo(UserProfile);
