// src/components/ui/StatsCard.jsx
import React from 'react';
import Card from './Card';

const StatsCard = ({ title, value, icon: Icon, colorClass = 'bg-blue-500' }) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClass}`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;