import { Collection, Db } from 'mongodb';
import { Event } from '../domain/Event';
import { EventRepository } from '../ports/EventRepository';

type EventDocument = Omit<Event, 'id'> & { _id: string };

export class MongoEventRepository implements EventRepository {
  private readonly events: Collection<EventDocument>;

  constructor(database: Db) {
    this.events = database.collection<EventDocument>('events');
  }

  async getAll(): Promise<Event[]> {
    const documents = await this.events.find().sort({ date: 1, _id: 1 }).toArray();
    return documents.map((document) => this.toDomain(document));
  }

  async getById(id: string): Promise<Event | null> {
    const document = await this.events.findOne({ _id: id });
    return document ? this.toDomain(document) : null;
  }

  async save(event: Event): Promise<Event> {
    await this.events.updateOne(
      { _id: event.id },
      {
        $set: {
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
        },
        $setOnInsert: {
          _id: event.id,
        },
      },
      { upsert: true }
    );
    return event;
  }

  private toDomain(document: EventDocument): Event {
    return {
      id: document._id,
      title: document.title,
      description: document.description,
      date: document.date,
      location: document.location,
    };
  }
}
