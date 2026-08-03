import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeaderState, HeaderNotification, LanguageOption } from './types';

const initialState: HeaderState = {
  sidebarOpen: true,
  theme: 'dark',
  language: 'en',
  notifications: [
    {
      id: 'n1',
      title: 'Q2 Headcount Report Ready',
      subtitle: 'HR Operations',
      time: '5m ago',
      type: 'info',
      path: '/hr/reports',
      read: false,
    },
    {
      id: 'n2',
      title: 'Security Audit Verified',
      subtitle: 'System Governance',
      time: '1h ago',
      type: 'success',
      path: '/admin/audit-logs',
      read: false,
    },
    {
      id: 'n3',
      title: 'Leave Approvals Queue',
      subtitle: '3 Pending Requests',
      time: '2h ago',
      type: 'warning',
      path: '/manager/approvals',
      read: true,
    },
  ],
  unreadNotificationCount: 2,
  searchQuery: '',
  searchCategory: 'all',
  searchFocused: false,
  activeDropdown: null,
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleThemeMode: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<LanguageOption>) => {
      state.language = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchCategory: (state, action: PayloadAction<HeaderState['searchCategory']>) => {
      state.searchCategory = action.payload;
    },
    setSearchFocused: (state, action: PayloadAction<boolean>) => {
      state.searchFocused = action.payload;
    },
    setActiveDropdown: (state, action: PayloadAction<HeaderState['activeDropdown']>) => {
      state.activeDropdown = action.payload;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadNotificationCount = 0;
    },
    addNotification: (state, action: PayloadAction<HeaderNotification>) => {
      state.notifications.unshift(action.payload);
      state.unreadNotificationCount += 1;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleThemeMode,
  setThemeMode,
  setLanguage,
  setSearchQuery,
  setSearchCategory,
  setSearchFocused,
  setActiveDropdown,
  markAllNotificationsRead,
  addNotification,
} = headerSlice.actions;

export default headerSlice.reducer;
