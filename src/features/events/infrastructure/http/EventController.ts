import { Request, Response } from 'express';
import { GetEventDetailsUseCase } from '@features/events/application/GetEventDetailsUseCase';
import { ListEventsUseCase } from '@features/events/application/ListEventsUseCase';
import { EventDTO } from './EventDTO';

export class EventController {
  constructor(
    private readonly listEvents: ListEventsUseCase,
    private readonly getEventDetails: GetEventDetailsUseCase
  ) {}

  readonly list = async (_request: Request, response: Response): Promise<void> => {
    const events = await this.listEvents.execute();
    response.json(events.map(EventDTO.fromDomain));
  };

  readonly details = async (request: Request, response: Response): Promise<void> => {
    const event = await this.getEventDetails.execute(this.eventId(request));
    response.json(EventDTO.fromDomain(event));
  };

  private eventId(request: Request): string {
    const eventId = request.params.eventId;
    return Array.isArray(eventId) ? eventId[0] : eventId;
  }
}