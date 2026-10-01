import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import TextBox from 'shared/components/forms/TextBox';
import GridPanel from 'shared/components/panels/GridPanel';
import Page from 'shared/components/panels/Page';
import { BOOK_CATEGORIES } from 'shared/constants/categories';
import { CENTERS } from 'shared/constants/centers';
import { STATIC_BOOKS } from 'shared/constants/staticData';
import './Audit.css';

interface AuditRowState {
  bookId: number;
  bookTitle: string;
  categoryName: string;
  centerName?: string;
  systemCopies: number;
  physicalCopies: number;
  availability: Library.AuditStatus;
  remarks: string;
}

export default function AuditList() {
  const [auditYear, setAuditYear] = useState<number>(2026);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize audit rows from books
  const [auditRows, setAuditRows] = useState<AuditRowState[]>(() =>
    STATIC_BOOKS.map(b => ({
      bookId: b.bookId,
      bookTitle: b.title,
      categoryName: b.categoryName,
      centerName: b.centerName,
      systemCopies: b.numberOfCopies,
      physicalCopies: b.numberOfCopies, // default to match
      availability: 'VERIFIED' as Library.AuditStatus,
      remarks: 'Stock verified on rack',
    }))
  );

  const yearOptions = [
    { id: 2026, text: '2026 Annual Verification' },
    { id: 2025, text: '2025 Annual Verification' },
    { id: 2024, text: '2024 Annual Verification' },
  ];

  const categoryFilterOptions = [
    { categoryId: 0, name: 'All Categories' },
    ...BOOK_CATEGORIES,
  ];

  const updateRow = (bookId: number, field: keyof AuditRowState, value: any) => {
    setAuditRows(prev =>
      prev.map(row => {
        if (row.bookId === bookId) {
          const updated = { ...row, [field]: value };
          // Auto-adjust availability if physical copies differ from system copies
          if (field === 'physicalCopies') {
            const num = Number(value);
            if (num < row.systemCopies) {
              updated.availability = 'MISSING';
              updated.remarks = `${row.systemCopies - num} volume(s) missing from shelf`;
            } else if (num > row.systemCopies) {
              updated.availability = 'EXTRA_COPIES';
              updated.remarks = `Found +${num - row.systemCopies} uncataloged copies`;
            } else {
              updated.availability = 'VERIFIED';
              updated.remarks = 'Complete stock verified';
            }
          }
          return updated;
        }
        return row;
      })
    );
  };

  const availabilityOptions = [
    { id: 'VERIFIED', text: 'Verified (Complete)' },
    { id: 'MISSING', text: 'Missing / Shortage' },
    { id: 'DAMAGED', text: 'Damaged / Wear' },
    { id: 'EXTRA_COPIES', text: 'Extra Found' },
    { id: 'PENDING', text: 'Verification Pending' },
  ];

  // Filtering
  const filteredRows = auditRows.filter(row => {
    if (selectedCategory !== 'ALL' && selectedCategory !== '0') {
      const cat = BOOK_CATEGORIES.find(c => String(c.categoryId) === selectedCategory);
      if (cat && row.categoryName !== cat.name) return false;
    }
    if (selectedCenter) {
      const center = CENTERS.find(c => c.centerId === selectedCenter);
      if (center && row.centerName !== center.name) return false;
    }
    return true;
  });

  // Calculate audit stats
  const totalAuditVolumes = 5000;
  const verifiedCount = auditRows.filter(r => r.availability === 'VERIFIED').length;
  const missingCount = auditRows.filter(r => r.availability === 'MISSING').length;
  const damagedCount = auditRows.filter(r => r.availability === 'DAMAGED').length;

  const handleSaveAudit = () => {
    setSuccessMessage(`Annual physical verification report for FY ${auditYear} saved successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const columns: Controls.ColumnProps<AuditRowState>[] = [
    { field: 'bookTitle', header: 'Book Title', width: '28%', sortable: true },
    {
      field: 'categoryName',
      header: 'Category / Center',
      width: '20%',
      cell: item => (
        <div>
          <div>{item.categoryName}</div>
          {item.centerName && (
            <small style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>
              {item.centerName}
            </small>
          )}
        </div>
      ),
    },
    {
      field: 'systemCopies',
      header: 'Accession Stock',
      width: '10%',
      cell: item => <span style={{ fontWeight: 600 }}>{item.systemCopies}</span>,
    },
    {
      field: 'physicalCopies',
      header: 'Physically Counted',
      width: '14%',
      cell: item => (
        <div style={{ maxWidth: '100px' }}>
          <NumberBox
            value={item.physicalCopies}
            onChange={val => updateRow(item.bookId, 'physicalCopies', val ?? 0)}
            min={0}
          />
        </div>
      ),
    },
    {
      field: 'availability',
      header: 'Physical Status',
      width: '15%',
      cell: item => {
        let badgeClass = 'verified';
        if (item.availability === 'MISSING') badgeClass = 'missing';
        if (item.availability === 'DAMAGED') badgeClass = 'overdue';

        return (
          <div>
            <span className={`status-badge ${badgeClass}`}>{item.availability}</span>
          </div>
        );
      },
    },
    {
      field: 'remarks',
      header: 'Verification Remarks',
      width: '13%',
      cell: item => (
        <TextBox
          value={item.remarks}
          onChange={val => updateRow(item.bookId, 'remarks', val)}
          placeholder="Enter remarks"
        />
      ),
    },
  ];

  return (
    <Page
      header={`Annual Library Stock Audit & Verification (${auditYear})`}
      subHeader="Perform annual physical count and discrepancy logging across all 5,000+ volumes category-wise"
      headerActions={
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Button
            size="medium"
            variant="primary"
            icon="save"
            label="Save Audit Verification"
            onClick={handleSaveAudit}
          />
          <Button
            size="medium"
            variant="outlined"
            icon="print"
            label="Print Sheet"
            onClick={() => window.print()}
          />
        </div>
      }
    >
      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success-color)',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <i className="pi pi-check-circle" /> {successMessage}
        </div>
      )}

      {/* 4 Stat Metrics */}
      <div className="audit-stats-grid">
        <div className="audit-stat-card">
          <div className="audit-stat-title">Target Audit Stock</div>
          <div className="audit-stat-value">{totalAuditVolumes.toLocaleString()}</div>
          <div className="audit-stat-sub">Registered accessioned copies</div>
        </div>

        <div className="audit-stat-card verified">
          <div className="audit-stat-title">Matching & Verified</div>
          <div className="audit-stat-value">{verifiedCount}</div>
          <div className="audit-stat-sub">Titles with matching inventory</div>
        </div>

        <div className="audit-stat-card missing">
          <div className="audit-stat-title">Shortage / Missing</div>
          <div className="audit-stat-value">{missingCount}</div>
          <div className="audit-stat-sub">Copies absent from shelf</div>
        </div>

        <div className="audit-stat-card damaged">
          <div className="audit-stat-title">Damaged / Binding</div>
          <div className="audit-stat-value">{damagedCount}</div>
          <div className="audit-stat-sub">Requires maintenance</div>
        </div>
      </div>

      {/* Inline Filters — directly below header button, directly above table */}
      <div className="list-inline-filters">
        <div style={{ minWidth: '240px', flex: '0 0 auto' }}>
          <DropDownList
            data={yearOptions}
            textField="text"
            valueField="id"
            value={auditYear}
            onChange={(val: any) => setAuditYear(Number(val))}
            placeholder="Audit Year"
            defaultOptionText="Audit Year"
            filter={false}
          />
        </div>

        <div style={{ minWidth: '290px', flex: '0 0 auto' }}>
          <DropDownList
            data={categoryFilterOptions}
            textField="name"
            valueField="categoryId"
            value={selectedCategory === 'ALL' ? 0 : Number(selectedCategory)}
            onChange={(val: any) => setSelectedCategory(String(val))}
            placeholder="All Categories"
            defaultOptionText="All Categories"
            showClear
          />
        </div>

        <div style={{ minWidth: '260px', flex: '0 0 auto' }}>
          <DropDownList
            data={CENTERS}
            textField="name"
            valueField="centerId"
            value={selectedCenter}
            onChange={(val: any) => setSelectedCenter(val)}
            placeholder="All 9 Centers"
            defaultOptionText="All 9 Centers"
            showClear
          />
        </div>

        {(selectedCategory !== 'ALL' || selectedCenter) && (
          <Button
            size="small"
            variant="outlined"
            label="Clear Filters"
            icon="times"
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedCenter(null);
            }}
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
          <i className="pi pi-pencil" style={{ color: 'var(--theme-primary, #ea580c)' }} />
          <span>Update counted copies in table to auto-verify</span>
        </div>
      </div>

      {/* Main Audit Grid */}
      <GridPanel
        title={`Verification Sheet (${filteredRows.length} Titles Listed)`}
        data={filteredRows}
        columns={columns}
        searchFields={['bookTitle', 'categoryName', 'centerName']}
        exportExcel
        onExportExcel={() => alert('Exporting audit sheet to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
