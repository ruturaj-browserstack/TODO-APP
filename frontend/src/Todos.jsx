import React, { useEffect, useState } from 'react';

const FILTERS = {
  all: () => true,
  active: (t) => !t.completed,
  completed: (t) => t.completed,
};

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
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

  async function clearCompleted() {
    await fetch('/api/todos/completed', { method: 'DELETE' });
    await load();
  }

  function beginEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText('');
  }

  async function saveEdit() {
    const next = editingText.trim();
    if (!editingId) return;
    if (!next) {
      cancelEdit();
      return;
    }
    await fetch(`/api/todos/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: next }),
    });
    cancelEdit();
    await load();
  }

  async function markAllComplete() {
    const pending = todos.filter((t) => !t.completed);
    await Promise.all(
      pending.map((t) =>
        fetch(`/api/todos/${t.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        })
      )
    );
    await load();
  }

  const visible = todos
    .filter(FILTERS[filter])
    .filter((t) => (query ? t.title.includes(query) : true));
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

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

      <div className="row" style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Search todos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="search-input"
        />
        <button
          type="button"
          className="secondary"
          data-testid="clear-completed-btn"
          onClick={clearCompleted}
          disabled={completedCount === 0}
        >
          Clear completed
        </button>
      </div>

      <div className="row" style={{ marginTop: 12, gap: 6 }} data-testid="filter-tabs">
        {Object.keys(FILTERS).map((key) => (
          <button
            key={key}
            type="button"
            className={filter === key ? '' : 'secondary'}
            data-testid={`filter-${key}`}
            onClick={() => setFilter(key)}
          >
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
        <button
          type="button"
          className="secondary"
          data-testid="mark-all-complete-btn"
          disabled={activeCount === 0}
          onClick={markAllComplete}
          style={{ marginLeft: 'auto' }}
        >
          Mark all complete
        </button>
      </div>

      <ul className="todo-list" data-testid="todo-list">
        {visible.length === 0 && (
          <li data-testid="todo-empty">
            {todos.length === 0 ? 'No todos yet' : 'Nothing here'}
          </li>
        )}
        {visible.map((t) => (
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
            {editingId === t.id ? (
              <input
                type="text"
                className="title"
                autoFocus
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                data-testid={`todo-edit-${t.id}`}
              />
            ) : (
              <span
                className="title"
                data-testid={`todo-title-${t.id}`}
                onDoubleClick={() => beginEdit(t)}
              >
                {t.title}
              </span>
            )}
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
        <span data-testid="todo-active-count">{activeCount} active</span>
        {' · '}
        <span data-testid="todo-completed-count">{completedCount} completed</span>
      </div>
    </section>
  );
}
