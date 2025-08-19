import React from "react";

export default function Filters({ filter, setFilter }) {
  return (
    <div className="mt-6 flex gap-4">
      {["all", "completed", "remaining"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-lg capitalize ${
            filter === f ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
