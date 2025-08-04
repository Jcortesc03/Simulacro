// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// LAYOUTS
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import TeacherLayout from './components/layout/TeacherLayout';

// AUTH
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// ADMIN PAGES
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import UserFormPage from './pages/admin/UserFormPage';
import SimulacrosPage from './pages/admin/SimulacrosPage';
import CategoriesPage from './pages/admin/categories/CategoriesPage';
import CategoryDetailPage from './pages/admin/categories/CategoryDetailPage';
import PerfilPage from './pages/admin/PerfilPage';
import QuestionFormPage from './pages/admin/QuestionFormPage'; 

// STUDENT PAGES
import InicioPage from './pages/student/InicioPage';
import PruebasPage from './pages/student/PruebasPage';
import CalificacionesPage from './pages/student/CalificacionesPage';
import StudentPerfilPage from './pages/student/PerfilPage';
import SimulationPage from './pages/student/SimulationPage';
import SimulationResultsPage from './pages/student/SimulationResultsPage';

// TEACHER PAGES
import TeacherSimulacrosPage from './pages/teacher/TeacherSimulacrosPage';
import TeacherCategoriesPage from './pages/teacher/TeacherCategoriesPage';
import TeacherPerfilPage from './pages/teacher/TeacherPerfilPage';
import TeacherCategoryDetailPage from './pages/teacher/categories/TeacherCategoryDetailPage';
import TeacherQuestionFormPage from './pages/teacher/TeacherQuestionFormPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas de Administrador (Anidadas bajo AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/add" element={<UserFormPage />} />
          <Route path="users/edit/:id" element={<UserFormPage />} />
          <Route path="simulacros" element={<SimulacrosPage />} />
          <Route path="categories" element={<CategoriesPage />} /> 
          <Route path="categories/:categoryPath" element={<CategoryDetailPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="questions/add" element={<QuestionFormPage />} />
          <Route path="questions/edit/:questionId" element={<QuestionFormPage />} />
        </Route>
        
        {/* Rutas de Estudiante (Anidadas bajo StudentLayout) */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<InicioPage />} />
          <Route path="pruebas" element={<PruebasPage />} />
          <Route path="calificaciones" element={<CalificacionesPage />} />
          <Route path="perfil" element={<StudentPerfilPage />} />
          <Route path="simulacro/:categoryPath" element={<SimulationPage />} />
          <Route path="resultados/:attemptId" element={<SimulationResultsPage />} />
        </Route>


         {/* --- ¡RUTAS DE PROFESOR! --- */}
         <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="simulacros" replace />} />
          <Route path="simulacros" element={<TeacherSimulacrosPage />} />
          <Route path="categories" element={<TeacherCategoriesPage />} />
          <Route path="categories/:categoryPath" element={<TeacherCategoryDetailPage />} />
          <Route path="questions/add" element={<TeacherQuestionFormPage />} />
          <Route path="questions/edit/:questionId" element={<TeacherQuestionFormPage />} />
          <Route path="perfil" element={<TeacherPerfilPage />} />
        </Route>

        {/* Ruta comodín para redirigir a login si no se encuentra la ruta */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;