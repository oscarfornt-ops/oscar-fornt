import { Collection, Db } from 'mongodb';
import { User } from '../domain/User';
import { UserRepository } from '../ports/UserRepository';

type UserDocument = User & { _id: string };

export class MongoUserRepository implements UserRepository {
  private readonly users: Collection<UserDocument>;

  constructor(database: Db) {
    this.users = database.collection<UserDocument>('users');
  }

  async getById(id: string): Promise<User | null> {
    const document = await this.users.findOne({ _id: id });
    return document ? { id: document._id, name: document.name } : null;
  }
}
