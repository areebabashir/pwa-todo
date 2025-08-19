import React from "react";

export default function TodoInput({ text, setText, addTodo }) {
  return (
    <form onSubmit={addTodo} className="w-full max-w-md flex mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a todo..."
        className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded-r-lg hover:bg-gray-800"
      >
        Add
      </button>
    </form>
  );
}
