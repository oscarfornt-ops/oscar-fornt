import { Collection, Db } from 'mongodb';
import { Attendance } from '../domain/Attendance';
import { AttendanceStatus } from '../domain/AttendanceStatus';
import { AttendanceRepository } from '../ports/AttendanceRepository';

type AttendanceDocument = {
  _id: string;
  userId: string;
  eventId: string;
  status: AttendanceStatus;
};

export class MongoAttendanceRepository implements AttendanceRepository {
  private readonly attendances: Collection<AttendanceDocument>;

  constructor(database: Db) {
    this.attendances = database.collection<AttendanceDocument>('attendances');
  }

  async getByUserAndEvent(userId: string, eventId: string): Promise<Attendance | null> {
    const document = await this.attendances.findOne({ userId, eventId });
    return document ? this.toDomain(document) : null;
  }

  async getByEvent(eventId: string): Promise<Attendance[]> {
    const documents = await this.attendances.find({ eventId }).sort({ _id: 1 }).toArray();
    return documents.map((document) => this.toDomain(document));
  }

  async save(attendance: Attendance): Promise<Attendance> {
    await this.attendances.updateOne(
      { userId: attendance.userId, eventId: attendance.eventId },
      {
        $set: { status: attendance.status },
        $setOnInsert: { _id: attendance.id, userId: attendance.userId, eventId: attendance.eventId },
      },
      { upsert: true }
    );
    return attendance;
  }

  private toDomain(document: AttendanceDocument): Attendance {
    return Attendance.create(document.userId, document.eventId, document.status, document._id);
  }
}
