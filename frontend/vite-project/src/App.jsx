import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

export function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  if (!token) {
    return <Login setToken={setToken} setRole={setRole} />;
  }

  return (
    <div>
      {/* Logout button in top-right corner */}
      <button
        onClick={handleLogout}
        style={{
         position: 'fixed',
  top: 10,
  right: 10,
  padding: '5px 10px',
  fontSize: '12px',
  cursor: 'pointer',
  borderRadius: '5px',
  color: 'black',
  fontWeight: 'bold',               // bold text
  fontFamily: 'Helvetica, Arial, sans-serif', // font simplu și profesional
  border: '1px solid #ccc',
  backgroundColor: '#f5f5f5',
        }}
      >
        Logout
      </button>

      <Dashboard />
    </div>
  );
}

export default App;
