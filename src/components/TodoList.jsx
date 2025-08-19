import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import TodoItem from "./TodoItem";

export default function TodoList({ title, todos, onDrop, onDragStart, allowDrop, toggleTodo, startEditTodo, saveEditTodo, deleteTodo, editingId, editingText, setEditingText, showX }) {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <ul
        className={`min-h-[120px] bg-white rounded-lg shadow p-2 transition-all duration-200 ${allowDrop ? 'ring-2 ring-blue-400' : ''}`}
        onDragOver={e => { if (allowDrop) e.preventDefault(); }}
        onDrop={allowDrop ? (e) => { e.preventDefault(); onDrop(); } : undefined}
      >
        {todos.length === 0 && (
          <li className="text-gray-400 italic py-8 text-center">{title === 'Remaining' ? '🎉 Nothing left! Add a task.' : '✅ No completed tasks yet.'}</li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`group flex items-center gap-2 px-4 py-2 mb-2 rounded-lg shadow-sm bg-gray-50 transition-all duration-200 hover:shadow-md ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
            draggable
            onDragStart={() => onDragStart(todo)}
          >
            {editingId === todo.id ? (
              <>
                <input
                  className="flex-1 px-2 py-1 border rounded"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEditTodo(todo.id);
                    if (e.key === 'Escape') setEditingText(todo.text);
                  }}
                  autoFocus
                />
                <button
                  className="text-green-600 font-bold px-2"
                  onClick={() => saveEditTodo(todo.id)}
                  title="Save"
                >💾</button>
                <button
                  className="text-gray-400 px-2"
                  onClick={() => setEditingText(todo.text) || saveEditTodo(null)}
                  title="Cancel"
                >✖️</button>
              </>
            ) : (
              <>
                <span
                  className="flex-1 cursor-pointer select-none"
                  onClick={() => toggleTodo(todo.id)}
                  title="Toggle complete"
                >
                  {todo.text}
                </span>
                {showX && (
                  <button
                    className="text-red-400 hover:text-red-600 px-2"
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete"
                  >✖️</button>
                )}
                <button
                  className="opacity-0 group-hover:opacity-100 text-blue-500 px-2 transition"
                  onClick={() => startEditTodo(todo.id, todo.text)}
                  title="Edit"
                >✏️</button>
                {!showX && (
                  <button
                    className="opacity-0 group-hover:opacity-100 text-red-500 px-2 transition"
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete"
                  >🗑️</button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
