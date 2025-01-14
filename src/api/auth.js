import axios from 'axios';

// Crée une instance Axios avec une configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
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
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors de la connexion';
  }
};

// Fonction pour récupérer l'utilisateur actuel
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/utilisateurs/me');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors de la récupération des données utilisateur';
  }
};

// Fonction pour déconnecter l'utilisateur
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Exporter l'instance axios par défaut
export default axiosInstance;
