declare namespace Controls {
  interface GridProps<T> {
    data: Array<T>;
    columns?: ColumnProps<T>[];
    children?: React.ReactNode;
    editCaption?: string;
    onEdit?: (obj: T) => void;
    removeCaption?: string;
    onRemove?: (obj: T) => void;
    pagination?: Pagination;
    searchFields?: (keyof T)[];
    globalFilter?: string;
    cellMemo?: boolean;
    lazyVirtualization?: boolean;
    headerColumnGroup?: React.ReactNode;
    footerColumnGroup?: React.ReactNode;
    size?: 'small' | 'large';
    showGridlines?: boolean;
    stripedRows?: boolean;
    className?: string;
    rowGroupMode?: 'subheader' | 'rowspan';
    groupRowsBy?: string | string[];
    rowGroupHeaderTemplate?: (data: T) => React.ReactNode;
    scrollHeight?: string;
    scrollable?: boolean;
    selection?: T | T[];
    onSelectionChange?: (e: { value: T | T[] }) => void;
    selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';
    cellSelection?: boolean;
    dragSelection?: boolean;
    contextMenuSelection?: T;
    onContextMenuSelectionChange?: (e: { value: T }) => void;
    dataKey?: string;
    isDataSelectable?: (event: { data: T }) => boolean;
    onValueChange?: (value: T[]) => void;
    rowClassName?: (data: T) => string;
    onSort?: (e: { sortField?: string; sortOrder?: number }) => void;
    onFilter?: (e: { globalFilter?: string }) => void;
    sortField?: string | null;
    sortOrder?: number | null;
  }

  interface ColumnProps<T> {
    field?: keyof T;
    header?: string | React.ReactNode;
    cell?: (item: T, option: { rowIndex: number }) => React.ReactElement;
    sortable?: boolean;
    width?: number | string;
    filter?: boolean;
    footer?: string | React.ReactNode;
  }

  interface PaginationProps {
    rows?: number;
  }

  type Pagination = boolean | PaginationProps;
}
