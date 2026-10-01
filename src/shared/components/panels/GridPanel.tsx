import React, { useState } from 'react';
import Button from '../buttons/Button';
import TextBox from '../forms/TextBox';
import Grid from '../grid/Grid';

interface GridPanelProps<T> extends Controls.GridProps<T> {
  title?: string;
  toolbar?: React.ReactElement;
  searchBox?: boolean;
  exportExcel?: boolean;
  onExportExcel?: () => void;
  print?: boolean;
  onPrint?: () => void;
  actionButtons?: React.ReactElement;
}

export default function GridPanel<T>({
  title,
  toolbar,
  searchBox = true,
  exportExcel = false,
  onExportExcel,
  print = false,
  onPrint,
  actionButtons,
  ...rest
}: GridPanelProps<T>) {
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('');

  const currentGlobalFilter = rest.globalFilter ?? internalGlobalFilter;

  const handleFilterChange = (value: string) => {
    setInternalGlobalFilter(value);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.85rem',
          padding: '0 2px',
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="pi pi-table" style={{ color: '#64748b', fontSize: '1rem' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {title}
            </span>
            {Array.isArray(rest.data) && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontWeight: 500,
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                {rest.data.length} record(s)
              </span>
            )}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {toolbar}
          {exportExcel && (
            <Button
              variant="outlined"
              size="small"
              icon="file-excel"
              label="Export"
              onClick={onExportExcel}
            />
          )}
          {print && (
            <Button
              variant="outlined"
              size="small"
              icon="print"
              label="Print"
              onClick={onPrint}
            />
          )}
          {actionButtons}
          {searchBox && (
            <div style={{ width: '220px' }}>
              <TextBox
                value={currentGlobalFilter}
                onChange={handleFilterChange}
                placeholder="Search records..."
                icon="search"
                iconPosition="right"
              />
            </div>
          )}
        </div>
      </div>
      <Grid {...rest} globalFilter={currentGlobalFilter} />
    </div>
  );
}
