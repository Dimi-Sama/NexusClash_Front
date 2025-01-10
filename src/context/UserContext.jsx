import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth'; // Assurez-vous que ce fichier existe et est correct

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser(); // Vous récupérez l'utilisateur à partir de l'API
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
