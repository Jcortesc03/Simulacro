// src/pages/auth/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './AuthLayout';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verificando tu correo...');

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`);
        setMessage('Correo verificado con éxito. Redirigiendo...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setMessage('Error al verificar el correo: ' + (err.response?.data?.error || 'Token inválido'));
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <AuthLayout title="Verificación de Correo">
      <div className="text-center">
        <p>{message}</p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;