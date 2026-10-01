import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import DatePicker from 'shared/components/forms/DatePicker';
import DropDownList from 'shared/components/forms/DropDownList';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { CENTERS } from 'shared/constants/centers';
import { STATIC_BOOKS, STATIC_BORROW_RECORDS } from 'shared/constants/staticData';

export default function BorrowForm() {
  const navigate = useNavigate();

  // Form Fields per specification:
  // - Name
  // - Center/Section
  // - Designation
  // - Book selected
  // - Issue Date
  // - Auto-computed Due Date (+30 days)
  const [borrowerName, setBorrowerName] = useState('');
  const [centerOrSection, setCenterOrSection] = useState(CENTERS[0]?.name ?? '');
  const [designation, setDesignation] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(STATIC_BOOKS[0]?.bookId ?? null);
  const [issueDate, setIssueDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // 30 days calculation
  const calculateDueDate = (date: Date | null) => {
    if (!date) return '—';
    const due = new Date(date);
    due.setDate(due.getDate() + 30);
    return due.toISOString().split('T')[0];
  };

  const computedDueDateStr = calculateDueDate(issueDate);

  const sectionsList = [
    ...CENTERS.map(c => ({ id: c.name, name: c.name })),
    { id: 'Administration Section', name: 'Administration Section' },
    { id: 'Accounts & Finance Section', name: 'Accounts & Finance Section' },
    { id: 'Publications Section', name: 'Publications Section' },
    { id: 'IT & Digital Infrastructure Section', name: 'IT & Digital Infrastructure Section' },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!borrowerName.trim()) errs.borrowerName = 'Borrower name is required';
    if (!centerOrSection.trim()) errs.centerOrSection = 'Center/Section is required';
    if (!designation.trim()) errs.designation = 'Designation is required';
    if (!selectedBookId) errs.selectedBookId = 'Please select a book to issue';
    if (!issueDate) errs.issueDate = 'Issue date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const book = STATIC_BOOKS.find(b => b.bookId === selectedBookId);
    const newBorrow: Library.BorrowItem = {
      borrowId: Date.now(),
      bookId: selectedBookId!,
      bookTitle: book?.title ?? 'Unknown Book',
      borrowerName,
      centerOrSection,
      designation,
      issueDate: issueDate!.toISOString().split('T')[0],
      dueDate: computedDueDateStr,
      returnDate: null,
      status: 'ISSUED',
      reissueCount: 0,
      notes,
    };

    // Prepend to static records for demo
    STATIC_BORROW_RECORDS.unshift(newBorrow);

    setSuccessMessage(
      `Book "${book?.title}" issued to ${borrowerName} successfully! Due Date: ${computedDueDateStr}`
    );

    setTimeout(() => {
      navigate('/borrow');
    }, 1500);
  };

  return (
    <Page
      header="Issue Book for Borrowing"
      subHeader="Enter borrower details, center/section, designation. Standard lending limit is 30 days."
    >
      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success-color)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          <i className="pi pi-check-circle" /> {successMessage}
        </div>
      )}

      {/* 30 Day Rule Notification */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(235, 144, 16, 0.1) 0%, rgba(74, 55, 40, 0.05) 100%)',
          borderLeft: '4px solid var(--secondary-color)',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
          <i className="pi pi-calendar-times" style={{ marginRight: '0.5rem' }} />
          30-Day Circulation Rule
        </div>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Per library rules, books may be borrowed for up to <strong>30 days</strong>. If not returned
          or reissued by <strong>{computedDueDateStr}</strong>, the record will flag as overdue.
        </p>
      </div>

      <form onSubmit={handleIssueSubmit}>
        <Card title="Select Book">
          <DropDownList
            name="selectedBookId"
            label="Select Book"
            data={STATIC_BOOKS}
            textField="title"
            valueField="bookId"
            value={selectedBookId}
            onChange={val => setSelectedBookId(val)}
            errorMessage={errors.selectedBookId}
            required
          />
        </Card>

        <Card title="Borrower Details">
          <InputPanel orientation="horizontal">
            <TextBox
              name="borrowerName"
              label="Borrower Name"
              value={borrowerName}
              onChange={val => setBorrowerName(val)}
              placeholder="e.g. Dr. Amitabh Srivastava"
              errorMessage={errors.borrowerName}
              required
            />

            <DropDownList
              name="centerOrSection"
              label="Center / Section"
              data={sectionsList}
              textField="name"
              valueField="id"
              value={centerOrSection}
              onChange={val => setCenterOrSection(val)}
              errorMessage={errors.centerOrSection}
              required
            />

            <TextBox
              name="designation"
              label="Designation"
              value={designation}
              onChange={val => setDesignation(val)}
              placeholder="e.g. Senior Research Fellow / Advisor"
              errorMessage={errors.designation}
              required
            />

            <DatePicker
              name="issueDate"
              label="Date of Issuance"
              value={issueDate}
              onChange={val => setIssueDate(val)}
              errorMessage={errors.issueDate}
              required
            />
          </InputPanel>

          <InputPanel orientation="horizontal">
            <TextBox
              name="computedDue"
              label="Due Date (30-Day Policy)"
              value={computedDueDateStr}
              disabled
            />

            <TextBox
              name="notes"
              label="Remarks / Research Purpose (Optional)"
              value={notes}
              onChange={val => setNotes(val)}
              placeholder="e.g. For state finance survey paper"
            />
          </InputPanel>
        </Card>

        <ButtonPanel align="start">
          <Button type="submit" variant="primary" icon="check" label="Confirm & Issue Book" />
          <Button
            type="button"
            variant="outlined"
            icon="arrow-left"
            label="Cancel"
            onClick={() => navigate('/borrow')}
          />
        </ButtonPanel>
      </form>
    </Page>
  );
}
