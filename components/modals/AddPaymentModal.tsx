import React, { useState } from 'react';
import Modal from './Modal';
import { PaymentStatus, Payment } from '../../types';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (formData: Omit<Payment, 'id' | 'studentId'> & { status: PaymentStatus }) => void;
  studentId: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onAddPayment }) => {
  const initialFormState = {
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    paymentDate: '',
    isPaid: false,
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked }));
        if(!checked) {
            setFormData(prev => ({...prev, paymentDate: ''}))
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.dueDate) {
        alert("Valor e Data de Vencimento são obrigatórios.");
        return;
    }

    const status = formData.isPaid ? PaymentStatus.Pago : PaymentStatus.Pendente;
    const paymentDate = formData.isPaid ? (formData.paymentDate || new Date().toISOString().split('T')[0]) : undefined;

    onAddPayment({
        amount: parseFloat(formData.amount),
        dueDate: new Date(formData.dueDate).toISOString(),
        paymentDate: paymentDate ? new Date(paymentDate).toISOString() : undefined,
        status,
    });
    onClose();
    setFormData(initialFormState);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Novo Pagamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)*</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required placeholder="0.00" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
            </div>
             <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Data de Vencimento*</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
            </div>
        </div>
        
        <div className="flex items-center">
            <input
                id="isPaid"
                name="isPaid"
                type="checkbox"
                checked={formData.isPaid}
                onChange={handleChange}
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
            />
            <label htmlFor="isPaid" className="ml-2 block text-sm font-medium text-gray-900">
                Marcar como pago
            </label>
        </div>

        {formData.isPaid && (
             <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">Data do Pagamento</label>
                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"/>
                <p className="text-xs text-gray-500 mt-1">Deixe em branco para usar a data de hoje.</p>
            </div>
        )}

        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800">Registrar Pagamento</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPaymentModal;
