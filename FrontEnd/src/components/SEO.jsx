import { useEffect } from "react";

/* CONSTANTS */
const SITE_NAME = "Postify";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://postify.app";
const DEFAULT_IMAGE = "/Tab_Logo.png";
const DEFAULT_DESCRIPTION =
  "Postify is a modern blogging platform for creators and developers.";

/* SEO COMPONENT */
const SEO = ({
  title = "",
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = "",
  type = "website",
  author,
  publishedTime,
}) => {
  /* SAFE TITLE FORMAT */
  const fullTitle = title
    ? `${SITE_NAME} - ${title}`
    : `${SITE_NAME} - Write. Publish. Inspire.`;

  /* SAFE DESCRIPTION */
  const safeDescription =
    typeof description === "string" && description.trim()
      ? description
      : DEFAULT_DESCRIPTION;

  /* SAFE URL & IMAGE */
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage =
    typeof image === "string" && image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`;

  useEffect(() => {
    /* DOCUMENT TITLE */
    document.title = fullTitle;

    /* META HANDLER */
    const setMeta = (name, content, property = false) => {
      if (!content) return;

      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;

      let tag = document.querySelector(selector);

      if (!tag) {
        tag = document.createElement("meta");
        property ? (tag.property = name) : (tag.name = name);
        document.head.appendChild(tag);
      }

      tag.content = content;
    };

    /* BASIC META */
    setMeta("description", safeDescription);

    /* OPEN GRAPH */
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", safeDescription, true);
    setMeta("og:type", type, true);
    setMeta("og:url", fullUrl, true);
    setMeta("og:image", fullImage, true);
    setMeta("og:site_name", SITE_NAME, true);

    /* TWITTER */
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", safeDescription);
    setMeta("twitter:image", fullImage);

    /* ARTICLE META */
    if (type === "article") {
      if (author) {
        setMeta("article:author", author, true);
      }
      if (publishedTime) {
        setMeta("article:published_time", publishedTime, true);
      }
    }

    /* CANONICAL */
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;
  }, [
    fullTitle,
    safeDescription,
    fullImage,
    fullUrl,
    type,
    author,
    publishedTime,
  ]);

  return null;
};

export default SEO;
