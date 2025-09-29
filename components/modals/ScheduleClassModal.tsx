import React, { useState } from 'react';
import Modal from './Modal';
import { Student } from '../../types';

interface ScheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (studentId: string) => void;
  day: string;
  time: string;
  students: Student[];
}

const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({ isOpen, onClose, onSchedule, day, time, students }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>(students[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      onSchedule(selectedStudent);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Agendar Aula - ${day} às ${time}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700">Selecione o Aluno</label>
            <select 
                id="student"
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-gray-900"
            >
                {students.map(student => (
                    <option key={student.id} value={student.id}>{student.fullName}</option>
                ))}
            </select>
        </div>
        {students.length === 0 && <p className="text-sm text-red-600">Nenhum aluno ativo para agendar.</p>}
        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
          <button type="submit" disabled={!selectedStudent} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 disabled:bg-gray-400">Agendar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleClassModal;