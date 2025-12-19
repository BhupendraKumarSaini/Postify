import React, { memo } from "react";

/* BLOG FILTERS */
const categories = [
  "All",
  "Technology",
  "Programming",
  "Design",
  "AI",
  "Career",
  "Lifestyle",
];

const BlogFilters = ({
  search = "",
  category = "All",
  onSearchChange,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10 font-[Poppins]">
      {/* SEARCH */}
      <label className="sr-only" htmlFor="blog-search">
        Search blogs
      </label>
      <input
        id="blog-search"
        type="text"
        value={search}
        placeholder="Search blogs..."
        aria-label="Search blogs"
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-[#065F46]"
      />

      {/* CATEGORY */}
      <label className="sr-only" htmlFor="blog-category">
        Filter by category
      </label>
      <select
        id="blog-category"
        value={category}
        aria-label="Filter blogs by category"
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-0 py-2 rounded-lg border focus:outline-none focus:border-[#065F46] cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "All" ? "All Categories" : cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(BlogFilters);
