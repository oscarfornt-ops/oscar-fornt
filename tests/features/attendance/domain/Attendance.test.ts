import { Attendance } from '@features/attendance/domain/Attendance';
import { AttendanceMother } from '@tests/features/attendance/domain/AttendanceMother';

describe('Attendance', () => {
  describe('create', () => {
    it('creates an attendance', () => {
      const expected = AttendanceMother.attending({ id: 'user-1-event-1' });
      const attendance = Attendance.create(
        expected.userId,
        expected.eventId,
        expected.status
      );

      expect(attendance).toBeInstanceOf(Attendance);
      expect(attendance).toEqual(expected);
    });

    it('allows a custom id when rehydrating persisted attendance', () => {
      const expected = AttendanceMother.attending();
      const attendance = Attendance.create(
        expected.userId,
        expected.eventId,
        expected.status,
        expected.id
      );

      expect(attendance).toEqual(expected);
    });
  });
});