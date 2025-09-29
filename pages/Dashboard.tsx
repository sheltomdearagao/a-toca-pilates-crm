
import React from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import { StudentStatus, PaymentStatus } from '../types';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UsersIcon, DollarSignIcon, ArrowTrendingUp, ArrowTrendingDown } from '../components/icons/Icons';

const Dashboard: React.FC = () => {
  const { students, payments, expenses, otherRevenues } = useAppContext();
  
  const activeStudents = students.filter(s => s.status === StudentStatus.Ativo).length;
  const pendingPayments = payments.filter(p => p.status === PaymentStatus.Pendente || p.status === PaymentStatus.Atrasado);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const getMonthName = (monthIndex: number) => {
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      return months[monthIndex];
  }

  // Last 6 months financial data
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.getMonth();
    const year = d.getFullYear();
    
    const revenue = payments
      .filter(p => p.status === PaymentStatus.Pago && new Date(p.paymentDate!).getMonth() === month && new Date(p.paymentDate!).getFullYear() === year)
      .reduce((sum, p) => sum + p.amount, 0) + 
      otherRevenues
      .filter(r => new Date(r.date).getMonth() === month && new Date(r.date).getFullYear() === year)
      .reduce((sum, r) => sum + r.amount, 0);
      
    const expense = expenses
      .filter(e => e.status === 'Pago' && new Date(e.paymentDate!).getMonth() === month && new Date(e.paymentDate!).getFullYear() === year)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      name: getMonthName(month),
      Receita: revenue,
      Despesa: expense
    };
  }).reverse();

  const totalRevenueThisMonth = chartData[chartData.length-1].Receita;
  const totalExpenseThisMonth = chartData[chartData.length-1].Despesa;


  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <div className="flex items-center">
                <div className="p-3 bg-brand-accent rounded-full text-white">
                    <UsersIcon className="w-6 h-6"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Alunos Ativos</p>
                    <p className="text-2xl font-semibold text-brand-dark">{activeStudents}</p>
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center">
                <div className="p-3 bg-brand-danger rounded-full text-white">
                    <DollarSignIcon className="w-6 h-6"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Inadimplência</p>
                    <p className="text-2xl font-semibold text-brand-dark">{totalPending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center">
                <div className="p-3 bg-brand-success rounded-full text-white">
                    <ArrowTrendingUp className="w-6 h-6"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Receita (Mês)</p>
                    <p className="text-2xl font-semibold text-brand-dark">{totalRevenueThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center">
                <div className="p-3 bg-brand-warning rounded-full text-white">
                    <ArrowTrendingDown className="w-6 h-6"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Despesa (Mês)</p>
                    <p className="text-2xl font-semibold text-brand-dark">{totalExpenseThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Fluxo de Caixa (Últimos 6 Meses)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                <Legend />
                <Bar dataKey="Receita" fill="#3B82F6" />
                <Bar dataKey="Despesa" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Lembretes de Pagamento">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-2">Aluno</th>
                            <th className="py-2">Vencimento</th>
                            <th className="py-2">Valor</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPayments.slice(0, 5).map(payment => {
                            const student = students.find(s => s.id === payment.studentId);
                            return (
                                <tr key={payment.id} className="border-b">
                                    <td className="py-3">
                                        <Link to={`/alunos/${student?.id}`} className="text-brand-primary hover:underline">{student?.fullName}</Link>
                                    </td>
                                    <td className="py-3">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-3">{payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="py-3">{payment.status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {pendingPayments.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum pagamento pendente.</p>}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
