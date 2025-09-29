
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './hooks/useAppContext';
import Dashboard from './pages/Dashboard';
import AlunosList from './pages/Alunos/AlunosList';
import AlunoProfile from './pages/Alunos/AlunoProfile';
import Financeiro from './pages/Financeiro/Financeiro';
import Agenda from './pages/Agenda';
import Login from './pages/Login';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="alunos" element={<AlunosList />} />
            <Route path="alunos/:id" element={<AlunoProfile />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="agenda" element={<Agenda />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
