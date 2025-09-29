// Fix: Replaced the entire file with proper type definitions and exports to resolve circular dependencies and type errors.
export enum UserRole {
  Admin = 'Admin',
  Recepcao = 'Recepcao',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export enum StudentStatus {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
  Experimental = 'Experimental',
}

export interface ScheduledClass {
  day: string;
  time: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joinDate: string; // ISO date string
  status: StudentStatus;
  plan: string;
  nextDueDate: string; // ISO date string
  preferredInstructorId?: string;
  scheduledClasses?: ScheduledClass[];
  observations?: string;
}

export enum PaymentStatus {
  Pago = 'Pago',
  Pendente = 'Pendente',
  Atrasado = 'Atrasado',
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string; // ISO date string
  paymentDate?: string; // ISO date string
  status: PaymentStatus;
}

export enum ExpenseCategory {
  Aluguel = 'Aluguel',
  Salarios = 'Salários',
  Contas = 'Contas',
  Marketing = 'Marketing',
  Equipamentos = 'Equipamentos',
  Outros = 'Outros',
}

export type ExpenseStatus = 'Pago' | 'Pendente';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  dueDate: string; // ISO date string
  category: ExpenseCategory;
  status: ExpenseStatus;
  paymentDate?: string; // ISO date string
}

export interface OtherRevenue {
    id: string;
    description: string;
    amount: number;
    date: string; // ISO date string
}

export interface Appointment {
  id: string;
  studentId: string;
  day: string;
  time: string;
}

export interface Instructor {
  id: string;
  name: string;
}

export type AttendanceStatus = 'Presente' | 'Falta';

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string; // ISO date string
    status: AttendanceStatus;
}

export interface AppContextType {
  user: User | null;
  students: Student[];
  payments: Payment[];
  expenses: Expense[];
  otherRevenues: OtherRevenue[];
  appointments: Appointment[];
  instructors: Instructor[];
  attendanceRecords: AttendanceRecord[];
  login: (role: UserRole) => void;
  logout: () => void;
  addStudent: (studentData: Omit<Student, 'id'>) => Promise<void>;
  addExpense: (expenseData: Omit<Expense, 'id'>) => Promise<void>;
  addOtherRevenue: (revenueData: Omit<OtherRevenue, 'id'>) => Promise<void>;
  addAppointment: (appointmentData: Omit<Appointment, 'id'>) => Promise<void>;
  addAttendance: (attendanceData: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  addPayment: (paymentData: Omit<Payment, 'id'>) => Promise<void>;
}
