import axios from 'axios';

// Crée une instance Axios avec une configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Assurez-vous que cette URL pointe vers votre backend Flask
  headers: { 'Content-Type': 'application/json' },
});

// Ajoute un intercepteur pour inclure automatiquement le token JWT dans les en-têtes
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonction pour connecter un utilisateur
export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post('/utilisateurs/login', {
      username,
      password,
    });

    // Stocker le token dans le localStorage
    localStorage.setItem('token', response.data.token);

    // Retourner les informations utilisateur
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors de la connexion';
  }
};

// Fonction pour récupérer l'utilisateur actuel à partir du backend
export const getCurrentUser = async () => {
  try {
    // Vérifier si le token est présent dans le localStorage
    const token = localStorage.getItem('token');
    console.log('Token:', token);   

    const response = await axiosInstance.get('/utilisateurs/me');
    return response.data; // Retourne l'utilisateur actuel
  } catch (error) {
    console.error(error);  // Affiche l'erreur pour mieux comprendre
    throw error.response?.data?.error || 'Erreur lors de la récupération des données utilisateur';
  }
};


// Fonction pour déconnecter l'utilisateur
export const logoutUser = () => {
  localStorage.removeItem('token'); // Supprime le token du localStorage
};
