import { ListAttendeesUseCase } from '@features/attendance/application/ListAttendeesUseCase';
import { EventRepository } from '@features/events/ports/EventRepository';
import { AttendanceRepository } from '@features/attendance/ports/AttendanceRepository';
import { UserRepository } from '@features/users/ports/UserRepository';
import { EventMother } from '@tests/features/events/domain/EventMother';
import { UserMother } from '@tests/features/users/domain/UserMother';
import { AttendanceMother } from '@tests/features/attendance/domain/AttendanceMother';

describe('ListAttendeesUseCase', () => {
  let eventRepository: jest.Mocked<EventRepository>;
  let attendanceRepository: jest.Mocked<AttendanceRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let useCase: ListAttendeesUseCase;

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

    useCase = new ListAttendeesUseCase(
      eventRepository,
      attendanceRepository,
      userRepository
    );
  });

  describe('execute', () => {
    it('should return list of confirmed attendees for an event', async () => {
      // Arrange
      const event = EventMother.aMusicFestival();
      const johnDoe = UserMother.johnDoe();
      const janeSmith = UserMother.janeSmith();

      const attendances = [
        AttendanceMother.attending({ userId: johnDoe.id, eventId: event.id }),
        AttendanceMother.attending({ userId: janeSmith.id, eventId: event.id }),
      ];

      eventRepository.getById.mockResolvedValue(event);
      attendanceRepository.getByEvent.mockResolvedValue(attendances);
      userRepository.getById
        .mockResolvedValueOnce(johnDoe)
        .mockResolvedValueOnce(janeSmith);

      // Act
      const result = await useCase.execute(event.id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'John Doe' }),
          expect.objectContaining({ name: 'Jane Smith' }),
        ])
      );
    });

    it('should only return attendees with "attending" status', async () => {
      // Arrange
      const event = EventMother.aMusicFestival();
      const johnDoe = UserMother.johnDoe();

      const attendances = [
        AttendanceMother.attending({ userId: johnDoe.id, eventId: event.id }),
        AttendanceMother.notAttending({
          userId: UserMother.janeSmith().id,
          eventId: event.id,
        }),
      ];

      eventRepository.getById.mockResolvedValue(event);
      attendanceRepository.getByEvent.mockResolvedValue(attendances);
      userRepository.getById.mockResolvedValue(johnDoe);

      // Act
      const result = await useCase.execute(event.id);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({ name: 'John Doe' }));
    });

    it('should return empty array when no attendees confirmed', async () => {
      // Arrange
      const event = EventMother.aMusicFestival();

      eventRepository.getById.mockResolvedValue(event);
      attendanceRepository.getByEvent.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(event.id);

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw error when event does not exist', async () => {
      // Arrange
      const eventId = 'non-existent';

      eventRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(eventId)).rejects.toThrow('Event not found');
    });
  });
});
