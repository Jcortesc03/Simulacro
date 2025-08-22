// src/components/dashboard/StatsCard.jsx

import React from 'react';
import Card from '../ui/Card'; // Reutilizamos nuestro componente Card

const StatsCard = ({ title, value }) => {
  return (
    <Card>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </Card>
  );
};

export default StatsCard;