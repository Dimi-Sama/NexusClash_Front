import React, { useEffect, useState } from "react";
import './Navbar.css';
import { Link } from 'react-router-dom';
import { getCurrentUser } from "../api/auth";


function Navbar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    fetchUser();
  }, []);
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
            <span>{user?.username || "invité"}</span>
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