import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TodoList from "./components/TodoList";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const saveEditTodo = (id, text) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const startEditTodo = (id) => {
    setEditingId(id);
    setEditingText(todos.find((todo) => todo.id === id).text);
  };
  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    setTodos([...todos, { id: Date.now().toString(), text, completed: false }]);
    setText("");
  };

  // Save todos to localStorage
  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Handle drag and drop (reorder and move between lists)
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // If dropped in the same list, reorder
    if (source.droppableId === destination.droppableId) {
      const listTodos = todos.filter(todo => (source.droppableId === "completed" ? todo.completed : !todo.completed));
      const otherTodos = todos.filter(todo => (source.droppableId === "completed" ? !todo.completed : todo.completed));
      const [moved] = listTodos.splice(source.index, 1);
      listTodos.splice(destination.index, 0, moved);
      const newTodos = source.droppableId === "completed"
        ? [...otherTodos, ...listTodos]
        : [...listTodos, ...otherTodos];
      setTodos(newTodos);
      return;
    }

    // If moved between lists, update completed status and move to correct position
    setTodos(todos.map(todo =>
      todo.id === draggableId
        ? { ...todo, completed: destination.droppableId === "completed" }
        : todo
    ));
  };

  const remainingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const [draggedTodo, setDraggedTodo] = useState(null);

  const handleDragStart = (todo) => setDraggedTodo(todo);
  const handleDropComplete = () => {
    if (draggedTodo && !draggedTodo.completed) {
      setTodos(
        todos.map((todo) =>
          todo.id === draggedTodo.id ? { ...todo, completed: true } : todo
        )
      );
    }
    setDraggedTodo(null);
  };
  const handleDropRemaining = () => {
    if (draggedTodo && draggedTodo.completed) {
      setTodos(
        todos.map((todo) =>
          todo.id === draggedTodo.id ? { ...todo, completed: false } : todo
        )
      );
    }
    setDraggedTodo(null);
  };
  const handleDropDelete = () => {
    if (draggedTodo) {
      setTodos(todos.filter((todo) => todo.id !== draggedTodo.id));
    }
    setDraggedTodo(null);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-yellow-400 flex flex-col items-center p-6">
      {/* App Name */}
      <h1 className="text-3xl font-bold text-black mb-6">My PWA Todo App</h1>

      {/* Input */}
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          className="px-4 py-2 rounded-lg border border-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
        >
          Add
        </button>
      </form>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Remaining */}
          <Droppable droppableId="remaining">
            {(provided, snapshot) => (
              <div
                className={`bg-white rounded-xl p-4 shadow min-h-[300px] transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-4 ring-blue-300' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-bold text-lg mb-3 text-black">
                  Remaining ({todos.filter((t) => !t.completed).length})
                </h2>
                {todos
                  .filter((t) => !t.completed)
                  .map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-yellow-100 text-black p-2 mb-2 rounded-lg shadow cursor-pointer hover:bg-yellow-200"
                        >
                          {todo.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Completed */}
          <Droppable droppableId="completed">
            {(provided, snapshot) => (
              <div
                className={`bg-white rounded-xl p-4 shadow min-h-[300px] transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-4 ring-blue-300' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-bold text-lg mb-3 text-black">
                  Completed ({todos.filter((t) => t.completed).length})
                </h2>
                {todos
                  .filter((t) => t.completed)
                  .map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-green-200 text-black p-2 mb-2 rounded-lg shadow cursor-pointer hover:bg-green-300"
                        >
                          {todo.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* All Todos */}
          <Droppable droppableId="all">
            {(provided, snapshot) => (
              <div
                className={`bg-white rounded-xl p-4 shadow min-h-[300px] transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-4 ring-blue-300' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-bold text-lg mb-3 text-black">
                  All Todos ({todos.length})
                </h2>
                {todos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 mb-2 rounded-lg shadow cursor-pointer ${
                          todo.completed
                            ? "bg-green-200"
                            : "bg-yellow-100"
                        }`}
                      >
                        {todo.text}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl mt-6">
        <TodoList
          title="Remaining"
          todos={remainingTodos}
          onDrop={handleDropRemaining}
          onDragStart={handleDragStart}
          allowDrop={draggedTodo && draggedTodo.completed}
          toggleTodo={toggleTodo}
          startEditTodo={startEditTodo}
          saveEditTodo={saveEditTodo}
          deleteTodo={deleteTodo}
          editingId={editingId}
          editingText={editingText}
          setEditingText={setEditingText}
          showX={false}
        />
        <TodoList
          title="Completed"
          todos={completedTodos}
          onDrop={handleDropComplete}
          onDragStart={handleDragStart}
          allowDrop={draggedTodo && !draggedTodo.completed}
          toggleTodo={toggleTodo}
          startEditTodo={startEditTodo}
          saveEditTodo={saveEditTodo}
          deleteTodo={deleteTodo}
          editingId={editingId}
          editingText={editingText}
          setEditingText={setEditingText}
          showX={true}
        />
      </div>
      <div
        className={`mt-8 w-full max-w-3xl h-16 flex items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 ${draggedTodo ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-300'}`}
        onDragOver={e => { e.preventDefault(); }}
        onDrop={handleDropDelete}
      >
        🗑️ Drag here to delete
      </div>
    </div>
  );
}
