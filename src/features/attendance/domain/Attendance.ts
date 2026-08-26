import { AttendanceStatus } from './AttendanceStatus';

export class Attendance {
  private constructor(
    public readonly id: string,
    public readonly userId: string, // Para estas ids que son como claves foraneas, usaria el value object que tengais vosotros como estandar
    public readonly eventId: string, 
    private _status: AttendanceStatus
  ) {}

  static create(
    userId: string,
    eventId: string,
    status: AttendanceStatus,
    id = `${userId}-${eventId}` // Por ejemplo
  ): Attendance {
    return new Attendance(id, userId, eventId, status);
  }

  get status(): AttendanceStatus {
    return this._status;
  }

  confirm(): void {
    this._status = AttendanceStatus.ATTENDING;
  }

  cancel(): void {
    this._status = AttendanceStatus.NOT_ATTENDING;
  }

  isAttending(): boolean {
    return this._status === AttendanceStatus.ATTENDING;
  }
}