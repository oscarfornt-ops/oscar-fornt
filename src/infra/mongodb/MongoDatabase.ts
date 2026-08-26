import { Db, MongoClient } from 'mongodb';

export type MongoDatabaseConfig = {
  uri?: string;
  databaseName?: string;
};

export class MongoDatabase {
  private readonly client: MongoClient;
  private readonly databaseName: string;
  private database?: Db;

  constructor(config: MongoDatabaseConfig = {}) {
    this.client = new MongoClient(
      config.uri ?? process.env.MONGODB_URI ?? 'mongodb://localhost:27017'
    );
    this.databaseName =
      config.databaseName ?? process.env.MONGODB_DATABASE ?? 'wuolah';
  }

  async connect(): Promise<Db> {
    await this.client.connect();
    this.database = this.client.db(this.databaseName);
    await Promise.all([
      this.database.collection('attendances').createIndex(
        { userId: 1, eventId: 1 },
        { unique: true }
      ),
      this.database.collection('attendances').createIndex({ eventId: 1 }),
    ]);
    return this.database;
  }

  getDb(): Db {
    if (!this.database) {
      throw new Error('MongoDatabase is not connected');
    }
    return this.database;
  }

  async close(): Promise<void> {
    await this.client.close();
    this.database = undefined;
  }
}
