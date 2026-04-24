import React, { useEffect, useState } from 'react';
import Login from './Login.jsx';
import Todos from './Todos.jsx';
import Counter from './Counter.jsx';

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');

  useEffect(() => {
    if (user) localStorage.setItem('user', user);
    else localStorage.removeItem('user');
  }, [user]);

  if (!user) {
    return (
      <div className="app" data-testid="app">
        <h1>Product App</h1>
        <Login onLogin={setUser} />
      </div>
    );
  }

  return (
    <div className="app" data-testid="app">
      <div className="user-bar">
        <span data-testid="welcome">Welcome, {user}</span>
        <button
          className="secondary"
          data-testid="logout-btn"
          onClick={() => setUser('')}
        >
          Logout
        </button>
      </div>
      <h1>Product App</h1>
      <Todos />
      <div className="section">
        <Counter />
      </div>
    </div>
  );
}
