import React from 'react';

export type StatusVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export interface ColumnDefinition<T> {
  key?: string;
  header: string;
  accessorKey?: string;
  cell?: ((item: T, info?: any) => React.ReactNode) | ((info: { row: { original: T }; getValue?: () => any }) => React.ReactNode);
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export type Column<T> = ColumnDefinition<T>;

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  avatar?: string;
  phone?: string;
  location?: string;
  code?: string;
  employeeCode?: string;
  designation?: string;
  performanceScore?: number;
  attendanceRate?: number;
  joinDate?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
