// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import UsersPage from './pages/admin/UsersPage';
import UserFormPage from './pages/admin/UserFormPage';

//Paginas de autenticacion 
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';


import SimulacrosPage from './pages/admin/SimulacrosPage';

// importacion de el inicio de admin
import DashboardPage from './pages/admin/DashboardPage';
// importacion de el perfil de admin
import PerfilPage from './pages/admin/PerfilPage';


import MaestroDashboardPage from './pages/teacher/MaestroDashboardPage';

import AdminLayout from './components/layout/AdminLayout';
// importacion de categorias de admin
import CategoriesPage from './pages/admin/categories/CategoriesPage';
import CategoryDetailPage from './pages/admin/categories/CategoryDetailPage';
import QuestionFormPage from '../src/components/questions/QuestionFormPage';  

const UnauthorizedPage = () => <div className="p-8"><h1>Acceso Denegado</h1><p>No tienes permiso para ver esta página.</p></div>;

const PlaceholderPage = ({ title }) => (
  <AdminLayout title={title}>
    <div className="bg-white p-6 rounded-lg shadow-md ">
      Contenido para la página "{title}" en construcción.
    </div>
  </AdminLayout>
);




function App() {
  return (
    <BrowserRouter>
      <Routes>
        // importacion de el login en general
         <Route path="/" element={<Navigate to="/login" />} />
         <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        

        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/add" element={<UserFormPage />} />
        <Route path="/users/edit/:id" element={<UserFormPage />} />

      
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/perfil" element={<AdminLayout title=""><PerfilPage/></AdminLayout>} />

        

        {/* Páginas aún en construcción */}
        <Route path="/simulacros" element={<SimulacrosPage />} />

        <Route path="/categories" element={<AdminLayout title=""><CategoriesPage/></AdminLayout>} />
       <Route path="/admin/categories/:categoryPath" element={<CategoryDetailPage />} />
        <Route path="/admin/questions/add" element={<QuestionFormPage />} />
        <Route path="/admin/questions/edit/:questionId" element={<QuestionFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
