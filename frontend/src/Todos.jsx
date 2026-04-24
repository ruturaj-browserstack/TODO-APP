import React, { useEffect, useState } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/todos');
    setTodos(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });
      setTitle('');
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function toggle(todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    await load();
  }

  async function remove(todo) {
    await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <section>
      <h2>Todos</h2>
      <form onSubmit={add} className="row">
        <input
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="todo-input"
        />
        <button type="submit" data-testid="add-todo-btn" disabled={loading}>
          Add
        </button>
      </form>

      <ul className="todo-list" data-testid="todo-list">
        {todos.length === 0 && (
          <li data-testid="todo-empty">No todos yet</li>
        )}
        {todos.map((t) => (
          <li
            key={t.id}
            className={t.completed ? 'completed' : ''}
            data-testid={`todo-item-${t.id}`}
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggle(t)}
              data-testid={`todo-toggle-${t.id}`}
            />
            <span className="title" data-testid={`todo-title-${t.id}`}>
              {t.title}
            </span>
            <button
              className="danger"
              onClick={() => remove(t)}
              data-testid={`todo-delete-${t.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
        <span data-testid="todo-count">{todos.length} total</span>
        {' · '}
        <span data-testid="todo-completed-count">
          {todos.filter((t) => t.completed).length} completed
        </span>
      </div>
    </section>
  );
}
