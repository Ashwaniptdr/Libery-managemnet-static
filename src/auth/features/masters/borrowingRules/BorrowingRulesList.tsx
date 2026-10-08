import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import NumberBox from 'shared/components/forms/NumberBox';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { STATIC_BORROWING_RULES } from 'shared/constants/staticData';

export default function BorrowingRulesList() {
  const [rules, setRules] = useState<Library.DesignationBorrowRule[]>(STATIC_BORROWING_RULES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);

  // Form states
  const [designation, setDesignation] = useState('');
  const [maxBooks, setMaxBooks] = useState<number | null>(3);
  const [durationDays, setDurationDays] = useState<number | null>(30);
  const [gracePeriodDays, setGracePeriodDays] = useState<number | null>(5);
  const [finePerDay, setFinePerDay] = useState<number | null>(0);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!designation.trim()) errs.designation = 'Designation title is required';
    if (!maxBooks || maxBooks < 1) errs.maxBooks = 'Max books must be at least 1';
    if (!durationDays || durationDays < 1) errs.durationDays = 'Duration days must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setDesignation('');
    setMaxBooks(3);
    setDurationDays(30);
    setGracePeriodDays(5);
    setFinePerDay(0);
    setDescription('');
    setEditingRuleId(null);
    setErrors({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingRuleId) {
      setRules(prev =>
        prev.map(r =>
          r.ruleId === editingRuleId
            ? {
                ...r,
                designation: designation.trim(),
                maxBooks: maxBooks!,
                durationDays: durationDays!,
                gracePeriodDays: gracePeriodDays ?? 0,
                finePerDay: finePerDay ?? 0,
                description: description.trim() || undefined,
              }
            : r
        )
      );
      setSuccessMessage(`Borrowing rule for "${designation}" updated successfully!`);
    } else {
      const newRule: Library.DesignationBorrowRule = {
        ruleId: Date.now(),
        designation: designation.trim(),
        maxBooks: maxBooks!,
        durationDays: durationDays!,
        gracePeriodDays: gracePeriodDays ?? 0,
        finePerDay: finePerDay ?? 0,
        description: description.trim() || undefined,
        isActive: true,
      };
      setRules(prev => [newRule, ...prev]);
      setSuccessMessage(`Borrowing rule for "${designation}" created successfully!`);
    }

    setShowAddForm(false);
    resetForm();
  };

  const handleEdit = (rule: Library.DesignationBorrowRule) => {
    setEditingRuleId(rule.ruleId);
    setDesignation(rule.designation);
    setMaxBooks(rule.maxBooks ?? rule.maxBooksAllowed ?? 3);
    setDurationDays(rule.durationDays ?? rule.borrowingDurationDays ?? 30);
    setGracePeriodDays(rule.gracePeriodDays ?? 5);
    setFinePerDay(rule.finePerDay ?? rule.penaltyPerDay ?? 0);
    setDescription(rule.description ?? '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = (ruleId: number) => {
    setRules(prev =>
      prev.map(r => (r.ruleId === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const columns: Controls.ColumnProps<Library.DesignationBorrowRule>[] = [
    {
      field: 'designation',
      header: 'Designation / Staff Role',
      width: '26%',
      sortable: true,
      body: row => (
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>{row.designation}</strong>
          {row.description && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      field: 'durationDays',
      header: 'Lending Duration',
      width: '18%',
      sortable: true,
      body: row => (
        <span
          style={{
            background: 'var(--theme-subtle-bg, #eff6ff)',
            color: 'var(--theme-primary, #1d4ed8)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          {row.durationDays} Days
        </span>
      ),
    },
    {
      field: 'maxBooks',
      header: 'Max Books Allowed',
      width: '18%',
      sortable: true,
      body: row => (
        <span style={{ fontWeight: 600 }}>
          {row.maxBooks} {row.maxBooks === 1 ? 'Book' : 'Books'}
        </span>
      ),
    },
    {
      field: 'gracePeriodDays',
      header: 'Grace Period',
      width: '14%',
      sortable: true,
      body: row => <span>{row.gracePeriodDays} Days</span>,
    },
    {
      field: 'isActive',
      header: 'Status',
      width: '12%',
      body: row => (
        <span
          className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => handleToggleStatus(row.ruleId)}
          title="Click to toggle status"
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      field: 'ruleId',
      header: 'Actions',
      width: '12%',
      body: row => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <Button
            variant="text"
            icon="pencil"
            size="small"
            title="Edit Rule"
            onClick={() => handleEdit(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <Page
      header="Designation-Wise Borrowing Duration Master"
      subHeader="Configure lending duration, maximum book limits, and grace periods mapped to staff designations"
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
          title={editingRuleId ? 'Edit Designation Borrowing Rule' : 'New Designation Borrowing Rule'}
          onClose={() => {
            setShowAddForm(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSave}>
            <InputPanel orientation="horizontal">
              <TextBox
                name="designation"
                label="Designation / Role Title"
                value={designation}
                onChange={val => setDesignation(val)}
                placeholder="e.g. Senior Director / Advisor"
                errorMessage={errors.designation}
                required
              />

              <NumberBox
                name="durationDays"
                label="Borrowing Duration (Days)"
                value={durationDays}
                onChange={val => setDurationDays(val)}
                min={1}
                max={365}
                errorMessage={errors.durationDays}
                required
              />

              <NumberBox
                name="maxBooks"
                label="Max Allowed Books"
                value={maxBooks}
                onChange={val => setMaxBooks(val)}
                min={1}
                max={50}
                errorMessage={errors.maxBooks}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <NumberBox
                name="gracePeriodDays"
                label="Grace Period (Days)"
                value={gracePeriodDays}
                onChange={val => setGracePeriodDays(val)}
                min={0}
                max={60}
              />

              <NumberBox
                name="finePerDay"
                label="Fine per Day After Grace Period (₹)"
                value={finePerDay}
                onChange={val => setFinePerDay(val)}
                min={0}
              />

              <TextBox
                name="description"
                label="Notes / Description (Optional)"
                value={description}
                onChange={val => setDescription(val)}
                placeholder="e.g. Applicable for Centre Heads and Senior Consultants"
              />
            </InputPanel>

            <ButtonPanel>
              <Button
                type="submit"
                variant="primary"
                icon="check"
                label={editingRuleId ? 'Update Rule' : 'Save Rule'}
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
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="primary"
            icon="plus"
            label="+ Add Designation Rule"
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          />
        </div>
      )}

      <GridPanel
        title={`Configured Designation Borrowing Rules (${rules.length})`}
        data={rules}
        columns={columns}
        searchFields={['designation', 'description']}
        exportExcel
        onExportExcel={() => alert('Exporting borrowing rules to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
