import React, { useState } from "react";

/** Draggable item */
function DraggableTodo({ id, text, completed, onDelete, onDragStart, onDragEnd, onToggleComplete }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", id);
    setIsDragging(true);
    onDragStart(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex items-center bg-white shadow-md rounded-lg p-3 mb-2 cursor-grab border border-gray-300 ${
        completed ? "line-through text-gray-500" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggleComplete(id)}
        className="h-5 w-5 mr-3 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
      />
      <span className="flex-1">
        {text}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete(id);
        }}
        className="ml-3 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
        aria-label="Delete todo"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}

/** Droppable column */
function DroppableList({ id, label, children, onDrop, onDragOver }) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={`p-4 rounded-xl min-h-[150px] bg-gray-100`}
    >
      <h2 className="font-bold mb-3 text-lg">{label}</h2>
      {children}
    </div>
  );
}

/** Main app */
export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: "1", text: "First task", completed: false },
    { id: "2", text: "Second task", completed: false },
  ]);
  const [text, setText] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);

  const addTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: text.trim(), completed: false },
    ]);
    setText("");
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const handleDragStart = (id) => {
    setDraggedItem(id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggedItem) return;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === draggedItem
          ? { ...todo, completed: targetStatus === "completed" }
          : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-yellow-400 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-black mb-2">Todo App</h1>
      <p className="mb-6 text-black/70">
        {todos.filter((t) => t.completed).length} completed • {todos.length} total
      </p>

      <form onSubmit={addTodo} className="flex gap-2 mb-6 w-full max-w-3xl">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition-colors"
        >
          Add
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <DroppableList 
          id="remaining" 
          label="Remaining"
          onDrop={(e) => handleDrop(e, "remaining")}
          onDragOver={handleDragOver}
        >
          {todos
            .filter((t) => !t.completed)
            .map((todo) => (
              <DraggableTodo
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                onDelete={deleteTodo}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onToggleComplete={toggleComplete}
              />
            ))}
        </DroppableList>

        <DroppableList 
          id="completed" 
          label="Completed"
          onDrop={(e) => handleDrop(e, "completed")}
          onDragOver={handleDragOver}
        >
          {todos
            .filter((t) => t.completed)
            .map((todo) => (
              <DraggableTodo
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                onDelete={deleteTodo}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onToggleComplete={toggleComplete}
              />
            ))}
        </DroppableList>
      </div>
    </div>
  );
}