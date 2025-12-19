export const calculateReadingTime = (html) => {
  if (!html || typeof html !== "string") {
    return "0 min read";
  }

  const text = html.replace(/<[^>]+>/g, "").trim();

  if (!text) {
    return "0 min read";
  }

  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
};
