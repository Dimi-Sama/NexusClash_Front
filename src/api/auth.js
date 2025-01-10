import axios from 'axios';

// Fonction pour récupérer l'utilisateur connecté
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('http://localhost:5000/utilisateurs/me', {
      withCredentials: true, // Inclure les cookies dans les requêtes
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur:', error);
    return null; // Retourne null si non connecté
  }
};

// Fonction pour gérer la connexion
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/utilisateurs/login',
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Erreur lors de la connexion';
  }
};

// Fonction pour gérer la déconnexion
export const logoutUser = async () => {
  try {
    await axios.post('http://localhost:5000/utilisateurs/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
