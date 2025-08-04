// src/pages/admin/categories/CategoriesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesData } from '../../../data/categoriesData';

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.map(cat => (
          <div
            key={cat.name}
            className="p-6 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform border-l-4"
            style={{ backgroundColor: cat.theme.light, borderColor: cat.theme.main }}
            onClick={() => navigate(`/admin/categories/${cat.path}`)}
          >
            <h3 className="font-bold text-lg mb-2 break-words" style={{ color: cat.theme.main }}>
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoriesPage;