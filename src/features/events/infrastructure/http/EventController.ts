import { Request, Response } from 'express';
import { GetEventDetailsUseCase } from '@features/events/application/GetEventDetailsUseCase';
import { ListEventsUseCase } from '@features/events/application/ListEventsUseCase';

export class EventController {
  constructor(
    private readonly listEvents: ListEventsUseCase,
    private readonly getEventDetails: GetEventDetailsUseCase
  ) {}

  readonly list = async (_request: Request, response: Response): Promise<void> => {
    response.json(await this.listEvents.execute());
  };

  readonly details = async (request: Request, response: Response): Promise<void> => {
    response.json(await this.getEventDetails.execute(this.eventId(request)));
  };

  private eventId(request: Request): string {
    const eventId = request.params.eventId;
    return Array.isArray(eventId) ? eventId[0] : eventId;
  }
}