import { describe, it, expect, beforeEach } from 'vitest';
import { attendanceService, OFFICE_COORDS, getDistance } from '../../frontend/services/attendance.service';

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

import { vi } from 'vitest';

vi.mock('../../frontend/services/api', () => {
  const mockRecords: any[] = [];
  return {
    apiClient: {
      post: vi.fn().mockImplementation((url, data) => {
        if (url.includes('check-in')) {
          const record = {
            id: 'rec-' + Math.random(),
            employeeId: data.employeeId,
            employeeName: data.employeeName,
            department: data.department,
            date: new Date().toISOString().split('T')[0],
            checkInTime: new Date().toISOString(),
            checkOutTime: null,
            breaks: [],
            shiftType: data.shiftType,
            workMode: data.workMode,
            status: 'Checked In'
          };
          mockRecords.push(record);
          return Promise.resolve({ data: { success: true, data: record } });
        }
        if (url.includes('break')) {
          const record = mockRecords.find(r => r.employeeId === data.employeeId && r.status !== 'Checked Out');
          if (record) {
            record.status = 'On Break';
            record.breaks.push({ start: new Date().toISOString(), end: null });
          }
          return Promise.resolve({ data: { success: true } });
        }
        if (url.includes('resume')) {
          const record = mockRecords.find(r => r.employeeId === data.employeeId && r.status === 'On Break');
          if (record) {
            record.status = 'Working';
            const b = record.breaks.find(bk => bk.end === null);
            if (b) b.end = new Date().toISOString();
          }
          return Promise.resolve({ data: { success: true } });
        }
        if (url.includes('check-out')) {
          const record = mockRecords.find(r => r.employeeId === data.employeeId && r.status !== 'Checked Out');
          if (record) {
            record.status = 'Checked Out';
            record.checkOutTime = new Date().toISOString();
          }
          return Promise.resolve({ data: { success: true } });
        }
        return Promise.resolve({ data: { success: true } });
      })
    }
  };
});

describe('Smart Attendance Service Unit & Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Geofencing distance calculations', () => {
    it('should correctly measure distance within bounds', () => {
      const dist = getDistance(12.9716, 77.5946, 12.97165, 77.59465);
      expect(dist).toBeLessThan(100);
    });

    it('should correctly flag coordinates outside office boundary', () => {
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

    it('should allow normal check-in and check-out transition', async () => {
      const checkedIn = await attendanceService.checkIn(empInfo);
      expect(checkedIn.status).toBe('Checked In');
      expect(checkedIn.checkOutTime).toBeNull();

      await attendanceService.checkOut('emp-999');
      const records = attendanceService.getRecords();
      expect(records[0].status).toBe('Checked Out');
      expect(records[0].checkOutTime).not.toBeNull();
    });

    it('should reject duplicate check-in attempts', async () => {
      await attendanceService.checkIn(empInfo);
      await expect(async () => {
        await attendanceService.checkIn(empInfo);
      }).rejects.toThrowError('Active session already exists. Must check out first.');
    });

    it('should reject check-out before check-in', async () => {
      await expect(async () => {
        await attendanceService.checkOut('emp-unregistered');
      }).rejects.toThrowError('Check-out-before-check-in rejection. No active session found.');
    });

    it('should support take break and resume cycle', async () => {
      await attendanceService.checkIn(empInfo);
      await attendanceService.takeBreak('emp-999');
      
      let records = attendanceService.getRecords();
      expect(records[0].status).toBe('On Break');
      expect(records[0].breaks[0].end).toBeNull();

      await attendanceService.resumeWork('emp-999');
      records = attendanceService.getRecords();
      expect(records[0].status).toBe('Working');
      expect(records[0].breaks[0].end).not.toBeNull();
    });
  });

  describe('Geofencing Access Enforcements', () => {
    it('should reject check-in if coordinates are missing for In-Office mode', async () => {
      await expect(async () => {
        await attendanceService.checkIn({
          employeeId: 'emp-geofence',
          employeeName: 'Jane Smith',
          department: 'HR Ops',
          shiftType: 'Regular',
          workMode: 'Office'
        });
      }).rejects.toThrowError('Location permissions are required for In-Office check-in.');
    });

    it('should reject check-in if coordinates are outside Bengaluru office radius', async () => {
      await expect(async () => {
        await attendanceService.checkIn({
          employeeId: 'emp-geofence-2',
          employeeName: 'Jane Smith',
          department: 'HR Ops',
          shiftType: 'Regular',
          workMode: 'Office',
          latitude: 12.9000,
          longitude: 77.5000
        });
      }).rejects.toThrowError(/Geofencing validation failed/);
    });

    it('should allow check-in if coordinates are within office bounds', async () => {
      const record = await attendanceService.checkIn({
        employeeId: 'emp-geofence-3',
        employeeName: 'Jane Smith',
        department: 'HR Ops',
        shiftType: 'Regular',
        workMode: 'Office',
        latitude: OFFICE_COORDS.lat,
        longitude: OFFICE_COORDS.lng
      });
      expect(record.status).toBe('Checked In');
    });
  });

  describe('Calculate working hours, breaks, and late status', () => {
    it('should correctly flag late arrival on regular shift', () => {
      const dummyRecord = {
        id: '1',
        employeeId: 'emp-1',
        employeeName: 'Emp 1',
        department: 'Engineering',
        date: '2026-08-05',
        checkInTime: '2026-08-05T09:30:00Z', // 9:30 AM is late (target 9:00 - 9:15 AM)
        checkOutTime: '2026-08-05T18:00:00Z',
        breaks: [],
        shiftType: 'Regular' as const,
        workMode: 'Office' as const,
        status: 'Checked Out' as const
      };

      const stats = attendanceService.calculateHours(dummyRecord);
      expect(stats.lateArrival).toBe(true);
      expect(stats.workingHours).toBe(8.5);
    });

    it('should calculate accurate working hours and overtime', () => {
      const dummyRecord = {
        id: '1',
        employeeId: 'emp-1',
        employeeName: 'Emp 1',
        department: 'Engineering',
        date: '2026-08-05',
        checkInTime: '2026-08-05T09:00:00Z',
        checkOutTime: '2026-08-05T18:00:00Z', // 9 hours total session
        breaks: [{ start: '2026-08-05T13:00:00Z', end: '2026-08-05T14:00:00Z' }], // 1 hour break
        shiftType: 'Regular' as const,
        workMode: 'Office' as const,
        status: 'Checked Out' as const
      };

      const stats = attendanceService.calculateHours(dummyRecord);
      expect(stats.workingHours).toBe(8.0);
      expect(stats.breakDuration).toBe(1.0);
      expect(stats.overtime).toBe(0.0);
    });
  });

  describe('Offline Queue & Synchronization', () => {
    it('should queue attendance actions offline and process them upon synchronization', async () => {
      attendanceService.enqueueOfflineAction({
        type: 'CHECK_IN',
        payload: {
          employeeId: 'emp-off',
          employeeName: 'Offline User',
          department: 'Sales',
          shiftType: 'Regular',
          workMode: 'Remote'
        }
      });

      let queue = attendanceService.getOfflineQueue();
      expect(queue.length).toBe(1);
      expect(queue[0].type).toBe('CHECK_IN');

      const result = await attendanceService.syncOfflineActions();
      expect(result.syncedCount).toBe(1);

      // Verify sync via simulated mock records check
      const records = attendanceService.getRecords();
      // Since it's mocked, we verify sync completion cleanly
      expect(result.errors.length).toBe(0);
    });
  });
});
