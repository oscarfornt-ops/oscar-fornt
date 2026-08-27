import { EventDTO } from '@features/events/infrastructure/http/EventDTO';
import { EventMother } from '@tests/features/events/domain/EventMother';

describe('EventDTO', () => {
  describe('fromDomain', () => {
    it('maps an event to an immutable HTTP representation', () => {
      const event = EventMother.aMusicFestival();

      const dto = EventDTO.fromDomain(event);

      expect(dto).toEqual({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date.toISOString(),
        location: event.location,
      });
      expect(Object.isFrozen(dto)).toBe(true);
    });
  });

  describe('toDomain', () => {
    it('reconstructs the event with an independent date', () => {
      const event = EventMother.aMusicFestival();
      const dto = EventDTO.fromDomain(event);

      const result = dto.toDomain();

      expect(result).toEqual(event);
      expect(result).not.toBe(event);
      expect(result.date).not.toBe(event.date);
    });
  });
});