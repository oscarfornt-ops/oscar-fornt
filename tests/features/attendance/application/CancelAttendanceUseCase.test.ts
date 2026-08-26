import { CancelAttendanceUseCase } from '@features/attendance/application/CancelAttendanceUseCase';
import { EventRepository } from '@features/events/ports/EventRepository';
import { AttendanceRepository } from '@features/attendance/ports/AttendanceRepository';
import { UserRepository } from '@features/users/ports/UserRepository';
import { EventMother } from '@tests/features/events/domain/EventMother';
import { UserMother } from '@tests/features/users/domain/UserMother';
import { AttendanceMother } from '@tests/features/attendance/domain/AttendanceMother';
import { AttendanceStatus } from '@features/attendance/domain/AttendanceStatus';

describe('CancelAttendanceUseCase', () => {
  let eventRepository: jest.Mocked<EventRepository>;
  let attendanceRepository: jest.Mocked<AttendanceRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let useCase: CancelAttendanceUseCase;

  beforeEach(() => {
    eventRepository = { getAll: jest.fn(), getById: jest.fn(), save: jest.fn() } as unknown as jest.Mocked<EventRepository>;
    attendanceRepository = { getByUserAndEvent: jest.fn(), save: jest.fn(), getByEvent: jest.fn() } as unknown as jest.Mocked<AttendanceRepository>;
    userRepository = { getById: jest.fn() } as unknown as jest.Mocked<UserRepository>;
    useCase = new CancelAttendanceUseCase(eventRepository, attendanceRepository, userRepository);
  });

  it('changes an existing record to not_attending', async () => {
    const user = UserMother.johnDoe();
    const event = EventMother.aMusicFestival();
    const existing = AttendanceMother.attending({ userId: user.id, eventId: event.id });
    userRepository.getById.mockResolvedValue(user);
    eventRepository.getById.mockResolvedValue(event);
    attendanceRepository.getByUserAndEvent.mockResolvedValue(existing);
    attendanceRepository.save.mockImplementation(async value => value);

    const result = await useCase.execute(user.id, event.id);

    expect(result).toMatchObject({ status: AttendanceStatus.NOT_ATTENDING });
  });

  it('creates a not_attending record when no record exists', async () => {
    const user = UserMother.johnDoe();
    const event = EventMother.aMusicFestival();
    const attendance = AttendanceMother.notAttending({ userId: user.id, eventId: event.id });
    userRepository.getById.mockResolvedValue(user);
    eventRepository.getById.mockResolvedValue(event);
    attendanceRepository.getByUserAndEvent.mockResolvedValue(null);
    attendanceRepository.save.mockResolvedValue(attendance);

    const result = await useCase.execute(user.id, event.id);

    expect(result).toEqual(attendance);
  });
});