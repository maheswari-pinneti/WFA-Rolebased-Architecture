import { describe, it, expect, beforeEach, vi } from 'vitest';
import { attendanceService, OFFICE_COORDS, getDistance, AttendanceRecord } from '../../services/attendance.service';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });

describe('Smart Attendance Service Unit & Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Geofencing distance calculations', () => {
    it('should correctly measure distance within bounds', () => {
      // Very close to MAHE Bangalore office coords (approx 5 meters away)
      const dist = getDistance(12.9716, 77.5946, 12.97165, 77.59465);
      expect(dist).toBeLessThan(100);
    });

    it('should correctly flag coordinates outside office boundary', () => {
      // Distance from Bangalore office to some random place (approx 11 km away)
      const dist = getDistance(12.9716, 77.5946, 12.9000, 77.5000);
      expect(dist).toBeGreaterThan(100);
    });
  });

  describe('Punch Check-In & Check-Out State Transitions', () => {
    const empInfo = {
      employeeId: 'emp-999',
      employeeName: 'John Doe',
      department: 'Engineering & Technology',
      shiftType: 'Regular' as const,
      workMode: 'Office' as const,
      latitude: OFFICE_COORDS.lat,
      longitude: OFFICE_COORDS.lng
    };

    it('should allow normal check-in and check-out transition', () => {
      const checkedIn = attendanceService.checkIn(empInfo);
      expect(checkedIn.status).toBe('Checked In');
      expect(checkedIn.checkOutTime).toBeNull();

      attendanceService.checkOut('emp-999');
      const records = attendanceService.getRecords();
      expect(records[0].status).toBe('Checked Out');
      expect(records[0].checkOutTime).not.toBeNull();
    });

    it('should reject duplicate check-in attempts', () => {
      attendanceService.checkIn(empInfo);
      expect(() => {
        attendanceService.checkIn(empInfo);
      }).toThrowError('Active session already exists. Must check out first.');
    });

    it('should reject check-out before check-in', () => {
      expect(() => {
        attendanceService.checkOut('emp-unregistered');
      }).toThrowError('Check-out-before-check-in rejection. No active session found.');
    });

    it('should support take break and resume cycle', () => {
      attendanceService.checkIn(empInfo);
      attendanceService.takeBreak('emp-999');
      
      let records = attendanceService.getRecords();
      expect(records[0].status).toBe('On Break');
      expect(records[0].breaks[0].end).toBeNull();

      attendanceService.resumeWork('emp-999');
      records = attendanceService.getRecords();
      expect(records[0].status).toBe('Working');
      expect(records[0].breaks[0].end).not.toBeNull();
    });
  });

  describe('Geofencing Access Enforcements', () => {
    it('should reject check-in if coordinates are missing for In-Office mode', () => {
      expect(() => {
        attendanceService.checkIn({
          employeeId: 'emp-geofence',
          employeeName: 'Jane Smith',
          department: 'HR Ops',
          shiftType: 'Regular',
          workMode: 'Office'
        });
      }).toThrowError('Location permissions are required for In-Office check-in.');
    });

    it('should reject check-in if employee is outside the allowed boundary', () => {
      expect(() => {
        attendanceService.checkIn({
          employeeId: 'emp-geofence',
          employeeName: 'Jane Smith',
          department: 'HR Ops',
          shiftType: 'Regular',
          workMode: 'Office',
          latitude: 12.9000,
          longitude: 77.5000
        });
      }).toThrowError(/Geofencing validation failed/);
    });

    it('should allow check-in without coordinates if workMode is Remote or Client Site', () => {
      const record = attendanceService.checkIn({
        employeeId: 'emp-remote',
        employeeName: 'Jane Smith',
        department: 'HR Ops',
        shiftType: 'Flexible',
        workMode: 'Remote'
      });
      expect(record.status).toBe('Checked In');
    });
  });

  describe('Shift Hours and Late/Early Out compliance calculation rules', () => {
    it('should flag late arrival for Regular Shift checked in after 9:15 AM', () => {
      const dummyRecord: AttendanceRecord = {
        id: 'rec-1',
        employeeId: 'emp-shift',
        employeeName: 'Shift Tester',
        department: 'Engineering',
        date: '2026-08-05',
        checkInTime: '2026-08-05T09:30:00Z', // 9:30 AM
        checkOutTime: '2026-08-05T18:00:00Z', // 6 PM
        breaks: [],
        shiftType: 'Regular',
        workMode: 'Office',
        status: 'Checked Out'
      };

      const stats = attendanceService.calculateHours(dummyRecord);
      expect(stats.lateArrival).toBe(true);
      expect(stats.workingHours).toBe(8.5);
      expect(stats.overtime).toBe(0.5);
    });

    it('should handle Overnight / Cross-Midnight Shift rules', () => {
      const dummyRecord: AttendanceRecord = {
        id: 'rec-2',
        employeeId: 'emp-shift',
        employeeName: 'Shift Tester',
        department: 'Engineering',
        date: '2026-08-05',
        checkInTime: '2026-08-05T21:00:00Z', // 9 PM check-in
        checkOutTime: '2026-08-06T06:00:00Z', // 6 AM check-out next day
        breaks: [
          { start: '2026-08-06T01:00:00Z', end: '2026-08-06T02:00:00Z' } // 1 hour break
        ],
        shiftType: 'Overnight',
        workMode: 'Office',
        status: 'Checked Out'
      };

      const stats = attendanceService.calculateHours(dummyRecord);
      expect(stats.workingHours).toBe(8.0);
      expect(stats.breakDuration).toBe(1.0);
      expect(stats.overtime).toBe(0);
    });
  });

  describe('Offline queue operations and idempotency syncing', () => {
    it('should queue multiple offline actions and sync them cleanly', () => {
      const idempotencyKey = 'unique-idemp-111';
      attendanceService.enqueueOfflineAction({
        type: 'CHECK_IN',
        payload: {
          employeeId: 'emp-offline',
          employeeName: 'Offline Worker',
          department: 'Engineering',
          shiftType: 'Flexible',
          workMode: 'Remote',
          idempotencyKey
        }
      });

      const queue = attendanceService.getOfflineQueue();
      expect(queue.length).toBe(1);

      // Sync offline queue
      const result = attendanceService.syncOfflineActions();
      expect(result.syncedCount).toBe(1);
      expect(result.errors.length).toBe(0);

      // Confirm record was written
      const records = attendanceService.getRecords();
      expect(records[0].employeeId).toBe('emp-offline');
      expect(records[0].status).toBe('Checked In');
    });
  });
});
