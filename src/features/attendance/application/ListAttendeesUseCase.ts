import { EventRepository } from '@features/events/ports/EventRepository';
import { AttendanceRepository } from '@features/attendance/ports/AttendanceRepository';
import { UserRepository } from '@features/users/ports/UserRepository';
import { User } from '@features/users/domain/User';
import { AttendanceStatus } from '../domain/AttendanceStatus';

export class ListAttendeesUseCase {
  constructor(
    private eventRepository: EventRepository,
    private attendanceRepository: AttendanceRepository,
    private userRepository: UserRepository
  ) {}

  async execute(eventId: string): Promise<User[]> {
    const event = await this.eventRepository.getById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const attendances = await this.attendanceRepository.getByEvent(eventId);

    const confirmedAttendances = attendances.filter(
      (attendance) => attendance.isAttending()
    );

    const users: User[] = [];
    for (const attendance of confirmedAttendances) { // Así ahora funciona, pero dependiendo del número de asistentes, podría hacerse un batch.
      const user = await this.userRepository.getById(attendance.userId); 
      if (user) {
        users.push(user);
      }
    }

    return users;
  }
}
