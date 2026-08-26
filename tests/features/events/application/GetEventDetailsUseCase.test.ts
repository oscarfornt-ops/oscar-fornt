import { GetEventDetailsUseCase } from '@features/events/application/GetEventDetailsUseCase';
import { EventRepository } from '@features/events/ports/EventRepository';
import { EventMother } from '@tests/features/events/domain/EventMother';

describe('GetEventDetailsUseCase', () => {
  let eventRepository: jest.Mocked<EventRepository>;
  let useCase: GetEventDetailsUseCase;

  beforeEach(() => {
    eventRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<EventRepository>;

    useCase = new GetEventDetailsUseCase(eventRepository);
  });

  describe('execute', () => {
    it('should return event details when event exists', async () => {
      // Arrange
      const event = EventMother.aMusicFestival();
      eventRepository.getById.mockResolvedValue(event);

      // Act
      const result = await useCase.execute(event.id);

      // Assert
      expect(result).toEqual(event);
      expect(eventRepository.getById).toHaveBeenCalledWith(event.id);
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
