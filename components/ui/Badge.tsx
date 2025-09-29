import React from 'react';
import { PaymentStatus, StudentStatus } from '../../types';

interface BadgeProps {
  status: string; // Could be PaymentStatus, StudentStatus, or ExpenseStatus
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case StudentStatus.Ativo:
    case PaymentStatus.Pago:
    case 'Pago':
    case 'Presente':
      return 'bg-green-100 text-green-800';
    case StudentStatus.Inativo:
      return 'bg-gray-100 text-gray-800';
    case StudentStatus.Experimental:
    case 'Falta':
      return 'bg-yellow-100 text-yellow-800';
    case PaymentStatus.Pendente:
    case 'Pendente':
      return 'bg-blue-100 text-blue-800';
    case PaymentStatus.Atrasado:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const colorClasses = getStatusColor(status);

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;