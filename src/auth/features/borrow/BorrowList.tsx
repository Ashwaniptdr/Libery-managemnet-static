import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Button from 'shared/components/buttons/Button';
import DropDownList from 'shared/components/forms/DropDownList';
import GridPanel from 'shared/components/panels/GridPanel';
import Page from 'shared/components/panels/Page';
import { STATIC_BORROW_RECORDS } from 'shared/constants/staticData';

export default function BorrowList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const [borrows, setBorrows] = useState<Library.BorrowItem[]>(STATIC_BORROW_RECORDS);

  const filteredBorrows = borrows.filter(b => {
    if (!statusParam) return true;
    if (statusParam === 'OVERDUE') return b.status === 'OVERDUE';
    if (statusParam === 'WITHIN_DEADLINE') return b.status === 'ISSUED' || b.status === 'REISSUED';
    if (statusParam === 'ISSUED') return b.status === 'ISSUED' || b.status === 'REISSUED' || b.status === 'OVERDUE';
    return true;
  });

  // Return Book Action
  const handleReturn = (item: Library.BorrowItem) => {
    if (window.confirm(`Confirm return of "${item.bookTitle}" by ${item.borrowerName}?`)) {
      setBorrows(prev =>
        prev.map(b =>
          b.borrowId === item.borrowId
            ? {
              ...b,
              status: 'RETURNED',
              returnDate: new Date().toISOString().split('T')[0],
            }
            : b
        )
      );
    }
  };

  // Reissue Book Action (30 days extension per rule)
  const handleReissue = (item: Library.BorrowItem) => {
    if (window.confirm(`Reissue "${item.bookTitle}" to ${item.borrowerName} for another 30 days?`)) {
      const today = new Date();
      const newDueDate = new Date();
      newDueDate.setDate(today.getDate() + 30);

      setBorrows(prev =>
        prev.map(b =>
          b.borrowId === item.borrowId
            ? {
              ...b,
              status: 'REISSUED',
              dueDate: newDueDate.toISOString().split('T')[0],
              reissueCount: b.reissueCount + 1,
            }
            : b
        )
      );
    }
  };

  const columns: Controls.ColumnProps<Library.BorrowItem>[] = [
    { field: 'bookTitle', header: 'Book / Volume Title', width: '25%', sortable: true },
    { field: 'borrowerName', header: 'Borrower Name', width: '18%', sortable: true },
    {
      field: 'centerOrSection',
      header: 'Center / Section & Designation',
      width: '22%',
      sortable: true,
      cell: item => (
        <div>
          <div>{item.centerOrSection}</div>
          <small style={{ color: 'var(--text-muted)' }}>{item.designation}</small>
        </div>
      ),
    },
    { field: 'issueDate', header: 'Issue Date', width: '10%', sortable: true },
    {
      field: 'dueDate',
      header: 'Due Date (30 Days)',
      width: '12%',
      sortable: true,
      cell: item => (
        <div>
          <span style={{ fontWeight: item.status === 'OVERDUE' ? 700 : 400 }}>
            {item.dueDate}
          </span>
          {item.status === 'OVERDUE' && (
            <div style={{ color: 'var(--danger-color)', fontSize: '0.75rem', fontWeight: 600 }}>
              &bull; Overdue
            </div>
          )}
        </div>
      ),
    },
    {
      field: 'status',
      header: 'Status',
      width: '10%',
      cell: item => {
        let badgeClass = 'issued';
        if (item.status === 'OVERDUE') badgeClass = 'overdue';
        if (item.status === 'RETURNED') badgeClass = 'returned';
        if (item.status === 'REISSUED') badgeClass = 'reissued';

        return <span className={`status-badge ${badgeClass}`}>{item.status}</span>;
      },
    },
    {
      header: 'Actions',
      width: '13%',
      cell: item => {
        if (item.status === 'RETURNED') {
          return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed</span>;
        }

        return (
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Button
              size="small"
              variant="success"
              label="Return"
              icon="check"
              onClick={() => handleReturn(item)}
            />
            <Button
              size="small"
              variant="outlined"
              label="Reissue"
              icon="sync"
              onClick={() => handleReissue(item)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Page
      header="Book Borrowing & Circulation Register"
      subHeader="Track issued books with mandatory 30-day issue limit, reissuances, and returns"
      headerActions={
        <Button
          size="medium"
          variant="primary"
          icon="plus"
          label="+ Issue Book"
          onClick={() => navigate('/borrow/issue')}
        />
      }
    >
      {/* Inline Filters — directly below header button, directly above table */}
      <div className="list-inline-filters">
        <div style={{ width: '310px' }}>
          <DropDownList
            data={[
              { id: 'ALL', name: 'All Loans (Issued, Overdue, Returned)' },
              { id: 'OVERDUE', name: 'Deadline Exceeded (Overdue >30 Days)' },
              { id: 'WITHIN_DEADLINE', name: 'Within Deadline (Compliant)' },
              { id: 'RETURNED', name: 'Returned Records' },
            ]}
            textField="name"
            valueField="id"
            value={statusParam || 'ALL'}
            onChange={(val: any) => {
              if (!val || val === 'ALL') {
                setSearchParams({});
              } else {
                setSearchParams({ status: val });
              }
            }}
            placeholder="Filter by Status"
            defaultOptionText="Filter by Status"
            filter={false}
          />
        </div>

        {statusParam && statusParam !== 'ALL' && (
          <Button
            size="small"
            variant="outlined"
            icon="times"
            label="Clear Filter"
            onClick={() => setSearchParams({})}
          />
        )}

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#ffffff',
            padding: '0.45rem 0.85rem',
            borderRadius: '10px',
            border: '1.5px solid #e2e8f0',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <i className="pi pi-shield" style={{ color: 'var(--theme-primary, #ea580c)' }} />
          <span><strong>Rule:</strong> 30-day strict loan limit</span>
        </div>
      </div>

      <GridPanel
        title={`Circulation History & Active Loans (${filteredBorrows.length})`}
        data={filteredBorrows}
        columns={columns}
        searchFields={['bookTitle', 'borrowerName', 'centerOrSection', 'designation']}
        exportExcel
        onExportExcel={() => alert('Exporting borrow records...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
