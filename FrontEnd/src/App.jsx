import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* LAZY PAGES */
const Home = lazy(() => import("./pages/Home"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Categories = lazy(() => import("./components/Categories"));
const Write = lazy(() => import("./pages/Write"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/TermsofService"));

/* LOADER */
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
    Loading...
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="*"
              element={
                <div className="py-40 text-center text-gray-500">
                  Page not found
                </div>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/write" element={<Write />} />
            <Route path="/edit/:id" element={<Write />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<Terms />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
