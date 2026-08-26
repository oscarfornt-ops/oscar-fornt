import { EventRepository } from '@features/events/ports/EventRepository';
import { Event } from '@features/events/domain/Event';

export class GetEventDetailsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(eventId: string): Promise<Event> {
    const event = await this.eventRepository.getById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }
}
