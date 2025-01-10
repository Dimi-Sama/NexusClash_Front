import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <nav>        
        <div className="nav-left">
          <img src="/logo.png" className="logo-img" alt="Logo" />
          <div className="nav-links">
            <a href="#">My List</a>
            <a href="#">Anime</a>
            <a href="#">User</a>
            <a href="/login">Login</a>
          </div>
        </div>
        <div className="nav-right">
          <Link to="/showdown">
            <img src="/showdown.png" className="showdown-text" alt="Showdown" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;