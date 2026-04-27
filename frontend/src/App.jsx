import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Clientes from './pages/Clientes';
import ListagemChamados from './pages/ListagemChamados';
import NovoChamado from './pages/NovoChamado';
import DetalhesChamado from './pages/DetalhesChamado';
import TrashList from './pages/TrashList';
import ChamadoTrashList from './pages/ChamadoTrashList';
import Header from './pages/Header';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { signed, loading, isAdmin } = useAuth();

  // Centraliza a regra de proteção de rotas para evitar repetir checagens em cada página.
  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  if (!signed) return <Navigate to="/" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;

  return (
    <div className="app-shell flex min-h-screen transition-colors duration-300">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col md:pl-2">
        <Header />
        <main className="flex-1 overflow-y-auto px-3 pb-3 md:px-5 md:pb-5">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { darkMode } = useAuth();

  useEffect(() => {
    // O tema é refletido na raiz do documento para permitir estilos globais com Tailwind.
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.body.classList.add('transition-colors', 'duration-300');
  }, [darkMode]);

  return (
    <BrowserRouter>
      {/* O ToastContainer fica no topo da árvore para permitir notificações em qualquer tela. */}
      <ToastContainer autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/chamados" element={<PrivateRoute><ListagemChamados /></PrivateRoute>} />
        <Route path="/chamados/novo" element={<PrivateRoute><NovoChamado /></PrivateRoute>} />
        <Route path="/chamados/:id" element={<PrivateRoute><DetalhesChamado /></PrivateRoute>} />

        <Route path="/trash" element={<PrivateRoute adminOnly><TrashList /></PrivateRoute>} />
        <Route path="/trash/tickets" element={<PrivateRoute adminOnly><ChamadoTrashList /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
