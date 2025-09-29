import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole, Student, Payment, Expense, OtherRevenue, Appointment, AppContextType, Instructor, AttendanceRecord } from '../types';
import { mockUsers, mockStudents, mockPayments, mockExpenses, mockOtherRevenues, mockAppointments, mockInstructors, mockAttendanceRecords } from '../services/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [otherRevenues, setOtherRevenues] = useState<OtherRevenue[]>(mockOtherRevenues);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...studentData, id: `s${students.length + 1}` };
    setStudents(prev => [...prev, newStudent]);
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expenseData, id: `e${expenses.length + 1}` };
    setExpenses(prev => [...prev, newExpense]);
  };

  const addOtherRevenue = async (revenueData: Omit<OtherRevenue, 'id'>) => {
    const newRevenue: OtherRevenue = { ...revenueData, id: `r${otherRevenues.length + 1}` };
    setOtherRevenues(prev => [...prev, newRevenue]);
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointmentData, id: `a${appointments.length + 1}` };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const addAttendance = async (attendanceData: Omit<AttendanceRecord, 'id'>) => {
    const newAttendance: AttendanceRecord = { ...attendanceData, id: `att${attendanceRecords.length + 1}` };
    setAttendanceRecords(prev => [...prev, newAttendance]);
  };

  const addPayment = async (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...paymentData, id: `p${payments.length + 1}` };
    setPayments(prev => [...prev, newPayment]);
  };

  const value = {
    user,
    students,
    payments,
    expenses,
    otherRevenues,
    appointments,
    instructors,
    attendanceRecords,
    login,
    logout,
    addStudent,
    addExpense,
    addOtherRevenue,
    addAppointment,
    addAttendance,
    addPayment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
