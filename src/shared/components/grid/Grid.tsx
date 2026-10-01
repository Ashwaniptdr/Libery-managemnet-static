import { Column } from 'primereact/column';
import {
  DataTable,
  type DataTableProps,
  type DataTableValueArray,
} from 'primereact/datatable';
import React from 'react';
import Button from '../buttons/Button';
import './Grid.css';

function mapColumns<T>(columns: Controls.ColumnProps<T>[]) {
  return columns.map(
    ({ sortable = true, filter = false, footer, ...column }, index) => {
      return (
        <Column
          key={String(column.field ?? index)}
          body={column.cell}
          field={column.field as string}
          header={column.header}
          style={{ width: column.width }}
          sortable={column.field && sortable ? sortable : false}
          sortField={column.field as string}
          filter={filter}
          footer={footer}
        />
      );
    }
  );
}

function paginationProps(pagination?: Controls.Pagination) {
  if (pagination === false) {
    return undefined;
  }

  const defaultProps = {
    rowsPerPageOptions: [5, 10, 20, 50],
    currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
    paginatorTemplate:
      'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  };
  if (pagination === true || pagination === undefined) {
    return { rows: 10, ...defaultProps };
  }

  const paginationType = pagination as Controls.PaginationProps;

  return {
    ...defaultProps,
    rows: paginationType.rows ?? 10,
  };
}

export default function Grid<T>({
  data,
  columns,
  editCaption,
  removeCaption,
  onEdit,
  onRemove,
  searchFields,
  pagination = true,
  onValueChange,
  ...rest
}: React.PropsWithChildren<Controls.GridProps<T>>) {
  const pageProps = paginationProps(pagination);
  return (
    <DataTable
      value={data as DataTableValueArray}
      scrollable
      scrollHeight={rest.scrollHeight ?? '600px'}
      style={{ width: '100%' }}
      globalFilterFields={searchFields as string[]}
      emptyMessage="No Records Found"
      {...(rest as DataTableProps<DataTableValueArray>)}
      onValueChange={onValueChange as (e: DataTableValueArray) => void}
      {...pageProps}
      paginator={!!pageProps}
      stripedRows
      removableSort={false}
      className="p-datatable-sm"
    >
      {columns && mapColumns(columns)}
      {rest.children}
      {onEdit && (
        <Column
          header="Edit"
          style={{ width: 90, textAlign: 'center' }}
          body={item => (
            <Button
              size="small"
              variant="outlined"
              icon="pencil"
              label={editCaption}
              onClick={() => onEdit(item)}
            />
          )}
        />
      )}
      {onRemove && (
        <Column
          header="Remove"
          style={{ width: 90, textAlign: 'center' }}
          body={item => (
            <Button
              size="small"
              variant="danger"
              icon="trash"
              label={removeCaption}
              onClick={() => onRemove(item)}
            />
          )}
        />
      )}
    </DataTable>
  );
}
