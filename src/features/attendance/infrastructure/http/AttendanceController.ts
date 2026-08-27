import { Request, Response } from 'express';
import { CancelAttendanceUseCase } from '@features/attendance/application/CancelAttendanceUseCase';
import { ConfirmAttendanceUseCase } from '@features/attendance/application/ConfirmAttendanceUseCase';
import { ListAttendeesUseCase } from '@features/attendance/application/ListAttendeesUseCase';
import { Attendance } from '@features/attendance/domain/Attendance';

type AttendanceRequest = Request<{ eventId: string }, unknown, { userId?: string }>;

export class AttendanceController {
  constructor(
    private readonly confirmAttendance: ConfirmAttendanceUseCase,
    private readonly cancelAttendance: CancelAttendanceUseCase,
    private readonly listAttendees: ListAttendeesUseCase
  ) {}

  readonly confirm = async (
    request: AttendanceRequest,
    response: Response
  ): Promise<void> => {
    const userId = this.getUserId(request);
    const attendance = await this.confirmAttendance.execute(
      userId,
      this.eventId(request)
    );
    response.json(this.toResponse(attendance));
  };

  readonly cancel = async (
    request: AttendanceRequest,
    response: Response
  ): Promise<void> => {
    const userId = this.getUserId(request);
    const attendance = await this.cancelAttendance.execute(
      userId,
      this.eventId(request)
    );
    response.json(this.toResponse(attendance));
  };

  readonly attendees = async (
    request: Request<{ eventId: string }>,
    response: Response
  ): Promise<void> => {
    response.json(await this.listAttendees.execute(this.eventId(request)));
  };

  private getUserId(request: AttendanceRequest): string {
    const userId = request.body?.userId?.trim();
    if (!userId) {
      throw new Error('userId is required');
    }
    return userId;
  }

  private eventId(request: Request): string {
    const eventId = request.params.eventId;
    return Array.isArray(eventId) ? eventId[0] : eventId;
  }

  private toResponse(attendance: Attendance) {
    return {
      id: attendance.id,
      userId: attendance.userId,
      eventId: attendance.eventId,
      status: attendance.status,
    };
  }
}