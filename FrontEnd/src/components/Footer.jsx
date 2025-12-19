import React, { memo } from "react";
import { Twitter, Instagram, Facebook } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const POSTIFY_SOCIALS = {
  twitter: "https://twitter.com/postify",
  instagram: "https://instagram.com/postify",
  facebook: "https://facebook.com/postify",
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let isLoggedIn = false;
  try {
    isLoggedIn = Boolean(localStorage.getItem("token"));
  } catch {
    isLoggedIn = false;
  }

  const goTo = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }
  };

  /* SUPPORT EMAIL HANDLER */
  const handleSupportClick = (e) => {
    e.preventDefault();

    const email = "support@postify.com";
    const subject = encodeURIComponent("Postify Support");
    const body = encodeURIComponent("Hi Postify Team,");

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // 1️⃣ Try native email app
    window.location.href = mailtoLink;

    // 2️⃣ Fallback to Gmail Web if nothing opens
    setTimeout(() => {
      const gmailLink = `https://mail.google.com/mail/?view=cm&to=${email}&su=${subject}&body=${body}`;
      window.open(gmailLink, "_blank", "noopener,noreferrer");
    }, 800);
  };

  return (
    <footer
      role="contentinfo"
      className="bg-white  border-t border-gray-200  font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          {/* Brand */}
          <div>
            <img
              src="/Navbar_Logo.png"
              alt="Postify home"
              className="w-40 mx-auto md:mx-0 cursor-pointer"
              onClick={() => goTo("/")}
            />
          </div>

          {/* Navigation */}
          <FooterColumn title="Navigation">
            <FooterButton onClick={() => goTo("/")}>Home</FooterButton>
            <FooterButton onClick={() => goTo("/blogs")}>Blogs</FooterButton>

            {!isLoggedIn && (
              <FooterButton onClick={() => goTo("/categories")}>
                Categories
              </FooterButton>
            )}

            {isLoggedIn && (
              <>
                <FooterButton onClick={() => goTo("/write")}>
                  Write
                </FooterButton>
                <FooterButton onClick={() => goTo("/favorites")}>
                  Favorites
                </FooterButton>
              </>
            )}
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources">
            <FooterButton onClick={() => goTo("/privacy-policy")}>
              Privacy Policy
            </FooterButton>
            <FooterButton onClick={() => goTo("/terms-of-service")}>
              Terms of Service
            </FooterButton>
            <FooterButton onClick={handleSupportClick}>Support</FooterButton>
          </FooterColumn>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-[#064E3B]  mb-3">
              Follow Postify
            </h4>
            <div className="flex justify-center md:justify-start gap-5">
              <SocialLink href={POSTIFY_SOCIALS.twitter} label="Twitter">
                <Twitter aria-hidden="true" />
              </SocialLink>
              <SocialLink href={POSTIFY_SOCIALS.instagram} label="Instagram">
                <Instagram aria-hidden="true" />
              </SocialLink>
              <SocialLink href={POSTIFY_SOCIALS.facebook} label="Facebook">
                <Facebook aria-hidden="true" />
              </SocialLink>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200  mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Postify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

/* SMALL COMPONENTS */

const FooterColumn = memo(({ title, children }) => (
  <div>
    <h4 className="text-sm font-semibold text-[#064E3B]  mb-3">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
));

const FooterButton = memo(({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="block w-full text-gray-600  hover:text-[#065F46] transition text-left"
  >
    {children}
  </button>
));

const SocialLink = memo(({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Postify on ${label}`}
    className="text-gray-400 hover:text-[#FACC15] transition"
  >
    {children}
  </a>
));

export default memo(Footer);
