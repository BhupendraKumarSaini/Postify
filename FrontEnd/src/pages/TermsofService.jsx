import React, { useEffect, memo } from "react";
import SEO from "../components/SEO";

/* TERMS OF SERVICE */
const Terms = () => {
  /* SCROLL TO TOP */
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read Postify's terms of service and usage guidelines."
      />

      <section
        aria-labelledby="terms-heading"
        className="max-w-4xl mx-auto px-4 py-10 my-10 rounded-2xl font-[Poppins] text-gray-700 bg-[#F9FAFB] "
      >
        {/* HEADER */}
        <header className="mb-12">
          <h1
            id="terms-heading"
            className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-4"
          >
            Terms of Service
          </h1>

          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* CONTENT */}
        <div className="space-y-8 leading-relaxed text-base">
          <p>
            By accessing or using <strong>Postify</strong>, you agree to comply
            with and be bound by these Terms of Service.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              1. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              2. User Content
            </h2>
            <p>
              You retain ownership of your content. By publishing content on
              Postify, you grant us a non-exclusive license to display,
              distribute, and promote it on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              3. Prohibited Activities
            </h2>
            <p>
              You agree not to misuse the platform, attempt unauthorized access,
              post harmful or illegal content, or violate any applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              4. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these Terms of Service or harm the integrity of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#064E3B] mb-2">
              5. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of
              Postify after changes constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default memo(Terms);
