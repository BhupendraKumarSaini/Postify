import React, { memo } from "react";

const BlogCardSkeleton = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading blog"
      className="bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(6,95,70,0.15)] animate-pulse"
    >
      <div className="h-48 bg-gray-200" />

      <div className="p-5 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        <div className="flex justify-between mt-6">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export default memo(BlogCardSkeleton);
