import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore storage / parsing errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (authToken, authUser) => {
    try {
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(authUser));
    } catch {
      // Ignore storage errors
    }

    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // Ignore storage errors
    }

    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
