import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Navbar from './Navbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      setMessage('Connexion réussie!');
      // Stocker le token si nécessaire
      // localStorage.setItem('token', response.data.token);
    } catch (error) {
      setMessage('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-page">
        <Navbar/>
      <div className="login-form-container">
        
        <h2>Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Se connecter</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
