import { createApp } from './infra/http/app';
import { MongoAttendanceRepository } from '@features/attendance/infrastructure/MongoAttendanceRepository';
import { MongoEventRepository } from '@features/events/infrastructure/MongoEventRepository';
import { MongoUserRepository } from '@features/users/infrastructure/MongoUserRepository';
import { MongoDatabase } from './infra/mongodb/MongoDatabase';

async function start(): Promise<void> {
  const mongo = new MongoDatabase();
  const database = await mongo.connect();
  const app = createApp({
    eventRepository: new MongoEventRepository(database),
    attendanceRepository: new MongoAttendanceRepository(database),
    userRepository: new MongoUserRepository(database),
  });

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

start().catch((error: unknown) => {
  console.error('Unable to start API', error);
  process.exitCode = 1;
});