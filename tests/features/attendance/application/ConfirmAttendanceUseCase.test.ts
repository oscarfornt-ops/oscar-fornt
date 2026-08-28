import { ConfirmAttendanceUseCase } from "@features/attendance/application/ConfirmAttendanceUseCase";
import { EventRepository } from "@features/events/ports/EventRepository";
import { AttendanceRepository } from "@features/attendance/ports/AttendanceRepository";
import { UserRepository } from "@features/users/ports/UserRepository";
import { EventMother } from "@tests/features/events/domain/EventMother";
import { UserMother } from "@tests/features/users/domain/UserMother";
import { AttendanceMother } from "@tests/features/attendance/domain/AttendanceMother";
import { AttendanceStatus } from "@features/attendance/domain/AttendanceStatus";

describe("ConfirmAttendanceUseCase", () => {
  let eventRepository: jest.Mocked<EventRepository>;
  let attendanceRepository: jest.Mocked<AttendanceRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let useCase: ConfirmAttendanceUseCase;

  beforeEach(() => {
    eventRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<EventRepository>;
    attendanceRepository = {
      getByUserAndEvent: jest.fn(),
      save: jest.fn(),
      getByEvent: jest.fn(),
    } as unknown as jest.Mocked<AttendanceRepository>;
    userRepository = {
      getById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;
    useCase = new ConfirmAttendanceUseCase(
      eventRepository,
      attendanceRepository,
      userRepository,
    );
  });

  it("creates an attending record", async () => {
    const user = UserMother.johnDoe();
    const event = EventMother.aMusicFestival();
    const attendance = AttendanceMother.attending({
      userId: user.id,
      eventId: event.id,
    });
    userRepository.getById.mockResolvedValue(user);
    eventRepository.getById.mockResolvedValue(event);
    attendanceRepository.getByUserAndEvent.mockResolvedValue(null);
    attendanceRepository.save.mockResolvedValue(attendance);

    const result = await useCase.execute(user.id, event.id);

    expect(result).toMatchObject({ status: AttendanceStatus.ATTENDING });
  });

  it("changes an existing record to attending", async () => {
    const user = UserMother.johnDoe();
    const event = EventMother.aMusicFestival();
    const existing = AttendanceMother.notAttending({
      userId: user.id,
      eventId: event.id,
    });
    userRepository.getById.mockResolvedValue(user);
    eventRepository.getById.mockResolvedValue(event);
    attendanceRepository.getByUserAndEvent.mockResolvedValue(existing);
    attendanceRepository.save.mockImplementation(async (value) => value);


    const result = await useCase.execute(user.id, event.id);

    expect(result).toEqual(existing);
  });

  it("does not create a second attendance for the same user and event", async () => {
    const user = UserMother.johnDoe();
    const event = EventMother.aMusicFestival();
    const existing = AttendanceMother.attending({
      userId: user.id,
      eventId: event.id,
    });

    userRepository.getById.mockResolvedValue(user);
    eventRepository.getById.mockResolvedValue(event);
    attendanceRepository.getByUserAndEvent
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existing);
    attendanceRepository.save.mockImplementation(async (value) => value);

    const firstResult = await useCase.execute(user.id, event.id);
    const secondResult = await useCase.execute(user.id, event.id);

    expect(firstResult.userId).toBe(user.id);
    expect(firstResult.eventId).toBe(event.id);
    expect(secondResult).toBe(existing);
    expect(attendanceRepository.getByUserAndEvent).toHaveBeenCalledTimes(2);
    expect(attendanceRepository.getByUserAndEvent).toHaveBeenNthCalledWith(
      1,
      user.id,
      event.id,
    );
    expect(attendanceRepository.getByUserAndEvent).toHaveBeenNthCalledWith(
      2,
      user.id,
      event.id,
    );
  });
});
