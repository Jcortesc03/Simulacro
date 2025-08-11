const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '' }) => {
  const baseStyles = 'px-6 py-2.5 rounded-lg font-semibold text-blue-white transition-transform transform hover:scale-105 shadow-md';
  
  const variants = {
    primary: 'bg-secondary hover:bg-blue-600 hover:text-white transition-all duration-200',
    danger: 'bg-danger hover:bg-red-600 hover:text-white transition-all duration-200',
    cancel: 'bg-gray-500 hover:bg-gray-600 hover:text-white transition-all duration-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;