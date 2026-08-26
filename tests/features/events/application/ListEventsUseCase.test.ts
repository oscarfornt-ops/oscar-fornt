import { ListEventsUseCase } from '@features/events/application/ListEventsUseCase';
import { EventRepository } from '@features/events/ports/EventRepository';
import { EventMother } from '@tests/features/events/domain/EventMother';

describe('ListEventsUseCase', () => {
  let eventRepository: jest.Mocked<EventRepository>;
  let useCase: ListEventsUseCase;

  beforeEach(() => {
    eventRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<EventRepository>;

    useCase = new ListEventsUseCase(eventRepository);
  });

  describe('execute', () => {
    it('should return all events', async () => {
      // Arrange
      const events = [
        EventMother.aMusicFestival(),
        EventMother.aConference(),
      ];

      eventRepository.getAll.mockResolvedValue(events);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(events);
      expect(eventRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no events exist', async () => {
      // Arrange
      eventRepository.getAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });
  });
});
