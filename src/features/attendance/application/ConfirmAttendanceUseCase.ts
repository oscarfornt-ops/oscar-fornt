import { EventRepository } from '@features/events/ports/EventRepository';
import { AttendanceRepository } from '@features/attendance/ports/AttendanceRepository';
import { UserRepository } from '@features/users/ports/UserRepository';
import { Attendance } from '@features/attendance/domain/Attendance';
import { AttendanceStatus } from '@features/attendance/domain/AttendanceStatus';

// Aunque tienen lógica muy similar, he decidido crear 2 casos de uso distintos (CancelAttendance y ConfirmAttendance).
// No tienen mucha lógica y parecen operaciones core que pueden evolucionar de forma distinta. 
export class ConfirmAttendanceUseCase {
  constructor(
    private eventRepository: EventRepository,
    private attendanceRepository: AttendanceRepository,
    private userRepository: UserRepository
  ) {}

  async execute(userId: string, eventId: string): Promise<Attendance> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const event = await this.eventRepository.getById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    let attendance = await this.attendanceRepository.getByUserAndEvent(
      userId,
      eventId
    );

    if (attendance) {
      attendance.confirm(); // Si le llega x3 PUT CONFIRMED, no se crea un nuevo registro, sino que se actualiza el existente
    } else {
      attendance = Attendance.create(
        userId,
        eventId,
        AttendanceStatus.ATTENDING
      );
    }

    return this.attendanceRepository.save(attendance);
  }
}
