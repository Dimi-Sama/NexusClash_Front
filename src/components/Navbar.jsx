import React from 'react';
import './Navbar.css';

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
          </div>
        </div>
        <div className="nav-right">
          <a href="/showdown">
            <img src="/showdown.png" className="showdown-text" alt="Showdown" />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;