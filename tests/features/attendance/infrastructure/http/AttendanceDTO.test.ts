import { AttendanceDTO } from "@features/attendance/infrastructure/http/AttendanceDTO";
import { AttendanceMother } from "@tests/features/attendance/domain/AttendanceMother";

describe("AttendanceDTO", () => {
  describe("fromDomain", () => {
    it("maps an attendance to its HTTP representation", () => {
      const attendance = AttendanceMother.attending();

      const dto = AttendanceDTO.fromDomain(attendance);

      expect(dto).toEqual({
        id: attendance.id,
        userId: attendance.userId,
        eventId: attendance.eventId,
        status: attendance.status,
      });
      expect(dto).not.toHaveProperty("_status");
    });
  });

  describe("toDomain", () => {
    it("reconstructs the attendance with all its properties", () => {
      const attendance = AttendanceMother.notAttending();
      const dto = AttendanceDTO.fromDomain(attendance);

      const result = dto.toDomain();

      expect(result).toEqual(attendance);
      expect(result).not.toBe(attendance);
    });
  });
});
