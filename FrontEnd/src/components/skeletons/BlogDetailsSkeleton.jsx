import React, { memo } from "react";

const BlogDetailsSkeleton = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading blog details"
      className="animate-pulse px-4 max-w-4xl mx-auto py-20"
    >
      {/* Cover image */}
      <div className="h-96 bg-gray-200 rounded-2xl mb-10" />

      {/* Title & meta */}
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-10" />

      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
};

export default memo(BlogDetailsSkeleton);
