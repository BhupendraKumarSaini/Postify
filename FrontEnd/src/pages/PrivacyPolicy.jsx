import React, { useEffect, memo } from "react";
import SEO from "../components/SEO";

/* PRIVACY POLICY */
const PrivacyPolicy = () => {
  /* SCROLL TO TOP */
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // ignore
    }
  }, []);

  const handleSupportClick = (e) => {
    e.preventDefault();

    const email = "support@postify.com";
    const subject = encodeURIComponent("Postify Support");
    const body = encodeURIComponent("Hi Postify Team,");

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      // Native mail client
      window.location.href = mailtoLink;

      // Fallback to Gmail
      setTimeout(() => {
        const gmailLink = `https://mail.google.com/mail/?view=cm&to=${email}&su=${subject}&body=${body}`;
        window.open(gmailLink, "_blank", "noopener,noreferrer");
      }, 800);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how Postify collects, uses, and protects your personal information."
      />

      <section
        aria-labelledby="privacy-heading"
        className="max-w-4xl mx-auto px-4 py-10 my-10 font-[Poppins] text-gray-700 bg-[#F9FAFB]  rounded-2xl"
      >
        {/* HEADER */}
        <header className="mb-12">
          <h1
            id="privacy-heading"
            className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-4"
          >
            Privacy Policy
          </h1>

          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* CONTENT */}
        <div className="space-y-8 leading-relaxed text-base">
          <p>
            Welcome to <strong>Postify</strong>. Your privacy is important to
            us. This Privacy Policy explains how we collect, use, and protect
            your information when you use our platform.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal information such as your name, email
              address, profile information, and any content you create or
              publish on Postify.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              Your information is used to operate and improve the Postify
              platform, manage user accounts, personalize content, and
              communicate important updates or security-related messages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              3. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar technologies to keep you logged in,
              remember your preferences, and analyze how users interact with the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              4. Data Protection
            </h2>
            <p>
              We implement reasonable security measures to protect your data
              from unauthorized access, loss, misuse, or alteration. However, no
              internet-based service can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              5. Third-Party Services
            </h2>
            <p>
              Postify may contain links to third-party websites or services. We
              are not responsible for the privacy practices or content of those
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page, and continued use of Postify
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              7. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              you can contact us at{" "}
              <button
                type="button"
                onClick={handleSupportClick}
                className="text-[#065F46] font-medium underline active:scale-95 transition"
              >
                support@postify.com
              </button>
              .
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default memo(PrivacyPolicy);
