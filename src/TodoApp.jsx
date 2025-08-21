import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './TodoApp.css';
import videoBg from './assets/bg-video.mp4'; // 👈 put your video in src/assets

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');

  // ✅ Load todos safely from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('todos');
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setTodos(parsed);
      } else {
        setTodos([]);
      }
    } catch (err) {
      console.warn('Invalid localStorage data. Resetting.');
      setTodos([]);
    }
  }, []);

  // ✅ Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // ✅ Request Notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // ✅ Check for due dates every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach(t => {
        if (
          !t.done &&
          t.dueDate &&
          new Date(t.dueDate) <= now &&
          Notification.permission === 'granted'
        ) {
          new Notification(`Reminder: ${t.text}`, {
            body: `Due: ${t.dueDate}`,
          });
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [todos]);

  const handleAdd = () => {
    if (!todo.trim()) return;

    const newTodo = {
      id: uuidv4(),
      text: todo,
      done: false,
      dueDate,
      priority,
    };

    setTodos([...todos, newTodo]);
    setTodo('');
    setDueDate('');
    setPriority('Medium');
  };

  const handleDelete = id => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleDone = id => {
    setTodos(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleEdit = (id, text) => {
    setIsEditing(id);
    setEditText(text);
  };

  const saveEdit = id => {
    setTodos(todos.map(t => (t.id === id ? { ...t, text: editText } : t)));
    setIsEditing(null);
    setEditText('');
  };

  const filtered = todos
    .filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t =>
      filterStatus === 'All'
        ? true
        : filterStatus === 'Done'
        ? t.done
        : !t.done
    )
    .filter(t =>
      filterPriority === 'All' ? true : t.priority === filterPriority
    )
    .sort((a, b) => a.done - b.done);

  return (
    <div className="app">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="overlay"></div>

      {/* Todo Container */}
      <div className="todo-container">
        <h2 className='container mx-auto flex justify-center'>Todo List</h2>

        {/* Input Form */}
        <div className="input-group">
          <input
            type="text"
            className='inp'
            value={todo}
            placeholder="Enter a todo"
            onChange={e => setTodo(e.target.value)}
          />
          <input
            className='inp'
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <select className='inp' value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="High">🔥 High</option>
            <option value="Medium">⚖️ Medium</option>
            <option value="Low">🌱 Low</option>
          </select>
          <button className='box inp' onClick={handleAdd}>Add Todo</button>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            className='inp'
            placeholder="Search todos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select className='inp' value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Done">Done</option>
            <option value="NotDone">Not Done</option>
          </select>
          <select
            className='inp'
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {filtered.map(t => (
            <li key={t.id} className={t.done ? 'done' : ''}>
              {isEditing === t.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(t.id)}>Save</button>
                </>
              ) : (
                <>
                  <div>
                    <strong>{t.text}</strong>
                    <div className="meta">
                      📅 {t.dueDate || 'No date'} | 🏷️ {t.priority}
                    </div>
                  </div>
                  <div className="actions">
                    <button className='inp' onClick={() => toggleDone(t.id)}>
                      {t.done ? 'Undo' : 'Done'}
                    </button>
                    <button className='inp' onClick={() => handleEdit(t.id, t.text)}>Edit</button>
                    <button className='inp' onClick={() => handleDelete(t.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;
