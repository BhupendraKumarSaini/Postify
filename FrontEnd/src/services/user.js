import API from "./api";

/* USER SERVICES */

/**
 * Get logged-in user's profile and blogs
 * @returns {Promise<{ user: Object, blogs: Array }>}
 */
export const getProfile = async () => {
  try {
    const res = await API.get("/users/me");
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile (name, bio, avatar)
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export const updateProfile = async (formData) => {
  try {
    const res = await API.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
