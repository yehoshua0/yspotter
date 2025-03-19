import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Optional: for styling

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Django API when the component mounts
  useEffect(() => {
    axios.get('/api/items/') // Proxy handles the backend URL in development
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Welcome to My Full-Stack App</h1>
        <p>This is the updated root page!</p>
      </header>
      <main>
        {loading ? (
          <p>Loading items...</p>
        ) : items.length > 0 ? (
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <strong>{item.name}</strong>: {item.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found. Add some via the Django admin!</p>
        )}
      </main>
      <footer>
        <p>Powered by React + Django</p>
      </footer>
    </div>
  );
}

export default App;