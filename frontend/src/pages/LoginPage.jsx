import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // 👈 Import Navbar

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/login', formData);
      console.log(res.data, "-----------------");
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/main');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <>
      <Navbar show="register" /> {/* 👈 Show Register button on navbar */}

      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-4 rounded-4">
            <h3 className="text-center mb-4">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control" 
                  placeholder="Enter your password" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
