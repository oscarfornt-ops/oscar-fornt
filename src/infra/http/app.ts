import express, { NextFunction, Request, Response } from 'express';
import { AttendanceRepository } from '@features/attendance/ports/AttendanceRepository';
import { EventRepository } from '@features/events/ports/EventRepository';
import { UserRepository } from '@features/users/ports/UserRepository';
import { CancelAttendanceUseCase } from '@features/attendance/application/CancelAttendanceUseCase';
import { ConfirmAttendanceUseCase } from '@features/attendance/application/ConfirmAttendanceUseCase';
import { ListAttendeesUseCase } from '@features/attendance/application/ListAttendeesUseCase';
import { GetEventDetailsUseCase } from '@features/events/application/GetEventDetailsUseCase';
import { ListEventsUseCase } from '@features/events/application/ListEventsUseCase';
import { AttendanceController } from '@features/attendance/infrastructure/http/AttendanceController';
import { EventController } from '@features/events/infrastructure/http/EventController';

export type AppDependencies = {
  eventRepository: EventRepository;
  attendanceRepository: AttendanceRepository;
  userRepository: UserRepository;
};

export function createApp(dependencies: AppDependencies) {
  const app = express();
  const eventController = new EventController(
    new ListEventsUseCase(dependencies.eventRepository),
    new GetEventDetailsUseCase(dependencies.eventRepository)
  );
  const attendanceController = new AttendanceController(
    new ConfirmAttendanceUseCase(
      dependencies.eventRepository,
      dependencies.attendanceRepository,
      dependencies.userRepository
    ),
    new CancelAttendanceUseCase(
      dependencies.eventRepository,
      dependencies.attendanceRepository,
      dependencies.userRepository
    ),
    new ListAttendeesUseCase(
      dependencies.eventRepository,
      dependencies.attendanceRepository,
      dependencies.userRepository
    )
  );

  app.use(express.json());
  app.get('/api/events', asyncHandler(eventController.list));
  app.get('/api/events/:eventId', asyncHandler(eventController.details));
  app.put('/api/events/:eventId/attendance', asyncHandler(attendanceController.confirm));
  app.delete('/api/events/:eventId/attendance', asyncHandler(attendanceController.cancel));
  app.get('/api/events/:eventId/attendees', asyncHandler(attendanceController.attendees));
  app.use(errorHandler);

  return app;
}

function asyncHandler(
  handler: (request: any, response: Response) => Promise<void>
) {
  return (request: Request, response: Response, next: NextFunction): void => {
    void handler(request, response).catch(next);
  };
}

function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): void {
  if (error.message === 'User not found' || error.message === 'Event not found') {
    response.status(404).json({ error: error.message });
    return;
  }

  if (error.message === 'userId is required') {
    response.status(400).json({ error: error.message });
    return;
  }

  response.status(500).json({ error: 'Internal server error' });
}
