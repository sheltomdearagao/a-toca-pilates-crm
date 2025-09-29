
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-brand-primary">A Toca Pilates</h1>
          <p className="mt-2 text-center text-gray-600">Selecione seu perfil para continuar</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleLogin(UserRole.Admin)}
            className="w-full px-4 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors duration-200"
          >
            Entrar como Administrador
          </button>
          <button
            onClick={() => handleLogin(UserRole.Recepcao)}
            className="w-full px-4 py-3 font-semibold text-white bg-brand-secondary rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors duration-200"
          >
            Entrar como Recepção
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
