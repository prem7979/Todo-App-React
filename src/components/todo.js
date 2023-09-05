// src/components/Todo.js
import React, { useState, useEffect } from 'react';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [updateTodo, setUpdateTodo] = useState(null);

  const url = 'https://jsonplaceholder.typicode.com/todos';
  useEffect(() => {
    // Fetch todos from the API when the component mounts
    fetch(url)
      .then((response) => response.json())
      .then((data) => setTodos(data.sort((a, b) => b.id - a.id)));
  }, []);

  const handleAddTodo = () => {
    // Create a new todo item (dummy POST request)
    const newTodoItem = {
      userId: 1,
      id: Math.floor(Math.random() * 1000),
      title: newTodo,
      completed: false,
    };

    fetch(url, {
      // Adding method type
      method: 'POST',

      // Adding body or contents to send
      body: JSON.stringify(newTodoItem),

      // Adding headers to the request
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new todo to the local state
        setTodos([...todos, data].sort((a, b) => b.id - a.id));
        setNewTodo('');
      });
  };

  const handleUpdateTodo = (todo) => {
    // Update the todo item (dummy PUT request)
    if (updateTodo) {
      fetch(url + '/' + updateTodo.id, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(updateTodo),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedTodos = todos.map((todo) =>
            todo.id === data.id ? { ...todo, title: data.title } : todo
          );
          setTodos(updatedTodos);
        });

      setUpdateTodo(null);
    } else {
      setUpdateTodo(todo);
    }
  };

  const handleDeleteTodo = (id) => {
    // Delete the todo item (dummy DELETE request)
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    fetch(url + '/' + id, { method: 'DELETE' });
    // You can make a DELETE request to the API here if needed
  };

  return (
    <div className='container'>
      <h1>Todo List</h1>
      <div className='input-container'>
        <input
          type='text'
          placeholder='Add a new todo...'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul className='todo-container'>
        {todos.map((todo) => (
          <li key={todo.id} className='todo-item'>
            {updateTodo?.id === todo.id ? (
              <input
                type='text'
                value={updateTodo.title}
                onChange={(e) =>
                  setUpdateTodo({ ...updateTodo, title: e.target.value })
                }
                className='edit-todo'
              />
            ) : (
              <span>{todo.title}</span>
            )}
            <div className='btn-container'>
              <button onClick={() => handleUpdateTodo(todo)}>
                {updateTodo?.id === todo.id ? 'Done' : 'Update'}
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
