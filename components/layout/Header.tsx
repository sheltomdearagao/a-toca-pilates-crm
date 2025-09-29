
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { UserIcon, LogoutIcon } from '../icons/Icons';

const Header: React.FC = () => {
  const { user, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/alunos')) return 'Alunos';
    if (path.startsWith('/financeiro')) return 'Financeiro';
    if (path.startsWith('/agenda')) return 'Agenda';
    return 'A Toca Pilates';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <h1 className="text-2xl font-semibold text-brand-dark">{getPageTitle()}</h1>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <UserIcon className="w-6 h-6 text-brand-primary" />
          <span className="hidden md:inline text-brand-dark font-medium">{user?.name}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 text-sm text-gray-700">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-gray-500">{user?.role}</p>
            </div>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-dark hover:bg-brand-light"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
