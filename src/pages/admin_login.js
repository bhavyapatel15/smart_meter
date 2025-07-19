import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      });

      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin_dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black text-white">
      <div className="p-4 rounded shadow" style={{ backgroundColor: '#1f1f1f', width: '100%', maxWidth: '400px' }}>
        <h2 className="mb-4 text-center fw-bold">Admin Login</h2>

        {error && <div className="alert alert-danger py-2 text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control bg-dark border-secondary text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control bg-dark border-secondary text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2 fw-semibold">
            Login
          </button>
        </form>

        <div className="mt-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Only authorized administrators can access this portal.
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
