import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/* NAVBAR */
const Navbar = () => {
  const unreadCount = useNotifications();

  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* LOCK BODY SCROLL (MOBILE MENU) */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* CLOSE MENUS WITH ESC */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const avatarUrl = user?.avatar ? `${API_BASE_URL}${user.avatar}` : null;

  const navLink = useCallback(
    ({ isActive }) =>
      `
       text-[#064E3B] 
       font-medium transition
       hover:text-[#065F46] 
       ${isActive ? "border-b-2 border-[#FACC15]" : ""}
      `,
    []
  );

  return (
    <nav className="sticky top-0 z-50 bg-white  shadow font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/" aria-label="Postify home">
            <img src="/Navbar_Logo.png" className="w-28" alt="Postify logo" />
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden text-gray-700  p-2 rounded-lg"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLink}>
              Home
            </NavLink>
            <NavLink to="/blogs" className={navLink}>
              Blogs
            </NavLink>
            <NavLink to="/categories" className={navLink}>
              Categories
            </NavLink>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-[#065F46] hover:bg-[#047857] text-white transition"
              >
                Login
              </Link>
            )}

            {isAuthenticated && user && (
              <>
                <NavLink to="/write" className={navLink}>
                  Write
                </NavLink>
                <NavLink to="/favorites" className={navLink}>
                  Favorites
                </NavLink>

                {/* NOTIFICATIONS */}
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 hover:text-amber-500"
                >
                  <Bell size={20} />

                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-4.5 h-4.5 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* AVATAR DROPDOWN */}
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    aria-label="User menu"
                    className="flex items-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#ECFDF5]  flex items-center justify-center font-semibold text-[#064E3B]  overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className="text-gray-500 "
                      aria-hidden="true"
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      role="menu"
                      aria-label="User menu"
                      className="absolute right-0 mt-3 w-40 bg-white  rounded-xl shadow overflow-hidden"
                    >
                      <Link
                        role="menuitem"
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-50 "
                      >
                        My Profile
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 "
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden border-t  py-6">
            <div className="flex flex-col items-center gap-6 text-lg">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={navLink}
              >
                Home
              </NavLink>

              <NavLink
                to="/blogs"
                onClick={() => setMenuOpen(false)}
                className={navLink}
              >
                Blogs
              </NavLink>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-2 rounded-lg bg-[#065F46] text-white"
                >
                  Login
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/write"
                    onClick={() => setMenuOpen(false)}
                    className={navLink}
                  >
                    Write
                  </NavLink>
                  <NavLink
                    to="/favorites"
                    onClick={() => setMenuOpen(false)}
                    className={navLink}
                  >
                    Favorites
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={navLink}
                  >
                    My Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navbar);
