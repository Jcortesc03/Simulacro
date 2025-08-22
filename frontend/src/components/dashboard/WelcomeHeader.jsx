// src/components/dashboard/WelcomeHeader.jsx

import React from 'react';

const WelcomeHeader = ({ name }) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        ¡Hola, <span className="text-blue-600">{name}</span>!
      </h1>
      <p className="mt-2 text-lg text-gray-500">
        Bienvenido a tu panel de preparación. ¡Comencemos a practicar!
      </p>
    </div>
  );
};

export default WelcomeHeader;