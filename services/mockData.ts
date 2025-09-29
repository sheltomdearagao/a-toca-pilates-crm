import { Student, StudentStatus, Payment, PaymentStatus, Expense, ExpenseCategory, User, UserRole, OtherRevenue, Appointment, Instructor, AttendanceRecord } from '../types';
import { INSTRUCTORS } from '../constants';

export const mockUsers: { [key in UserRole]: User } = {
  [UserRole.Admin]: { id: 'user-1', name: 'Admin', role: UserRole.Admin },
  [UserRole.Recepcao]: { id: 'user-2', name: 'Recepção', role: UserRole.Recepcao },
};

export const mockInstructors: Instructor[] = INSTRUCTORS;

export const mockStudents: Student[] = [
  { id: 's1', fullName: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', joinDate: '2023-01-15', status: StudentStatus.Ativo, plan: '2x por semana', nextDueDate: '2024-07-10', preferredInstructorId: 'i1', scheduledClasses: [{ day: 'Segunda', time: '08:00' }, { day: 'Quarta', time: '08:00' }] },
  { id: 's2', fullName: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', joinDate: '2023-03-22', status: StudentStatus.Ativo, plan: '3x por semana', nextDueDate: '2024-07-15', preferredInstructorId: 'i2', scheduledClasses: [{ day: 'Terça', time: '18:00' }, { day: 'Quinta', time: '18:00' }, { day: 'Sexta', time: '18:00' }] },
  { id: 's3', fullName: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 99999-8888', joinDate: '2023-05-10', status: StudentStatus.Inativo, plan: '2x por semana', nextDueDate: '2024-05-05' },
  { id: 's4', fullName: 'Daniel Rocha', email: 'daniel.rocha@example.com', phone: '(41) 98888-7777', joinDate: '2024-02-01', status: StudentStatus.Ativo, plan: '1x por semana', nextDueDate: '2024-07-20', scheduledClasses: [{ day: 'Quinta', time: '10:00' }] },
  { id: 's5', fullName: 'Eduarda Lima', email: 'eduarda.lima@example.com', phone: '(51) 97777-6666', joinDate: '2024-06-20', status: StudentStatus.Experimental, plan: 'Experimental', nextDueDate: '2024-07-25' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', studentId: 's1', amount: 300, dueDate: '2024-06-10', paymentDate: '2024-06-08', status: PaymentStatus.Pago },
  { id: 'p2', studentId: 's2', amount: 400, dueDate: '2024-06-15', paymentDate: '2024-06-15', status: PaymentStatus.Pago },
  { id: 'p3', studentId: 's3', amount: 300, dueDate: '2024-05-05', status: PaymentStatus.Atrasado },
  { id: 'p4', studentId: 's4', amount: 200, dueDate: '2024-06-20', paymentDate: '2024-06-20', status: PaymentStatus.Pago },
  { id: 'p5', studentId: 's1', amount: 300, dueDate: '2024-07-10', status: PaymentStatus.Pendente },
  { id: 'p6', studentId: 's2', amount: 400, dueDate: '2024-07-15', status: PaymentStatus.Pendente },
];

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

export const mockExpenses: Expense[] = [
  { id: 'e1', description: 'Aluguel do Espaço', amount: 2500, dueDate: new Date(currentYear, currentMonth, 5).toISOString(), category: ExpenseCategory.Aluguel, status: 'Pago', paymentDate: new Date(currentYear, currentMonth, 3).toISOString() },
  { id: 'e2', description: 'Salário Instrutor A', amount: 3000, dueDate: new Date(currentYear, currentMonth, 7).toISOString(), category: ExpenseCategory.Salarios, status: 'Pago', paymentDate: new Date(currentYear, currentMonth, 6).toISOString() },
  { id: 'e3', description: 'Conta de Luz', amount: 450, dueDate: new Date(currentYear, currentMonth, 20).toISOString(), category: ExpenseCategory.Contas, status: 'Pendente' },
  { id: 'e4', description: 'Marketing Digital', amount: 600, dueDate: new Date(currentYear, currentMonth, 15).toISOString(), category: ExpenseCategory.Marketing, status: 'Pendente' },
  { id: 'e5', description: 'Manutenção de Equipamentos', amount: 350, dueDate: new Date(currentYear, currentMonth-1, 25).toISOString(), category: ExpenseCategory.Equipamentos, status: 'Pago', paymentDate: new Date(currentYear, currentMonth-1, 24).toISOString() },
];

export const mockOtherRevenues: OtherRevenue[] = [
    { id: 'r1', description: 'Venda de produtos', amount: 250, date: new Date(currentYear, currentMonth, 18).toISOString() },
    { id: 'r2', description: 'Workshop de Fim de Semana', amount: 1200, date: new Date(currentYear, currentMonth - 1, 28).toISOString() },
];

export const mockAppointments: Appointment[] = [
    { id: 'a1', studentId: 's1', day: 'Segunda', time: '08:00'},
    { id: 'a2', studentId: 's2', day: 'Terça', time: '18:00'},
    { id: 'a3', studentId: 's4', day: 'Quinta', time: '10:00'},
    { id: 'a4', studentId: 's1', day: 'Quarta', time: '08:00'},
];

export const mockAttendanceRecords: AttendanceRecord[] = [
    { id: 'att1', studentId: 's1', date: new Date(currentYear, currentMonth, 3).toISOString(), status: 'Presente' },
    { id: 'att2', studentId: 's1', date: new Date(currentYear, currentMonth, 5).toISOString(), status: 'Presente' },
    { id: 'att3', studentId: 's1', date: new Date(currentYear, currentMonth, 10).toISOString(), status: 'Falta' },
    { id: 'att4', studentId: 's2', date: new Date(currentYear, currentMonth, 4).toISOString(), status: 'Presente' },
];