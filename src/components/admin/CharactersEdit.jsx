import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './CharactersEdit.css';

function CharactersEdit() {
  const [formData, setFormData] = useState({
    nom: '',
    competences: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/personnages/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Erreur lors de la récupération du personnage');
        setLoading(false);
        console.error('Erreur:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/personnages/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Personnage mis à jour avec succès:', data);
        navigate('/admin/characters');
      })
      .catch(error => console.error('Erreur lors de la mise à jour du personnage:', error));
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-layout">
      <Navbar />
      <main className="admin-main">
        <div className="admin-content">
          <h1 className="page-title">Modifier le Personnage</h1>
          <form onSubmit={handleSubmit} className="character-form">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="competences">Compétences</label>
              <textarea
                id="competences"
                name="competences"
                value={formData.competences}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Mettre à jour le Personnage
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CharactersEdit;
