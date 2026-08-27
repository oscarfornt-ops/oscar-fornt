import { Attendance } from '@features/attendance/domain/Attendance';
import { AttendanceStatus } from '@features/attendance/domain/AttendanceStatus';

export class AttendanceDTO {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly eventId: string,
    public readonly status: AttendanceStatus
  ) {}

  static fromDomain(attendance: Attendance): AttendanceDTO {
    return new AttendanceDTO(
      attendance.id,
      attendance.userId,
      attendance.eventId,
      attendance.status
    );
  }

  toDomain(): Attendance {
    return Attendance.create(this.userId, this.eventId, this.status, this.id);
  }
}