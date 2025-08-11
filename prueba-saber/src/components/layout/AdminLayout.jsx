import Sidebar from '../layout/Sidebar';
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-light-gray">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-2xl md:text-2xl font-bold text-gray-800">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;