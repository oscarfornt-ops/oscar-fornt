import { Attendance } from '@features/attendance/domain/Attendance';
import { AttendanceStatus } from '@features/attendance/domain/AttendanceStatus';

export class AttendanceMother {
  static attending(overrides?: Partial<Attendance>): Attendance {
    const base = Attendance.create(
      'user-1',
      'event-1',
      AttendanceStatus.ATTENDING,
      'attendance-1'
    );
    return this.withOverrides(base, overrides);
  }

  static notAttending(overrides?: Partial<Attendance>): Attendance {
    const base = Attendance.create(
      'user-1',
      'event-1',
      AttendanceStatus.NOT_ATTENDING,
      'attendance-1'
    );
    return this.withOverrides(base, overrides);
  }

  static withStatus(
    status: AttendanceStatus,
    overrides?: Partial<Attendance>
  ): Attendance {
    return this.withOverrides(
      Attendance.create('user-1', 'event-1', status, 'attendance-1'),
      overrides
    );
  }

  static random(overrides?: Partial<Attendance>): Attendance {
    const base = Attendance.create(
      'user-1',
      'event-1',
      AttendanceStatus.ATTENDING,
      `attendance-${Math.random().toString(36).substr(2, 9)}`
    );
    return this.withOverrides(base, overrides);
  }

  private static withOverrides(
    attendance: Attendance,
    overrides?: Partial<Attendance>
  ): Attendance {
    return Attendance.create(
      overrides?.userId ?? attendance.userId,
      overrides?.eventId ?? attendance.eventId,
      overrides?.status ?? attendance.status,
      overrides?.id ?? attendance.id
    );
  }
}
