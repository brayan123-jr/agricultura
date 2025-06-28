import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Home from './pages/Home';
import ListaProductos from './pages/productos/ListaProductos';
import MisCompras from './pages/compras/MisCompras';
import Vender from './pages/vender/Vender';
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import Perfil from './pages/perfil/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <>
          <Navbar />
          <Routes>
            {/* Rutas autenticadas */}
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ListaProductos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route
              path="/mis-compras"
              element={
                <ProtectedRoute requiredRole="comprador">
                  <MisCompras />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vender"
              element={
                <ProtectedRoute requiredRole="vendedor">
                  <Vender />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;