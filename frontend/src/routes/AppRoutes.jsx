import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "../context/ProtectedRoute";

// AUTH
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// LAYOUTS
import AdminLayout from '../components/layout/AdminLayout';
import StudentLayout from '../components/layout/StudentLayout';
import TeacherLayout from '../components/layout/TeacherLayout';

// PAGES
// ADMIN
import CategoriesPage from '../pages/admin/categories/CategoriesPage';
import CategoryDetailPage from '../pages/admin/categories/CategoryDetailPage';
import DashboardPage from '../pages/admin/DashboardPage';
// import LecturaCriticaPage from '../pages/admin/categories/LecturaCriticaPage'; // NO NECESARIO
import PerfilPage from '../pages/admin/PerfilPage';
import QuestionFormPage from '../pages/admin/QuestionFormPage';
import SimulacrosPage from '../pages/admin/SimulacrosPage';
import UserFormPage from '../pages/admin/UserFormPage';
import UsersPage from '../pages/admin/UsersPage';

// STUDENT
import CalificacionesPage from '../pages/student/CalificacionesPage';
import InicioPage from '../pages/student/InicioPage';
import PruebasPage from '../pages/student/PruebasPage';
import SimulationPageWrapper from '../pages/student/SimulationPageWrapper';
import SimulationResultsPage from '../pages/student/SimulationResultsPage';
import StudentPerfilPage from '../pages/student/PerfilPage';
import EssayTestPage from '../pages/student/EssayTestPage';
import GeneralSimulationPage from '../pages/student/GeneralSimulationPage';
// TEACHER
import TeacherCategoriesPage from '../pages/teacher/TeacherCategoriesPage';
import TeacherCategoryDetailPage from '../pages/teacher/categories/TeacherCategoryDetailPage';
import TeacherPerfilPage from '../pages/teacher/TeacherPerfilPage';
import TeacherQuestionFormPage from '../pages/teacher/TeacherQuestionFormPage';
import TeacherSimulacrosPage from '../pages/teacher/TeacherSimulacrosPage';

function AppRoutes() {
  return (
      <Routes>

        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<UserFormPage />} />
          <Route path="users/edit/:id" element={<UserFormPage />} />
          <Route path="questions" element={<QuestionFormPage />} />
          <Route path="simulacros" element={<SimulacrosPage />} />
          <Route path="questions/edit/:id" element={<QuestionFormPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          {/* UNA SOLA RUTA PARA TODAS LAS CATEGORÍAS */}
          <Route path="categories/:categoryPath" element={<CategoryDetailPage />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route index element={<InicioPage />} />
          <Route path="inicio" element={<InicioPage />} />
          <Route path="pruebas" element={<PruebasPage />} />
          <Route path="simulacro-general" element={<GeneralSimulationPage />} />
          <Route path="simulacro/:id" element={<SimulationPageWrapper />} />
          <Route path="simulacion/:id/resultados" element={<SimulationResultsPage />} />
          <Route path="calificaciones" element={<CalificacionesPage />} />
          <Route path="perfil" element={<StudentPerfilPage />} />
          <Route path="essay-test" element={<EssayTestPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherLayout /></ProtectedRoute>}>
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
  );
}

export default AppRoutes;
