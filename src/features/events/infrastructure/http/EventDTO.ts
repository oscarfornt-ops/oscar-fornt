import { Event } from '@features/events/domain/Event';

export class EventDTO {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly date: string;
  public readonly location: string;

  constructor(event: Event) {
    this.id = event.id;
    this.title = event.title;
    this.description = event.description;
    this.date = event.date.toISOString();
    this.location = event.location;
    Object.freeze(this);
  }

  static fromDomain(event: Event): EventDTO {
    return new EventDTO(event);
  }

  toDomain(): Event {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: new Date(this.date),
      location: this.location,
    };
  }
}