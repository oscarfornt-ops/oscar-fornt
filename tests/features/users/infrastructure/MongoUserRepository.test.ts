import { Db } from 'mongodb';
import { MongoUserRepository } from '@features/users/infrastructure/MongoUserRepository';

describe('MongoUserRepository', () => {
  it('gets a user by id and maps its document', async () => {
    const findOne = jest.fn().mockResolvedValue({ _id: 'user-1', name: 'John Doe' });
    const database = {
      collection: jest.fn().mockReturnValue({ findOne }),
    } as unknown as Db;

    const result = await new MongoUserRepository(database).getById('user-1');

    expect(result).toEqual({ id: 'user-1', name: 'John Doe' });
    expect(findOne).toHaveBeenCalledWith({ _id: 'user-1' });
  });

  it('returns null when the user does not exist', async () => {
    const findOne = jest.fn().mockResolvedValue(null);
    const database = {
      collection: jest.fn().mockReturnValue({ findOne }),
    } as unknown as Db;

    const result = await new MongoUserRepository(database).getById('missing');

    expect(result).toBeNull();
  });
});
