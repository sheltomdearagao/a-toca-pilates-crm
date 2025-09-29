import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import ScheduleClassModal from '../components/modals/ScheduleClassModal';
import { StudentStatus } from '../types';

const Agenda: React.FC = () => {
  const { students, appointments, addAppointment } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const timeSlots: string[] = [];
  for(let i=7; i<=20; i++){
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
  }

  const horarios: { [key: string]: { start: number; end: number; afternoonStart?: number; afternoonEnd?: number } } = {
      'Segunda': { start: 7, end: 12, afternoonStart: 16, afternoonEnd: 20 },
      'Terça': { start: 7, end: 12, afternoonStart: 15, afternoonEnd: 20 },
      'Quarta': { start: 7, end: 12, afternoonStart: 16, afternoonEnd: 20 },
      'Quinta': { start: 7, end: 12, afternoonStart: 15, afternoonEnd: 20 },
      'Sexta': { start: 7, end: 12, afternoonStart: 16, afternoonEnd: 20 },
  }

  const isClassTime = (day: string, hour: number) => {
    const daySchedule = horarios[day as keyof typeof horarios];
    if(!daySchedule) return false;
    const isMorning = hour >= daySchedule.start && hour < daySchedule.end;
    const isAfternoon = daySchedule.afternoonStart && daySchedule.afternoonEnd && (hour >= daySchedule.afternoonStart && hour < daySchedule.afternoonEnd);
    return isMorning || isAfternoon;
  }

  const handleSlotClick = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    setIsModalOpen(true);
  };

  const handleScheduleClass = async (studentId: string) => {
    if (!selectedSlot || !studentId) return;

    const existing = appointments.find(a => a.day === selectedSlot.day && a.time === selectedSlot.time && a.studentId === studentId);
    if (existing) {
        alert('Este aluno já está agendado neste horário.');
        return;
    }
    
    await addAppointment({
        studentId,
        day: selectedSlot.day,
        time: selectedSlot.time
    });
    setIsModalOpen(false);
    setSelectedSlot(null);
  };
  
  return (
    <>
    <Card title="Agenda de Aulas Semanal">
        <div className="overflow-x-auto">
            <div className="grid" style={{ gridTemplateColumns: '60px repeat(5, 1fr)'}}>
                {/* Time column */}
                <div className="font-semibold text-center sticky left-0 bg-white z-10">
                    <div className="h-12 border-b"></div>
                    {timeSlots.map(time => (
                        <div key={time} className="h-20 flex items-center justify-center border-b border-r text-sm text-gray-600">
                            {time}
                        </div>
                    ))}
                </div>

                {/* Day columns */}
                {weekDays.map(day => (
                    <div key={day} className="text-center">
                        <div className="font-semibold py-3 border-b sticky top-0 bg-gray-50 z-10">{day}</div>
                        {timeSlots.map(time => {
                            const hour = parseInt(time.split(':')[0]);
                            const available = isClassTime(day, hour);
                            const scheduledAppointments = appointments.filter(a => a.day === day && a.time === time);

                            return(
                                <div 
                                    key={`${day}-${time}`} 
                                    className={`h-20 border-b border-r p-1 ${available ? 'bg-blue-50 hover:bg-brand-accent hover:bg-opacity-20 cursor-pointer' : 'bg-gray-100'}`}
                                    onClick={() => available && handleSlotClick(day, time)}
                                >
                                  <div className="flex flex-col items-center justify-center h-full">
                                    {scheduledAppointments.map(app => {
                                      const student = students.find(s => s.id === app.studentId);
                                      return (
                                        <div key={app.id} className="w-full text-xs p-1 bg-brand-primary text-white rounded my-0.5 truncate" title={student?.fullName}>
                                          {student?.fullName.split(' ')[0]}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    </Card>
    {selectedSlot && (
        <ScheduleClassModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSchedule={handleScheduleClass}
            day={selectedSlot.day}
            time={selectedSlot.time}
            students={students.filter(s => s.status === StudentStatus.Ativo)}
        />
    )}
    </>
  );
};

export default Agenda;