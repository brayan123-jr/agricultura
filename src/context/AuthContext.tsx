import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

type UserType = 'comprador' | 'vendedor';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, tipo: UserType) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Recuperar sesión del localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, tipo: UserType) => {
    try {
      // Simulación de login - Reemplazar con llamada real al backend
      const mockUser: User = {
        id: 1,
        nombre: 'Usuario de Prueba',
        email,
        tipo,
        telefono: '1234567890',
        direccion: 'Dirección de prueba'
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id'>) => {
    try {
      // Simulación de registro - Reemplazar con llamada real al backend
      const mockUser: User = {
        ...userData,
        id: Date.now(), // ID temporal
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 