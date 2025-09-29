import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Student } from '../../types';
import AddStudentModal from '../../components/modals/AddStudentModal';

const AlunosList: React.FC = () => {
  const { students, addStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddStudent = async (formData: Omit<Student, 'id'>) => {
    await addStudent(formData);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar aluno por nome ou email..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            + Adicionar Aluno
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Plano</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-brand-dark">{student.fullName}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{student.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{student.plan}</td>
                  <td className="px-4 py-3">
                    <Badge status={student.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/alunos/${student.id}`} className="text-brand-primary hover:underline font-medium">
                      Ver Perfil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && <p className="text-center text-gray-500 py-6">Nenhum aluno encontrado.</p>}
        </div>
      </Card>
      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </>
  );
};

export default AlunosList;
