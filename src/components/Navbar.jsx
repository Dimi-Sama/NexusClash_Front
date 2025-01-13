import React, { useEffect, useState } from "react";
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from "../api/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // Vérifie si un token existe

      try {
        if (!token) return;
        const userData = await getCurrentUser();
        setUser(userData);
        
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setUser(null); // Si erreur (ex. token expiré), mettre user à null
      }
    };

    fetchUser();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    logoutUser(); // Supprime le token du localStorage
    setUser(null); // Mettre à jour l'état local de l'utilisateur
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <header>
      <nav>
        <div className="nav-left">
          <img src="/logo.png" className="logo-img" alt="Logo" />
          {!user ? (
            // Si non connecté, afficher seulement le lien de connexion
            <div className="nav-links">
              <a href="/login">Login</a>
            </div>
          ) : (
            // Si connecté, afficher les liens et le bouton de déconnexion
            <div className="nav-links">
              <a href="#">My List</a>
              <a href="#">Anime</a>
              <a href="#">User</a>
              <span>{user.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
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
