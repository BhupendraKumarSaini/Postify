import API from "./api";

/* AUTH SERVICES */

/**
 * LOGIN
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export const login = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw error; // already normalized by interceptor
  }
};

export const loginRequest = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

/**
 * REGISTER
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ token?: string, user?: object }>}
 */
export const register = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw error; // already normalized by interceptor
  }
};

export const registerRequest = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};
