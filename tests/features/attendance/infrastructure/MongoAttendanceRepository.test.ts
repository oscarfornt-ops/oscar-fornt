import { Db } from 'mongodb';
import { Attendance } from '@features/attendance/domain/Attendance';
import { AttendanceStatus } from '@features/attendance/domain/AttendanceStatus';
import { MongoAttendanceRepository } from '@features/attendance/infrastructure/MongoAttendanceRepository';

describe('MongoAttendanceRepository', () => {
  const attendance = Attendance.create(
    'user-1',
    'event-1',
    AttendanceStatus.ATTENDING,
    'attendance-1'
  );

  it('gets attendance by user and event', async () => {
    const findOne = jest.fn().mockResolvedValue({
      _id: attendance.id,
      userId: attendance.userId,
      eventId: attendance.eventId,
      status: attendance.status,
    });
    const database = {
      collection: jest.fn().mockReturnValue({ findOne }),
    } as unknown as Db;

    const result = await new MongoAttendanceRepository(database).getByUserAndEvent(
      attendance.userId,
      attendance.eventId
    );

    expect(result).toEqual(attendance);
    expect(findOne).toHaveBeenCalledWith({ userId: 'user-1', eventId: 'event-1' });
  });

  it('lists attendance for an event', async () => {
    const toArray = jest.fn().mockResolvedValue([
      {
        _id: attendance.id,
        userId: attendance.userId,
        eventId: attendance.eventId,
        status: attendance.status,
      },
    ]);
    const sort = jest.fn().mockReturnValue({ toArray });
    const database = {
      collection: jest.fn().mockReturnValue({ find: jest.fn().mockReturnValue({ sort }) }),
    } as unknown as Db;

    const result = await new MongoAttendanceRepository(database).getByEvent('event-1');

    expect(result).toEqual([attendance]);
    expect(sort).toHaveBeenCalledWith({ _id: 1 });
  });

  it('upserts attendance by user and event', async () => {
    const updateOne = jest.fn().mockResolvedValue({});
    const database = {
      collection: jest.fn().mockReturnValue({ updateOne }),
    } as unknown as Db;

    const result = await new MongoAttendanceRepository(database).save(attendance);

    expect(result).toBe(attendance);
    expect(updateOne).toHaveBeenCalledWith(
      { userId: 'user-1', eventId: 'event-1' },
      {
        $set: { status: AttendanceStatus.ATTENDING },
        $setOnInsert: {
          _id: 'attendance-1',
          userId: 'user-1',
          eventId: 'event-1',
        },
      },
      { upsert: true }
    );
  });
});
