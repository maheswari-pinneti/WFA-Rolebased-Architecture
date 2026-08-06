import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttendanceRecord, CorrectionRequest, AuditLog, attendanceService } from '../services/attendance.service';

interface AttendanceState {
  activeRecord: AttendanceRecord | null;
  records: AttendanceRecord[];
  corrections: CorrectionRequest[];
  auditLogs: AuditLog[];
  isOffline: boolean;
  offlineQueueLength: number;
  notifications: Array<{ id: string; message: string; type: 'info' | 'warning' | 'success'; timestamp: string }>;
}

const initialState: AttendanceState = {
  activeRecord: null,
  records: [],
  corrections: [],
  auditLogs: [],
  isOffline: !navigator.onLine,
  offlineQueueLength: 0,
  notifications: [],
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setOfflineState(state, action: PayloadAction<boolean>) {
      state.isOffline = action.payload;
    },
    syncLocalData(state, action: PayloadAction<{ employeeId: string }>) {
      state.records = attendanceService.getRecords();
      state.corrections = attendanceService.getCorrections();
      state.auditLogs = attendanceService.getAuditLogs();
      state.offlineQueueLength = attendanceService.getOfflineQueue().length;
      
      const active = state.records.find((r) => r.employeeId === action.payload.employeeId && r.status !== 'Checked Out');
      state.activeRecord = active || null;
    },
    addNotification(state, action: PayloadAction<{ message: string; type: 'info' | 'warning' | 'success' }>) {
      state.notifications.unshift({
        id: Math.random().toString(36).substr(2, 9),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
    clearNotifications(state) {
      state.notifications = [];
    }
  },
});

export const { setOfflineState, syncLocalData, addNotification, clearNotifications } = attendanceSlice.actions;
export default attendanceSlice.reducer;
