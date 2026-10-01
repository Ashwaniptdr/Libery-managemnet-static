import React from 'react';

export interface ReportTableProps<T> {
  data: T[];
  columns?: {
    header: string;
    field?: keyof T;
    render?: (item: T, index: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
  }[];
  customHeader?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  bordered?: boolean;
}
