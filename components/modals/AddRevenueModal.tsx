import React, { useState } from 'react';
import Modal from './Modal';

interface AddRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRevenue: (formData: { description: string; amount: number; date: string; }) => void;
}

const AddRevenueModal: React.FC<AddRevenueModalProps> = ({ isOpen, onClose, onAddRevenue }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRevenue({
        ...formData,
        amount: parseFloat(formData.amount)
    });
     // Reset form
    setFormData({
        description: '',
        amount: '',
        date: '',
    });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Outra Receita">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição*</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor*</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required placeholder="0.00" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
            </div>
             <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data*</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
            </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800">Adicionar Receita</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRevenueModal;