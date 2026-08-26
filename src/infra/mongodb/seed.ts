import { MongoClient } from 'mongodb';

type EventSeedDocument = {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
};

type UserSeedDocument = {
  _id: string;
  name: string;
};

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
const databaseName = process.env.MONGODB_DATABASE ?? 'wuolah';

const events = [
  {
    _id: 'event-music-festival',
    title: 'Music Festival',
    description: 'Un festival de musica en directo con artistas emergentes.',
    date: new Date('2026-09-12T18:00:00.000Z'),
    location: 'Madrid Rio',
  },
  {
    _id: 'event-tech-conference',
    title: 'Tech Conference',
    description: 'Las ultimas tendencias en tecnologia y producto digital.',
    date: new Date('2026-10-03T09:00:00.000Z'),
    location: 'FYCMA Malaga',
  },
  {
    _id: 'event-city-fair',
    title: 'City Fair',
    description: 'Gastronomia, cultura y propuestas locales para toda la familia.',
    date: new Date('2026-10-24T11:00:00.000Z'),
    location: 'Valencia Nord',
  },
];

const users = [
  { _id: 'user-1', name: 'Ana Garcia' },
  { _id: 'user-2', name: 'Luis Martin' },
  { _id: 'user-3', name: 'Sofia Lopez' },
  { _id: 'user-4', name: 'Daniel Ruiz' },
];

const attendances = [
  { _id: 'user-1-event-music-festival', userId: 'user-1', eventId: 'event-music-festival', status: 'attending' },
  { _id: 'user-2-event-music-festival', userId: 'user-2', eventId: 'event-music-festival', status: 'attending' },
  { _id: 'user-3-event-tech-conference', userId: 'user-3', eventId: 'event-tech-conference', status: 'attending' },
  { _id: 'user-4-event-tech-conference', userId: 'user-4', eventId: 'event-tech-conference', status: 'not_attending' },
  { _id: 'user-1-event-city-fair', userId: 'user-1', eventId: 'event-city-fair', status: 'attending' },
];

async function seed(): Promise<void> {
  const client = new MongoClient(uri);
  await client.connect();

  try {
    const database = client.db(databaseName);
    await database.collection('attendances').createIndex(
      { userId: 1, eventId: 1 },
      { unique: true }
    );

    await Promise.all([
      ...events.map((event) => database.collection<EventSeedDocument>('events').updateOne(
        { _id: event._id },
        { $set: event },
        { upsert: true }
      )),
      ...users.map((user) => database.collection<UserSeedDocument>('users').updateOne(
        { _id: user._id },
        { $set: user },
        { upsert: true }
      )),
      ...attendances.map((attendance) => database.collection('attendances').updateOne(
        { userId: attendance.userId, eventId: attendance.eventId },
        { $set: attendance },
        { upsert: true }
      )),
    ]);

    console.log(`Seed completado: ${events.length} eventos, ${users.length} usuarios y ${attendances.length} asistencias.`);
  } finally {
    await client.close();
  }
}

seed().catch((error: unknown) => {
  console.error('No se pudo ejecutar el seed', error);
  process.exitCode = 1;
});
