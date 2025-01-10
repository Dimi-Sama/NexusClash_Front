import React, { useState, useEffect } from 'react'
import './Showdown.css'
import Navbar from './Navbar'

function Showdown() {
  const [bataille, setBataille] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [currentTour, setCurrentTour] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBataille();
  }, []);

  const fetchBataille = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/batailles', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data='
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de charger la bataille`);
      }

      const data = await response.json();
      setBataille(data);
      
      if (data && data.resultat) {
        try {
          const cleanResultat = data.resultat.replace(/\n/g, '\\n');
          const resultatParse = JSON.parse(cleanResultat);
          const toursArray = Object.values(resultatParse);
          setTours(toursArray);
        } catch (parseError) {
          console.error('Erreur de parsing:', parseError);
          setTours([data.resultat]);
        }
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setBataille(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="showdown-page">
      <Navbar />
      <main className="showdown-container">
        <button className="new-battle-btn" onClick={fetchBataille}>
          Nouvelle Bataille
        </button>
        
        {error ? (
          <div className="error-message">
            {error}
            <button onClick={fetchBataille}>Réessayer</button>
          </div>
        ) : (
          <>
            <div className="character-left">
              {bataille && (
                <>
                  <img src={bataille.personnage_1.image} alt={bataille.personnage_1.nom} />
                  <div className="character-name">{bataille.personnage_1.nom}</div>
                </>
              )}
            </div>
            
            <div className="vs-symbol">
              <span>VS</span>
            </div>
            
            <div className="character-right">
              {bataille && (
                <>
                  <img src={bataille.personnage_2.image} alt={bataille.personnage_2.nom} />
                  <div className="character-name">{bataille.personnage_2.nom}</div>
                </>
              )}
            </div>
            
            <div className="battle-text">
              {loading ? (
                <p>Chargement du combat...</p>
              ) : (
                <p>{tours[currentTour]}</p>
              )}
            </div>
          </>
        )}
      </main>

      <div className="chat-section">
        <div className="chat-messages">
          <div className="chat-message">
            <span className="username">User1:</span>
            <span className="message">Message text</span>
          </div>
        </div>
        <div className="chat-input-container">
          <input 
            type="text" 
            placeholder="Send a message..." 
            className="chat-input"
          />
          <button className="chat-send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Showdown 