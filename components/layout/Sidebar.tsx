
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole } from '../../types';
import { HomeIcon, UsersIcon, DollarSignIcon, CalendarIcon } from '../icons/Icons';

const Sidebar: React.FC = () => {
  const { user } = useAppContext();
  const linkClass = "flex items-center px-4 py-3 text-gray-100 hover:bg-brand-secondary hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-brand-secondary text-white";

  return (
    <div className="hidden md:flex flex-col w-64 bg-brand-primary">
      <div className="flex items-center justify-center h-20 border-b border-brand-secondary">
        <h1 className="text-2xl font-bold text-white">A Toca Pilates</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} end>
            <HomeIcon className="w-6 h-6 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/alunos" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>
            <UsersIcon className="w-6 h-6 mr-3" />
            Alunos
          </NavLink>
          {user?.role === UserRole.Admin && (
            <NavLink to="/financeiro" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>
              <DollarSignIcon className="w-6 h-6 mr-3" />
              Financeiro
            </NavLink>
          )}
          <NavLink to="/agenda" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>
            <CalendarIcon className="w-6 h-6 mr-3" />
            Agenda
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
