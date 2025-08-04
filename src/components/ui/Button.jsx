// src/components/ui/Button.jsx

import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', disabled = false }) => {
  const baseStyles = 'px-6 py-2.5 rounded-lg font-semibold transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    ghost: 'bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-300'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;