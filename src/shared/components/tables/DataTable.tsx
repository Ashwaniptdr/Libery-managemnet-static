import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import {
  DataTable as PrimeDataTable,
  type DataTableValueArray,
  type DataTableProps as PrimeDataTableProps,
} from 'primereact/datatable';
import { Row } from 'primereact/row';
import React from 'react';

export type DataTableProps = PrimeDataTableProps<DataTableValueArray> & {
  children?: React.ReactNode;
};

function DataTable(props: DataTableProps) {
  return <PrimeDataTable {...props} />;
}

// Export Column, ColumnGroup, and Row for convenience
export { Column, ColumnGroup, Row };

export default DataTable;
