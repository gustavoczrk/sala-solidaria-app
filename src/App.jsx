import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProfilePage from './pages/ProfilePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import EditProjectPage from './pages/EditProjectPage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';



function App() {
  return (
    <Router className="flex flex-col min-h-screen"> 
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-grow"> 
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/projetos" element={<ProjectsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/projeto/:projectId" element={<ProjectDetailPage />} />

          {/* Rotas Protegidas */}
          <Route path="/meus-projetos" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/criar-projeto" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
          <Route path="/projeto/edit/:projectId" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
          <Route path="/meu-perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main> 

      <Footer />
    </Router>
  );
}

export default App;