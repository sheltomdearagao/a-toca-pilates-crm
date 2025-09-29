import { Instructor } from "./types";

export const APP_NAME = "A Toca Pilates";

export const INSTRUCTORS: Instructor[] = [
  { id: 'i1', name: 'Juliana' },
  { id: 'i2', name: 'Rafael' },
  { id: 'i3', name: 'Beatriz' },
  { id: 'i4', name: 'Lucas' },
];

export const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

export const CLASS_TIMES: string[] = [];
for(let i=7; i<=20; i++){
    CLASS_TIMES.push(`${i.toString().padStart(2, '0')}:00`);
}

const horarios: { [key: string]: { start: number; end: number; afternoonStart?: number; afternoonEnd?: number } } = {
    'Segunda': { start: 7, end: 12, afternoonStart: 16, afternoonEnd: 20 },
    'Terça': { start: 7, end: 12, afternoonStart: 15, afternoonEnd: 20 },
    'Quarta': { start: 7, end: 12, afternoonStart: 16, afternoonEnd: 20 },
    'Quinta': { start: 7, end: 12, afternoonStart: 15, afternoonEnd: 20 },
    'Sexta': { start: 7, end: 12, afternoonStart: 16, afternoonEnd: 20 },
}

export const getAvailableTimes = (day: string) => {
    const daySchedule = horarios[day as keyof typeof horarios];
    if (!daySchedule) return [];
    
    const times: string[] = [];
    for(let hour=daySchedule.start; hour < daySchedule.end; hour++){
        times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    if (daySchedule.afternoonStart && daySchedule.afternoonEnd) {
         for(let hour=daySchedule.afternoonStart; hour < daySchedule.afternoonEnd; hour++){
            times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
    }
    return times.sort();
}