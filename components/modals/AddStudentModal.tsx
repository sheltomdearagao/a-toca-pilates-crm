import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { StudentStatus, ScheduledClass } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { DAYS_OF_WEEK, getAvailableTimes } from '../../constants';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (formData: any) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddStudent }) => {
  const { instructors } = useAppContext();
  
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    plan: '1x por semana',
    nextDueDate: '',
    status: StudentStatus.Ativo,
    preferredInstructorId: '',
    observations: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);

  const classesPerWeek = useMemo(() => {
    const num = parseInt(formData.plan.charAt(0));
    return isNaN(num) ? 0 : num;
  }, [formData.plan]);

  const handleScheduleChange = (index: number, field: 'day' | 'time', value: string) => {
    const newScheduledClasses = [...scheduledClasses];
    if (!newScheduledClasses[index]) {
        newScheduledClasses[index] = { day: DAYS_OF_WEEK[0], time: '' };
    }
    newScheduledClasses[index] = { ...newScheduledClasses[index], [field]: value };

    // If day is changed, reset time
    if(field === 'day') {
      newScheduledClasses[index].time = '';
    }
    
    setScheduledClasses(newScheduledClasses);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'plan') {
      const newClassesPerWeek = parseInt(value.charAt(0)) || 0;
      setScheduledClasses(Array(newClassesPerWeek).fill({ day: DAYS_OF_WEEK[0], time: ''}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
        ...formData,
        scheduledClasses,
    });
    onClose();
    setFormData(initialFormState);
    setScheduledClasses([]);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Aluno">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo*</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone*</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Data de Início*</label>
                <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
            </div>
             <div>
                <label htmlFor="nextDueDate" className="block text-sm font-medium text-gray-700">Próximo Vencimento*</label>
                <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plano</label>
                <select name="plan" value={formData.plan} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-gray-900">
                    <option value="1x por semana">1x por semana</option>
                    <option value="2x por semana">2x por semana</option>
                    <option value="3x por semana">3x por semana</option>
                    <option value="4x por semana">4x por semana</option>
                    <option value="5x por semana">5x por semana</option>
                    <option value="Experimental">Experimental</option>
                </select>
            </div>
            <div>
                <label htmlFor="preferredInstructorId" className="block text-sm font-medium text-gray-700">Instrutor (Preferência)</label>
                <select name="preferredInstructorId" value={formData.preferredInstructorId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-gray-900">
                    <option value="">Sem preferência</option>
                    {instructors.map(instructor => (
                        <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                    ))}
                </select>
            </div>
        </div>
        
        {classesPerWeek > 0 && (
            <div className="space-y-3 pt-2">
                <h4 className="text-md font-medium text-gray-800">Definir Horários Fixos</h4>
                {Array.from({ length: classesPerWeek }).map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 p-2 border rounded-md">
                         <select 
                            value={scheduledClasses[index]?.day || ''} 
                            onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
                         >
                            <option value="" disabled>Selecione o dia</option>
                            {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                         </select>
                         <select 
                            value={scheduledClasses[index]?.time || ''} 
                            onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
                            disabled={!scheduledClasses[index]?.day}
                         >
                            <option value="" disabled>Selecione a hora</option>
                            {getAvailableTimes(scheduledClasses[index]?.day).map(time => <option key={time} value={time}>{time}</option>)}
                         </select>
                    </div>
                ))}
            </div>
        )}

        <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea name="observations" value={formData.observations} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800">Adicionar Aluno</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStudentModal;