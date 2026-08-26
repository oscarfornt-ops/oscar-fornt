import { EventRepository } from '@features/events/ports/EventRepository';
import { Event } from '@features/events/domain/Event';

export class ListEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(): Promise<Event[]> {
    return this.eventRepository.getAll();
  }
}
