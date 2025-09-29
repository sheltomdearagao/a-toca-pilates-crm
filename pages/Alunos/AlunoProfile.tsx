import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { UsersIcon, CalendarIcon, UserCircleIcon } from '../../components/icons/Icons';
import { AttendanceStatus, Payment, PaymentStatus } from '../../types';
import AddPaymentModal from '../../components/modals/AddPaymentModal';

const AlunoProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { students, payments, instructors, attendanceRecords, addAttendance, addPayment } = useAppContext();
  const [activeTab, setActiveTab] = useState('info');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);


  const student = students.find(s => s.id === id);
  const preferredInstructor = instructors.find(i => i.id === student?.preferredInstructorId);

  const studentPayments = useMemo(() => {
      return payments.filter(p => p.studentId === id).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [payments, id]);
  
  const studentAttendance = useMemo(() => {
    return attendanceRecords.filter(a => a.studentId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords, id]);

  const attendanceSummary = useMemo(() => {
    const classesPerWeek = parseInt(student?.plan?.charAt(0) || '0');
    const monthlyClasses = isNaN(classesPerWeek) ? 0 : classesPerWeek * 4; // Approximation
    
    const today = new Date();
    const currentMonthRecords = studentAttendance.filter(a => {
        const aDate = new Date(a.date);
        return aDate.getMonth() === today.getMonth() && aDate.getFullYear() === today.getFullYear();
    });

    const presences = currentMonthRecords.filter(a => a.status === 'Presente').length;
    const absences = currentMonthRecords.filter(a => a.status === 'Falta').length;
    const remaining = monthlyClasses - presences;

    return { monthlyClasses, presences, absences, remaining: remaining > 0 ? remaining : 0 };
  }, [student, studentAttendance]);


  if (!student) {
    return (
      <Card>
        <p className="text-center text-red-500">Aluno não encontrado.</p>
        <Link to="/alunos" className="block text-center mt-4 text-brand-primary hover:underline">Voltar para a lista de alunos</Link>
      </Card>
    );
  }

  const handleAddAttendance = (status: AttendanceStatus) => {
    if (!id || !attendanceDate) return;
    addAttendance({
        studentId: id,
        date: new Date(attendanceDate).toISOString(),
        status: status,
    })
  }

  const handleAddPayment = async (paymentData: Omit<Payment, 'id' | 'studentId'> & { status: PaymentStatus }) => {
    if (!id) return;
    await addPayment({ ...paymentData, studentId: id });
    setPaymentModalOpen(false);
  };
  
  const renderInfoTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card title="Informações do Plano">
                <ul className="space-y-2 text-gray-700">
                    <li><strong>Plano:</strong> {student.plan}</li>
                    <li><strong>Data de Início:</strong> {new Date(student.joinDate).toLocaleDateString('pt-BR')}</li>
                    <li><strong>Próximo Vencimento:</strong> {new Date(student.nextDueDate).toLocaleDateString('pt-BR')}</li>
                     {preferredInstructor && (
                         <li className="flex items-center">
                            <UserCircleIcon className="w-5 h-5 mr-2 text-brand-primary"/>
                            <strong>Instrutor:</strong><span className="ml-1">{preferredInstructor.name}</span>
                         </li>
                    )}
                </ul>
            </Card>
            <Card title="Horários Fixos">
                {student.scheduledClasses && student.scheduledClasses.length > 0 ? (
                    <ul className="space-y-2 text-gray-700">
                        {student.scheduledClasses.map((sc, index) => (
                            <li key={index} className="flex items-center">
                                <CalendarIcon className="w-5 h-5 mr-2 text-brand-primary"/>
                                {sc.day} às {sc.time}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Nenhum horário fixo definido.</p>
                )}
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Observações">
                <p className="text-gray-600 whitespace-pre-wrap">{student.observations || 'Nenhuma observação.'}</p>
            </Card>
        </div>
    </div>
  );

  const renderPagamentosTab = () => (
     <Card title="Histórico de Pagamentos">
        <div className="flex justify-end mb-4">
            <button
                onClick={() => setPaymentModalOpen(true)}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
                + Registrar Pagamento
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="px-4 py-2">Vencimento</th>
                        <th className="px-4 py-2">Valor</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Data Pagto.</th>
                    </tr>
                </thead>
                <tbody>
                    {studentPayments.map(payment => (
                        <tr key={payment.id} className="border-b">
                            <td className="px-4 py-3">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3">{payment.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                            <td className="px-4 py-3"><Badge status={payment.status} /></td>
                            <td className="px-4 py-3">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('pt-BR') : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                {studentPayments.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum pagamento registrado.</p>}
        </div>
    </Card>
  );

  const renderFrequenciaTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card title="Resumo Mensal">
                <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="font-medium">Aulas no Mês:</span><span className="font-bold text-lg">{attendanceSummary.monthlyClasses}</span></div>
                    <div className="flex justify-between items-center text-green-600"><span className="font-medium">Presenças:</span><span className="font-bold text-lg">{attendanceSummary.presences}</span></div>
                    <div className="flex justify-between items-center text-yellow-600"><span className="font-medium">Faltas:</span><span className="font-bold text-lg">{attendanceSummary.absences}</span></div>
                    <div className="flex justify-between items-center text-blue-600"><span className="font-medium">Aulas Restantes:</span><span className="font-bold text-lg">{attendanceSummary.remaining}</span></div>
                </div>
            </Card>
            <Card title="Registrar Frequência">
                <div className="space-y-3">
                    <label htmlFor="attendanceDate" className="block text-sm font-medium text-gray-700">Data da Aula</label>
                    <input type="date" id="attendanceDate" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"/>
                    <div className="flex space-x-2">
                         <button onClick={() => handleAddAttendance('Presente')} className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Marcar Presença</button>
                         <button onClick={() => handleAddAttendance('Falta')} className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Marcar Falta</button>
                    </div>
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Histórico de Frequência">
                 <div className="overflow-y-auto max-h-96">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-gray-50">
                            <tr className="border-b">
                                <th className="px-4 py-2">Data</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentAttendance.map(att => (
                                <tr key={att.id} className="border-b">
                                    <td className="px-4 py-3">{new Date(att.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-4 py-3"><Badge status={att.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {studentAttendance.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum registro de frequência.</p>}
                 </div>
            </Card>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full bg-brand-secondary text-white flex items-center justify-center">
                    <UsersIcon className="w-12 h-12" />
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-brand-dark">{student.fullName}</h1>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <p>{student.email}</p>
                    <span>&bull;</span>
                    <p>{student.phone}</p>
                </div>
                <div className="mt-2">
                    <Badge status={student.status} />
                </div>
            </div>
        </div>
      </Card>
        
      <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('info')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'info' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Informações
              </button>
              <button onClick={() => setActiveTab('pagamentos')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pagamentos' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Pagamentos
              </button>
               <button onClick={() => setActiveTab('frequencia')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'frequencia' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Frequência
              </button>
          </nav>
      </div>

      <div>
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'pagamentos' && renderPagamentosTab()}
        {activeTab === 'frequencia' && renderFrequenciaTab()}
      </div>

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onAddPayment={handleAddPayment}
        studentId={student.id}
      />
    </div>
  );
};

export default AlunoProfile;
