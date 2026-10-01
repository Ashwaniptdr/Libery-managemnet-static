import './ReportTable.css';
import type { ReportTableProps } from './types';

export default function ReportTable<T>({
  data,
  columns,
  customHeader,
  footer,
  className = '',
  style,
  bordered = true,
}: ReportTableProps<T>) {
  return (
    <table
      className={`report-table ${bordered ? 'bordered' : ''} ${className}`}
      style={style}
    >
      <thead>
        {customHeader ?? (
          <tr>
            {columns?.map((c, i) => (
              <th key={i}>{c.header}</th>
            ))}
          </tr>
        )}
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns?.map((col, j) => (
              <td key={j} style={{ textAlign: col.align }}>
                {col.render
                  ? col.render(row, i)
                  : col.field
                    ? String(row[col.field])
                    : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      {footer && <tfoot>{footer}</tfoot>}
    </table>
  );
}
