
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// LAYOUTS
import AdminLayout from '../components/layout/AdminLayout';
import StudentLayout from '../components/layout/StudentLayout';
import TeacherLayout from '../components/layout/TeacherLayout';

// AUTH
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// ADMIN PAGES
import DashboardPage from '../pages/admin/DashboardPage';
import UsersPage from '../pages/admin/UsersPage';
import UserFormPage from '../pages/admin/UserFormPage';
import SimulacrosPage from '../pages/admin/SimulacrosPage';
import CategoriesPage from '../pages/admin/categories/CategoriesPage';
import CategoryDetailPage from '../pages/admin/categories/CategoryDetailPage';
import PerfilPage from '../pages/admin/PerfilPage';
import QuestionFormPage from '../pages/admin/QuestionFormPage';

// STUDENT PAGES
import InicioPage from '../pages/student/InicioPage';
import PruebasPage from '../pages/student/PruebasPage';
import CalificacionesPage from '../pages/student/CalificacionesPage';
import StudentPerfilPage from '../pages/student/PerfilPage';
import SimulationPage from '../pages/student/SimulationPage';
import SimulationResultsPage from '../pages/student/SimulationResultsPage';

// TEACHER PAGES
import TeacherSimulacrosPage from '../pages/teacher/TeacherSimulacrosPage';
import TeacherCategoriesPage from '../pages/teacher/TeacherCategoriesPage';
import TeacherPerfilPage from '../pages/teacher/TeacherPerfilPage';
import TeacherCategoryDetailPage from '../pages/teacher/categories/TeacherCategoryDetailPage';
import TeacherQuestionFormPage from '../pages/teacher/TeacherQuestionFormPage';

import { SimulationProvider } from '../context/SimulationContext'; // ajusta según tu proyecto
import LecturaCriticaPage from '../pages/admin/LecturaCriticaPage'; // ajusta si está en otra carpeta


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<UserFormPage />} />
          <Route path="users/edit/:id" element={<UserFormPage />} />
          <Route path="questions" element={<QuestionFormPage />} />
          <Route path="simulacros" element={<SimulacrosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:categoryPath" element={<CategoryDetailPage />} />
          <Route path="categories/lectura-critica" element={<LecturaCriticaPage />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<InicioPage />} />
          <Route path="inicio" element={<InicioPage />} />
          <Route path="pruebas" element={<PruebasPage />} />
          <Route path="simulacion/:id" element={<SimulationProvider><SimulationPage /></SimulationProvider>} />
          <Route path="simulacion/:id/resultados" element={<SimulationResultsPage />} />
          <Route path="calificaciones" element={<CalificacionesPage />} />
          <Route path="perfil" element={<StudentPerfilPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherCategoriesPage />} />
          <Route path="categories" element={<TeacherCategoriesPage />} />
          <Route path="categories/:id" element={<TeacherCategoryDetailPage />} />
          <Route path="questions" element={<TeacherQuestionFormPage />} />
          <Route path="simulacros" element={<TeacherSimulacrosPage />} />
          <Route path="perfil" element={<TeacherPerfilPage />} />
        </Route>

        {/* Default/Catch-all Route */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
