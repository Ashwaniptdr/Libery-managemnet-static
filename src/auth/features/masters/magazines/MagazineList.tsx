import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import DatePicker from 'shared/components/forms/DatePicker';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import TextArea from 'shared/components/forms/TextArea';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { STATIC_MAGAZINES } from 'shared/constants/staticData';

const MAGAZINE_FREQUENCY_OPTIONS = [
  { id: 'Daily', name: 'Daily' },
  { id: 'Weekly', name: 'Weekly' },
  { id: 'Bi-Weekly', name: 'Bi-Weekly' },
  { id: 'Monthly', name: 'Monthly' },
  { id: 'Fortnightly', name: 'Fortnightly' },
  { id: 'Quarterly', name: 'Quarterly' },
  { id: 'Half Yearly', name: 'Half Yearly' },
  { id: 'Annually', name: 'Annually' },
];

const FY_OPTIONS = [
  { id: '2026-27', name: '2026-27' },
  { id: '2025-26', name: '2025-26' },
  { id: '2024-25', name: '2024-25' },
  { id: '2027-28', name: '2027-28' },
];

function isSubscriptionActive(from: string, to: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return today >= from && today <= to;
}

export default function MagazineList() {
  const [magazines, setMagazines] = useState<Library.NewspaperItem[]>(STATIC_MAGAZINES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [subscriptionFrom, setSubscriptionFrom] = useState<Date | null>(new Date());
  const [subscriptionTo, setSubscriptionTo] = useState<Date | null>(null);
  const [subscriptionAmount, setSubscriptionAmount] = useState<number | null>(1200);
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [language, setLanguage] = useState('English');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredMagazines = magazines.filter(m => {
    if (filterStatus === 'ACTIVE') return isSubscriptionActive(m.subscriptionFrom, m.subscriptionTo);
    if (filterStatus === 'EXPIRED') return !isSubscriptionActive(m.subscriptionFrom, m.subscriptionTo);
    return true;
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Magazine name is required';
    if (!vendor.trim()) errs.vendor = 'Vendor / Supplier name is required';
    if (!subscriptionFrom) errs.subscriptionFrom = 'Subscription start date is required';
    if (!subscriptionTo) errs.subscriptionTo = 'Subscription end date is required';
    if (subscriptionFrom && subscriptionTo && subscriptionTo <= subscriptionFrom) {
      errs.subscriptionTo = 'End date must be after start date';
    }
    if (!subscriptionAmount || subscriptionAmount < 0) {
      errs.subscriptionAmount = 'Enter a valid subscription amount';
    }
    if (!financialYear.trim()) errs.financialYear = 'Financial Year is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setName('');
    setVendor('');
    setPublisher('');
    setFrequency('Monthly');
    setSubscriptionFrom(new Date());
    setSubscriptionTo(null);
    setSubscriptionAmount(1200);
    setFinancialYear('2026-27');
    setLanguage('English');
    setNotes('');
    setEditingId(null);
    setErrors({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fromStr = subscriptionFrom!.toISOString().split('T')[0];
    const toStr = subscriptionTo!.toISOString().split('T')[0];
    const isActiveSub = isSubscriptionActive(fromStr, toStr);

    if (editingId) {
      setMagazines(prev =>
        prev.map(item =>
          item.newspaperId === editingId
            ? {
                ...item,
                name: name.trim(),
                vendor: vendor.trim(),
                publisher: publisher.trim() || vendor.trim(),
                frequency: frequency as Library.PeriodicalFrequency,
                subscriptionFrom: fromStr,
                subscriptionTo: toStr,
                subscriptionAmount: subscriptionAmount ?? undefined,
                financialYear: financialYear.trim(),
                language: language.trim() || undefined,
                notes: notes.trim() || undefined,
                isActive: isActiveSub,
              }
            : item
        )
      );
      setSuccessMessage(`Magazine subscription for "${name}" updated successfully!`);
    } else {
      const newItem: Library.NewspaperItem = {
        newspaperId: Date.now(),
        name: name.trim(),
        publicationType: 'MAGAZINE',
        publisher: publisher.trim() || vendor.trim(),
        vendor: vendor.trim(),
        frequency: frequency as Library.PeriodicalFrequency,
        subscriptionFrom: fromStr,
        subscriptionTo: toStr,
        subscriptionAmount: subscriptionAmount ?? undefined,
        financialYear: financialYear.trim(),
        language: language.trim() || 'English',
        notes: notes.trim() || undefined,
        isActive: isActiveSub,
      };
      setMagazines(prev => [newItem, ...prev]);
      STATIC_MAGAZINES.unshift(newItem);
      setSuccessMessage(`New Magazine subscription "${name}" added successfully!`);
    }

    setShowAddForm(false);
    resetForm();
  };

  const handleEdit = (item: Library.NewspaperItem) => {
    setEditingId(item.newspaperId);
    setName(item.name);
    setVendor(item.vendor || item.publisher);
    setPublisher(item.publisher);
    setFrequency(item.frequency || 'Monthly');
    setSubscriptionFrom(new Date(item.subscriptionFrom));
    setSubscriptionTo(new Date(item.subscriptionTo));
    setSubscriptionAmount(item.subscriptionAmount ?? 1000);
    setFinancialYear(item.financialYear || '2026-27');
    setLanguage(item.language || 'English');
    setNotes(item.notes ?? '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = (id: number) => {
    setMagazines(prev =>
      prev.map(m => (m.newspaperId === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const columns: Controls.ColumnProps<Library.NewspaperItem>[] = [
    {
      field: 'name',
      header: 'Magazine Title',
      width: '24%',
      sortable: true,
      body: row => (
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>📖 {row.name}</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {row.language || 'English'} &bull; Pub: {row.publisher}
          </div>
        </div>
      ),
    },
    {
      field: 'vendor',
      header: 'Vendor / Supplier',
      width: '18%',
      sortable: true,
      body: row => <span>{row.vendor || row.publisher}</span>,
    },
    {
      field: 'frequency',
      header: 'Frequency',
      width: '12%',
      sortable: true,
      body: row => (
        <span
          style={{
            background: 'var(--theme-subtle-bg, #eff6ff)',
            color: 'var(--theme-primary, #1d4ed8)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {row.frequency || 'Monthly'}
        </span>
      ),
    },
    {
      field: 'subscriptionFrom',
      header: 'Duration (From - To)',
      width: '18%',
      sortable: true,
      body: row => (
        <div style={{ fontSize: '0.82rem' }}>
          <div>{row.subscriptionFrom}</div>
          <div style={{ color: 'var(--text-secondary)' }}>to {row.subscriptionTo}</div>
        </div>
      ),
    },
    {
      field: 'subscriptionAmount',
      header: 'Amount / FY',
      width: '14%',
      sortable: true,
      body: row => (
        <div>
          <strong>₹{(row.subscriptionAmount ?? 0).toLocaleString()}</strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            FY {row.financialYear || '2026-27'}
          </div>
        </div>
      ),
    },
    {
      field: 'isActive',
      header: 'Status',
      width: '14%',
      body: row => {
        const active = isSubscriptionActive(row.subscriptionFrom, row.subscriptionTo);
        return (
          <span
            className={`badge ${active ? 'badge-success' : 'badge-danger'}`}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => handleToggleStatus(row.newspaperId)}
            title="Click to toggle status"
          >
            {active ? 'Active' : 'Expired'}
          </span>
        );
      },
    },
    {
      field: 'newspaperId',
      header: 'Actions',
      width: '10%',
      body: row => (
        <Button
          variant="text"
          icon="pencil"
          size="small"
          title="Edit Subscription"
          onClick={() => handleEdit(row)}
        />
      ),
    },
  ];

  return (
    <Page
      header="Magazines Master"
      subHeader="Manage institutional subscriptions, vendors, periodicity, durations and budgets for periodicals & journals"
    >
      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--success-bg, #dcfce7)',
            color: 'var(--success-color, #15803d)',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
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

      {showAddForm ? (
        <Card
          title={editingId ? 'Edit Magazine Subscription' : 'Add New Magazine Subscription'}
          onClose={() => {
            setShowAddForm(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSave}>
            <InputPanel orientation="horizontal">
              <TextBox
                name="name"
                label="Magazine Name / Title"
                value={name}
                onChange={val => setName(val)}
                placeholder="e.g. Economic & Political Weekly (EPW) / Yojana"
                errorMessage={errors.name}
                required
              />

              <TextBox
                name="vendor"
                label="Vendor / Agency Name"
                value={vendor}
                onChange={val => setVendor(val)}
                placeholder="e.g. Academic Book Bureau / Thomson Press"
                errorMessage={errors.vendor}
                required
              />

              <DropDownList
                name="frequency"
                label="Frequency"
                data={MAGAZINE_FREQUENCY_OPTIONS}
                textField="name"
                valueField="id"
                value={frequency}
                onChange={val => setFrequency(val || 'Monthly')}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <DatePicker
                name="subscriptionFrom"
                label="Subscription Duration: From Date"
                value={subscriptionFrom}
                onChange={val => setSubscriptionFrom(val)}
                errorMessage={errors.subscriptionFrom}
                required
              />

              <DatePicker
                name="subscriptionTo"
                label="Subscription Duration: To Date"
                value={subscriptionTo}
                onChange={val => setSubscriptionTo(val)}
                errorMessage={errors.subscriptionTo}
                required
              />

              <NumberBox
                name="subscriptionAmount"
                label="Subscription Amount (₹)"
                value={subscriptionAmount}
                onChange={val => setSubscriptionAmount(val)}
                min={0}
                errorMessage={errors.subscriptionAmount}
                required
              />

              <DropDownList
                name="financialYear"
                label="Financial Year"
                data={FY_OPTIONS}
                textField="name"
                valueField="id"
                value={financialYear}
                onChange={val => setFinancialYear(val || '2026-27')}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <TextBox
                name="publisher"
                label="Publisher Name (Optional)"
                value={publisher}
                onChange={val => setPublisher(val)}
                placeholder="e.g. Sameeksha Trust / Publications Division"
              />

              <TextBox
                name="language"
                label="Language"
                value={language}
                onChange={val => setLanguage(val)}
                placeholder="e.g. English / Hindi"
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <TextArea
                name="notes"
                label="Remarks / Subscription Reference (Optional)"
                value={notes}
                onChange={val => setNotes(val)}
                placeholder="e.g. PO No. AIGGPA/LIB/MAG/2026-08, Central Library Reading Room"
              />
            </InputPanel>

            <ButtonPanel>
              <Button
                type="submit"
                variant="primary"
                icon="check"
                label={editingId ? 'Update Subscription' : 'Save Magazine Subscription'}
              />
              <Button
                type="button"
                variant="outlined"
                icon="times"
                label="Cancel"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              />
            </ButtonPanel>
          </form>
        </Card>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <Button
            variant="primary"
            icon="plus"
            label="+ Add Magazine Subscription"
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          />

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Filter:
            </span>
            <button
              type="button"
              className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: filterStatus === 'ALL' ? 'var(--theme-primary)' : 'var(--card-bg)',
                color: filterStatus === 'ALL' ? '#fff' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All ({magazines.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${filterStatus === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ACTIVE')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: filterStatus === 'ACTIVE' ? 'var(--theme-primary)' : 'var(--card-bg)',
                color: filterStatus === 'ACTIVE' ? '#fff' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Active ({magazines.filter(m => isSubscriptionActive(m.subscriptionFrom, m.subscriptionTo)).length})
            </button>
            <button
              type="button"
              className={`filter-btn ${filterStatus === 'EXPIRED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('EXPIRED')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: filterStatus === 'EXPIRED' ? 'var(--theme-primary)' : 'var(--card-bg)',
                color: filterStatus === 'EXPIRED' ? '#fff' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Expired ({magazines.filter(m => !isSubscriptionActive(m.subscriptionFrom, m.subscriptionTo)).length})
            </button>
          </div>
        </div>
      )}

      <GridPanel
        title={`Institutional Magazines & Periodicals (${filteredMagazines.length})`}
        data={filteredMagazines}
        columns={columns}
        searchFields={['name', 'vendor', 'publisher', 'language']}
        exportExcel
        onExportExcel={() => alert('Exporting magazines to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
