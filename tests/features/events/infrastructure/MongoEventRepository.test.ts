import { Db } from 'mongodb';
import { MongoEventRepository } from '@features/events/infrastructure/MongoEventRepository';
import { Event } from '@features/events/domain/Event';

describe('MongoEventRepository', () => {
  const event: Event = {
    id: 'event-1',
    title: 'Conference',
    description: 'Tech conference',
    date: new Date('2026-09-01T10:00:00.000Z'),
    location: 'Madrid',
  };

  it('gets an event by id and maps its document', async () => {
    const findOne = jest.fn().mockResolvedValue({
      _id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    });
    const database = {
      collection: jest.fn().mockReturnValue({ findOne }),
    } as unknown as Db;

    const result = await new MongoEventRepository(database).getById(event.id);

    expect(result).toEqual(event);
    expect(findOne).toHaveBeenCalledWith({ _id: event.id });
  });

  it('lists events ordered by date and id', async () => {
    const toArray = jest.fn().mockResolvedValue([
      { _id: event.id, ...event },
    ]);
    const sort = jest.fn().mockReturnValue({ toArray });
    const database = {
      collection: jest.fn().mockReturnValue({ find: jest.fn().mockReturnValue({ sort }) }),
    } as unknown as Db;

    const result = await new MongoEventRepository(database).getAll();

    expect(result).toEqual([event]);
    expect(sort).toHaveBeenCalledWith({ date: 1, _id: 1 });
  });

  it('saves an event with an upsert', async () => {
    const updateOne = jest.fn().mockResolvedValue({});
    const database = {
      collection: jest.fn().mockReturnValue({ updateOne }),
    } as unknown as Db;

    await new MongoEventRepository(database).save(event);

    expect(updateOne).toHaveBeenCalledWith(
      { _id: event.id },
      {
        $set: {
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
        },
        $setOnInsert: { _id: event.id },
      },
      { upsert: true }
    );
  });
});
