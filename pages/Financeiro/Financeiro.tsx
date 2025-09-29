import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole, Expense, OtherRevenue, PaymentStatus, ExpenseCategory } from '../../types';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AddExpenseModal from '../../components/modals/AddExpenseModal';
import AddRevenueModal from '../../components/modals/AddRevenueModal';


const Financeiro: React.FC = () => {
  const { user, expenses, otherRevenues, payments, addExpense, addOtherRevenue } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('visaoGeral');
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isRevenueModalOpen, setRevenueModalOpen] = useState(false);

  if (user?.role !== UserRole.Admin) {
    navigate('/');
    return null;
  }

  const handleAddExpense = async (formData: { description: string; amount: number; dueDate: string; category: ExpenseCategory }) => {
    await addExpense({ ...formData, status: 'Pendente' });
    setExpenseModalOpen(false);
  };
  
  const handleAddRevenue = async (formData: { description: string; amount: number; date: string; }) => {
      await addOtherRevenue(formData);
      setRevenueModalOpen(false);
  };
  
  const renderVisaoGeral = () => {
    const totalRevenue = payments.filter(p => p.status === PaymentStatus.Pago).reduce((acc, p) => acc + p.amount, 0) + otherRevenues.reduce((acc, r) => acc + r.amount, 0);
    const totalExpenses = expenses.filter(e => e.status === 'Pago').reduce((acc, e) => acc + e.amount, 0);
    const profit = totalRevenue - totalExpenses;

    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const month = d.getMonth();
        const year = d.getFullYear();
        
        const revenue = payments
          .filter(p => p.status === PaymentStatus.Pago && p.paymentDate && new Date(p.paymentDate).getMonth() === month && new Date(p.paymentDate).getFullYear() === year)
          .reduce((sum, p) => sum + p.amount, 0) + 
          otherRevenues
          .filter(r => new Date(r.date).getMonth() === month && new Date(r.date).getFullYear() === year)
          .reduce((sum, r) => sum + r.amount, 0);
          
        const expense = expenses
          .filter(e => e.status === 'Pago' && e.paymentDate && new Date(e.paymentDate).getMonth() === month && new Date(e.paymentDate).getFullYear() === year)
          .reduce((sum, e) => sum + e.amount, 0);

        return {
          name: new Date(year, month).toLocaleString('default', { month: 'short' }),
          Receita: revenue,
          Despesa: expense,
          Lucro: revenue - expense,
        };
      }).reverse();
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Receita Total (Pago)"><p className="text-3xl font-bold text-green-600">{totalRevenue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p></Card>
                <Card title="Despesa Total (Pago)"><p className="text-3xl font-bold text-red-600">{totalExpenses.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p></Card>
                <Card title="Lucro/Prejuízo (Realizado)"><p className={`text-3xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p></Card>
            </div>
            <Card title="DRE Simplificado (Últimos 6 Meses)">
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value)} />
                        <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/>
                        <Legend />
                        <Bar dataKey="Receita" fill="#10B981" />
                        <Bar dataKey="Despesa" fill="#EF4444" />
                        <Bar dataKey="Lucro" fill="#3B82F6" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    )
  };

  const renderContasPagar = () => (
    <Card>
        <div className="flex justify-end mb-4">
            <button onClick={() => setExpenseModalOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-800 transition-colors">
                + Adicionar Despesa
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">Descrição</th>
                        <th className="px-4 py-2">Valor</th>
                        <th className="px-4 py-2">Vencimento</th>
                        <th className="px-4 py-2">Categoria</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense: Expense) => (
                        <tr key={expense.id} className="border-b">
                            <td className="px-4 py-3">{expense.description}</td>
                            <td className="px-4 py-3">{expense.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                            <td className="px-4 py-3">{new Date(expense.dueDate).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3">{expense.category}</td>
                            <td className="px-4 py-3"><Badge status={expense.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
  );

  const renderContasReceber = () => (
    <Card>
        <div className="flex justify-end mb-4">
            <button onClick={() => setRevenueModalOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-800 transition-colors">
                + Adicionar Receita
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">Descrição</th>
                        <th className="px-4 py-2">Valor</th>
                        <th className="px-4 py-2">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {otherRevenues.map((revenue: OtherRevenue) => (
                        <tr key={revenue.id} className="border-b">
                            <td className="px-4 py-3">{revenue.description}</td>
                            <td className="px-4 py-3">{revenue.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                            <td className="px-4 py-3">{new Date(revenue.date).toLocaleDateString('pt-BR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
  );

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('visaoGeral')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'visaoGeral' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Visão Geral
              </button>
              <button onClick={() => setActiveTab('contasPagar')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contasPagar' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Contas a Pagar
              </button>
              <button onClick={() => setActiveTab('contasReceber')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contasReceber' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Outras Receitas
              </button>
          </nav>
      </div>

      <div>
          {activeTab === 'visaoGeral' && renderVisaoGeral()}
          {activeTab === 'contasPagar' && renderContasPagar()}
          {activeTab === 'contasReceber' && renderContasReceber()}
      </div>

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
      <AddRevenueModal
        isOpen={isRevenueModalOpen}
        onClose={() => setRevenueModalOpen(false)}
        onAddRevenue={handleAddRevenue}
      />
    </div>
  );
};

export default Financeiro;
