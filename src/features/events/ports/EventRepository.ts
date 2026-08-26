import { Event } from '../domain/Event';

export interface EventRepository {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  save(event: Event): Promise<Event>;
}