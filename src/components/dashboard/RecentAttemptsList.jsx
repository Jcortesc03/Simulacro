// src/components/dashboard/RecentAttemptsList.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const RecentAttemptsList = ({ attempts }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Intentos Recientes</h2>
      <div className="space-y-4">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-700">{attempt.name}</p>
              <p className="text-sm text-gray-500">{attempt.date}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-blue-600">{attempt.score.toFixed(1)}%</p>
              <a href="#" className="text-sm text-blue-500 hover:underline">Ver detalles</a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentAttemptsList;