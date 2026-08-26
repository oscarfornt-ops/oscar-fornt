import { Event } from '@features/events/domain/Event';

export class EventMother {
  static aMusicFestival(): Event {
    return {
      id: '1',
      title: 'Music Festival 2026',
      description: 'Amazing music festival',
      date: new Date('2026-09-01'),
      location: 'Madrid',
    };
  }

  static aConference(): Event {
    return {
      id: '2',
      title: 'Tech Conference',
      description: 'Latest tech trends',
      date: new Date('2024-10-15'),
      location: 'Barcelona',
    };
  }

  static aFair(): Event {
    return {
      id: '3',
      title: 'Tech Fair 2024',
      description: 'Showcase of new technologies',
      date: new Date('2024-11-20'),
      location: 'Valencia',
    };
  }

  static random(overrides?: Partial<Event>): Event {
    const base = this.aMusicFestival();
    return {
      ...base,
      id: Math.random().toString(36).substr(2, 9),
      ...overrides,
    };
  }
}
