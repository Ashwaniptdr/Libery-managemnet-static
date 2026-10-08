import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import DatePicker from 'shared/components/forms/DatePicker';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import RadioButtonList from 'shared/components/forms/RadioButtonList';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import Page from 'shared/components/panels/Page';
import { STATIC_NEWSPAPERS, STATIC_MAGAZINES } from 'shared/constants/staticData';
import './NewspaperList.css';

const FREQUENCY_OPTIONS = [
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

const PUBLICATION_TYPE_OPTIONS = [
  { label: 'Newspapers', value: 'NEWSPAPER', icon: 'pi pi-calendar' },
  { label: 'Magazines', value: 'MAGAZINE', icon: 'pi pi-bookmark' },
];

function isSubscriptionActive(from: string, to: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return today >= from && today <= to;
}

export default function NewspaperList() {
  // Active radio selector: Newspaper vs Magazine
  const [selectedType, setSelectedType] = useState<Library.PublicationType>('NEWSPAPER');

  // Combined subscriptions list
  const [allSubscriptions, setAllSubscriptions] = useState<Library.NewspaperItem[]>([
    ...STATIC_NEWSPAPERS,
    ...STATIC_MAGAZINES.filter(m => !STATIC_NEWSPAPERS.some(n => n.newspaperId === m.newspaperId)),
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [subscriptionFrom, setSubscriptionFrom] = useState<Date | null>(new Date());
  const [subscriptionTo, setSubscriptionTo] = useState<Date | null>(null);
  const [subscriptionAmount, setSubscriptionAmount] = useState<number | null>(2400);
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [language, setLanguage] = useState('Hindi');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter subscriptions strictly by chosen Radio button type (Newspaper vs Magazine)
  const currentTypeSubscriptions = allSubscriptions.filter(s => s.publicationType === selectedType);

  const filteredSubscriptions = currentTypeSubscriptions.filter(s => {
    if (filterStatus === 'ACTIVE') return isSubscriptionActive(s.subscriptionFrom, s.subscriptionTo);
    if (filterStatus === 'EXPIRED') return !isSubscriptionActive(s.subscriptionFrom, s.subscriptionTo);
    return true;
  });

  const handleTypeChange = (newType: Library.PublicationType) => {
    setSelectedType(newType);
    setShowAddForm(false);
    resetForm(newType);
  };

  const handleTypeChangeInForm = (newType: Library.PublicationType) => {
    setSelectedType(newType);
    setFrequency(newType === 'NEWSPAPER' ? 'Daily' : 'Monthly');
    setSubscriptionAmount(newType === 'NEWSPAPER' ? 2400 : 1200);
    setLanguage(newType === 'NEWSPAPER' ? 'Hindi' : 'English');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = selectedType === 'NEWSPAPER' ? 'Newspaper name is required' : 'Magazine name is required';
    }
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

  const resetForm = (typeOverride?: Library.PublicationType) => {
    const targetType = typeOverride ?? selectedType;
    setName('');
    setVendor('');
    setPublisher('');
    setFrequency(targetType === 'NEWSPAPER' ? 'Daily' : 'Monthly');
    setSubscriptionFrom(new Date());
    setSubscriptionTo(null);
    setSubscriptionAmount(targetType === 'NEWSPAPER' ? 2400 : 1200);
    setFinancialYear('2026-27');
    setLanguage(targetType === 'NEWSPAPER' ? 'Hindi' : 'English');
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
    const typeLabel = selectedType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine';

    if (editingId) {
      setAllSubscriptions(prev =>
        prev.map(item =>
          item.newspaperId === editingId
            ? {
                ...item,
                name: name.trim(),
                publicationType: selectedType,
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
      setSuccessMessage(`${typeLabel} subscription for "${name}" updated successfully!`);
    } else {
      const newItem: Library.NewspaperItem = {
        newspaperId: Date.now(),
        name: name.trim(),
        publicationType: selectedType,
        publisher: publisher.trim() || vendor.trim(),
        vendor: vendor.trim(),
        frequency: frequency as Library.PeriodicalFrequency,
        subscriptionFrom: fromStr,
        subscriptionTo: toStr,
        subscriptionAmount: subscriptionAmount ?? undefined,
        financialYear: financialYear.trim(),
        language: language.trim() || (selectedType === 'NEWSPAPER' ? 'Hindi' : 'English'),
        notes: notes.trim() || undefined,
        isActive: isActiveSub,
      };

      setAllSubscriptions(prev => [newItem, ...prev]);
      if (selectedType === 'NEWSPAPER') {
        STATIC_NEWSPAPERS.unshift(newItem);
      } else {
        STATIC_MAGAZINES.unshift(newItem);
      }
      setSuccessMessage(`New ${typeLabel} subscription "${name}" added successfully!`);
    }

    setShowAddForm(false);
    resetForm();
  };

  const handleEdit = (item: Library.NewspaperItem) => {
    setEditingId(item.newspaperId);
    setSelectedType(item.publicationType);
    setName(item.name);
    setVendor(item.vendor || item.publisher);
    setPublisher(item.publisher);
    setFrequency(item.frequency || (item.publicationType === 'NEWSPAPER' ? 'Daily' : 'Monthly'));
    setSubscriptionFrom(new Date(item.subscriptionFrom));
    setSubscriptionTo(new Date(item.subscriptionTo));
    setSubscriptionAmount(item.subscriptionAmount ?? (item.publicationType === 'NEWSPAPER' ? 2400 : 1200));
    setFinancialYear(item.financialYear || '2026-27');
    setLanguage(item.language || (item.publicationType === 'NEWSPAPER' ? 'Hindi' : 'English'));
    setNotes(item.notes ?? '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = (id: number) => {
    setAllSubscriptions(prev =>
      prev.map(m => (m.newspaperId === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const columns: Controls.ColumnProps<Library.NewspaperItem>[] = [
    {
      field: 'name',
      header: selectedType === 'NEWSPAPER' ? 'Newspaper Name' : 'Magazine Title',
      width: '24%',
      sortable: true,
      body: row => (
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>
            {row.publicationType === 'NEWSPAPER' ? '📰' : '📖'} {row.name}
          </strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {row.language || 'Hindi / English'} &bull; Pub: {row.publisher}
          </div>
        </div>
      ),
    },
    {
      field: 'vendor',
      header: 'Vendor / Agency',
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
          {row.frequency || 'Daily'}
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
      header="Newspapers & Magazines Master"
      subHeader="Unified master register for institutional daily newspapers and periodicals/magazines with vendor details, frequency and subscription tenures"
    >
      {/* ─── RADIO BUTTON TYPE SELECTOR: Newspaper vs Magazine (When browsing list) ─── */}
      {!showAddForm && (
        <Card style={{ marginBottom: '1rem', padding: '0.85rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Select Periodical Category:
              </div>
              <RadioButtonList
                name="selectedType"
                options={PUBLICATION_TYPE_OPTIONS}
                value={selectedType}
                variant="pill"
                onChange={val => handleTypeChange(val as Library.PublicationType)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  background: 'var(--card-bg)',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                Showing {selectedType === 'NEWSPAPER' ? '📰 Newspapers' : '📖 Magazines'} ({currentTypeSubscriptions.length} Subscriptions)
              </span>
            </div>
          </div>
        </Card>
      )}

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
          className="np-form-card"
          title={
            editingId
              ? `Edit ${selectedType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine'} Subscription`
              : `Add New ${selectedType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine'} Subscription`
          }
          headerAction={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Category:
              </span>
              <RadioButtonList
                name="formTypeSelector"
                options={PUBLICATION_TYPE_OPTIONS}
                value={selectedType}
                variant="pill"
                onChange={val => handleTypeChangeInForm(val as Library.PublicationType)}
              />
            </div>
          }
          onClose={() => {
            setShowAddForm(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSave} className="np-master-form">
            <div className="np-form-grid">
              {/* ─── Row 1: 4 balanced columns (Basic Details) ─── */}
              <div className="np-form-field">
                <TextBox
                  name="name"
                  label={selectedType === 'NEWSPAPER' ? 'Newspaper Name' : 'Magazine Title'}
                  value={name}
                  onChange={val => setName(val)}
                  placeholder={
                    selectedType === 'NEWSPAPER'
                      ? 'e.g. Dainik Bhaskar / The Hindu'
                      : 'e.g. EPW / Frontline / India Today'
                  }
                  errorMessage={errors.name}
                  required
                />
              </div>

              <div className="np-form-field">
                <TextBox
                  name="vendor"
                  label="Vendor / Agency Name"
                  value={vendor}
                  onChange={val => setVendor(val)}
                  placeholder={
                    selectedType === 'NEWSPAPER'
                      ? 'e.g. Bhopal News Agency'
                      : 'e.g. Academic Book Bureau'
                  }
                  errorMessage={errors.vendor}
                  required
                />
              </div>

              <div className="np-form-field">
                <DropDownList
                  name="frequency"
                  label="Frequency"
                  data={FREQUENCY_OPTIONS}
                  textField="name"
                  valueField="id"
                  value={frequency}
                  onChange={val => setFrequency(val || (selectedType === 'NEWSPAPER' ? 'Daily' : 'Monthly'))}
                  required
                />
              </div>

              <div className="np-form-field">
                <TextBox
                  name="language"
                  label="Language"
                  value={language}
                  onChange={val => setLanguage(val)}
                  placeholder={selectedType === 'NEWSPAPER' ? 'e.g. Hindi / English' : 'e.g. English / Hindi'}
                />
              </div>

              {/* ─── Row 2: 4 balanced columns (Tenure & Financial Details) ─── */}
              <div className="np-form-field">
                <DatePicker
                  name="subscriptionFrom"
                  label="Subscription From Date"
                  value={subscriptionFrom}
                  onChange={val => setSubscriptionFrom(val)}
                  errorMessage={errors.subscriptionFrom}
                  required
                />
              </div>

              <div className="np-form-field">
                <DatePicker
                  name="subscriptionTo"
                  label="Subscription To Date"
                  value={subscriptionTo}
                  onChange={val => setSubscriptionTo(val)}
                  errorMessage={errors.subscriptionTo}
                  required
                />
              </div>

              <div className="np-form-field">
                <NumberBox
                  name="subscriptionAmount"
                  label="Subscription Amount (₹)"
                  value={subscriptionAmount}
                  onChange={val => setSubscriptionAmount(val)}
                  min={0}
                  errorMessage={errors.subscriptionAmount}
                  required
                />
              </div>

              <div className="np-form-field">
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
              </div>

              {/* ─── Row 3: 2 balanced columns spanning 2 cols each (Additional Details) ─── */}
              <div className="np-form-field span-2">
                <TextBox
                  name="publisher"
                  label="Publisher House / Organisation (Optional)"
                  value={publisher}
                  onChange={val => setPublisher(val)}
                  placeholder={
                    selectedType === 'NEWSPAPER'
                      ? 'e.g. DB Corp Ltd / THG Publishing Pvt Ltd'
                      : 'e.g. Publications Division, Ministry of I&B'
                  }
                />
              </div>

              <div className="np-form-field span-2">
                <TextBox
                  name="notes"
                  label="Remarks / Stand Location (Optional)"
                  value={notes}
                  onChange={val => setNotes(val)}
                  placeholder="e.g. Reading Stand N-1, Ground Floor Library Lounge"
                />
              </div>
            </div>

            {/* ─── Compact Action Buttons ─── */}
            <div className="np-form-actions">
              <Button
                type="submit"
                variant="primary"
                icon="check"
                label={
                  editingId
                    ? 'Update Subscription'
                    : `Save ${selectedType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine'} Subscription`
                }
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
            </div>
          </form>
        </Card>
      ) : (
        <>
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
              label={`+ Add ${selectedType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine'} Subscription`}
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
                All ({currentTypeSubscriptions.length})
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
                Active ({currentTypeSubscriptions.filter(s => isSubscriptionActive(s.subscriptionFrom, s.subscriptionTo)).length})
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
                Expired ({currentTypeSubscriptions.filter(s => !isSubscriptionActive(s.subscriptionFrom, s.subscriptionTo)).length})
              </button>
            </div>
          </div>

          <GridPanel
            title={`${selectedType === 'NEWSPAPER' ? 'Newspapers' : 'Magazines'} Subscriptions (${filteredSubscriptions.length})`}
            data={filteredSubscriptions}
            columns={columns}
            searchFields={['name', 'vendor', 'publisher', 'language']}
            exportExcel
            onExportExcel={() => alert(`Exporting ${selectedType.toLowerCase()}s to Excel...`)}
            print
            onPrint={() => window.print()}
          />
        </>
      )}
    </Page>
  );
}
