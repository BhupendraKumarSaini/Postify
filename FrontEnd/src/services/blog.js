import API from "./api";

/* BLOG SERVICES */

/**
 * Get all blogs
 * @returns {Promise<Array>}
 */
export const getBlogs = async () => {
  try {
    const res = await API.get("/blogs");
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single blog by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getBlogById = async (id) => {
  try {
    const res = await API.get(`/blogs/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new blog
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export const createBlog = async (formData) => {
  try {
    const res = await API.post("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update existing blog
 * @param {string} id
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export const updateBlog = async (id, formData) => {
  try {
    const res = await API.put(`/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete blog
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteBlog = async (id) => {
  try {
    const res = await API.delete(`/blogs/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Like / Unlike blog
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const toggleLikeBlog = async (id) => {
  try {
    const res = await API.post(`/blogs/${id}/like`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Comment on blog
 * @param {string} id
 * @param {string} comment
 * @returns {Promise<Object>}
 */
export const commentBlog = async (id, comment) => {
  try {
    const res = await API.post(`/blogs/${id}/comment`, {
      text: comment,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Edit comment
export const editComment = async (blogId, commentId, text) => {
  const res = await API.put(`/blogs/${blogId}/comments/${commentId}`, { text });
  return res.data;
};

// Delete comment
export const deleteComment = async (blogId, commentId) => {
  const res = await API.delete(`/blogs/${blogId}/comments/${commentId}`);
  return res.data;
};

/**
 * Get trending blogs
 * @returns {Promise<Array>}
 */
export const fetchTrendingBlogs = async () => {
  try {
    const res = await API.get("/blogs/trending");
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's favorite blogs
 * @returns {Promise<Array>}
 */
export const getFavoriteBlogs = async () => {
  try {
    const res = await API.get("/blogs/favorites/me");
    return res.data;
  } catch (error) {
    throw error;
  }
};
