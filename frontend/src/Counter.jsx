import React, { useEffect, useState } from 'react';

export default function Counter() {
  const [value, setValue] = useState(0);

  async function load() {
    const res = await fetch('/api/counter');
    const data = await res.json();
    setValue(data.value);
  }

  useEffect(() => {
    load();
  }, []);

  async function change(path) {
    const res = await fetch(`/api/counter/${path}`, { method: 'POST' });
    const data = await res.json();
    setValue(data.value);
  }

  return (
    <section>
      <h2>Counter</h2>
      <div className="counter">
        <button
          className="secondary"
          onClick={() => change('decrement')}
          data-testid="counter-decrement"
        >
          −
        </button>
        <div className="value" data-testid="counter-value">
          {value}
        </div>
        <button onClick={() => change('increment')} data-testid="counter-increment">
          +
        </button>
        <button
          className="danger"
          onClick={() => change('reset')}
          data-testid="counter-reset"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
