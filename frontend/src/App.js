import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import socketService from './services/socketService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loading dei componenti per ottimizzazione delle performance
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Chat = lazy(() => import('./components/Chat'));
const AdminPanel = lazy(() => import("./components/admin/AdminPanel"));

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--background-color);
  color: var(--primary-color);
  font-size: 1.5rem;
`;

// Componente wrapper per route protette
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen>Caricamento...</LoadingScreen>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App principale
const AppContent = () => {
  const { isAuthenticated, user, token } = useAuth();
  
  // Connetti socket quando l'utente è autenticato
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
      
      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);
  
  return (
    <Suspense fallback={<LoadingScreen>Caricamento...</LoadingScreen>}>
      <Routes>
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              {user && user.role === "admin" ? <Navigate to="/admin" /> : <Chat />}
              <Chat />
            </PrivateRoute>
          } 
        />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              {user && user.role === "admin" ? <AdminPanel /> : <Navigate to="/" />}
            </PrivateRoute>
          } 
        />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
};

export default App;