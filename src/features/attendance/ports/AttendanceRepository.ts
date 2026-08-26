import { Attendance } from '../domain/Attendance';

export interface AttendanceRepository {
  getByUserAndEvent(userId: string, eventId: string): Promise<Attendance | null>;
  getByEvent(eventId: string): Promise<Attendance[]>;
  save(attendance: Attendance): Promise<Attendance>; // Unique user_id, event_id
}