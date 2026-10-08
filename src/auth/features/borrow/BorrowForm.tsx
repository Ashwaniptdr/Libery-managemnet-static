import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import CheckBox from 'shared/components/forms/CheckBox';
import DatePicker from 'shared/components/forms/DatePicker';
import DropDownList from 'shared/components/forms/DropDownList';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import Page from 'shared/components/panels/Page';
import { CENTERS } from 'shared/constants/centers';
import {
  STATIC_BOOKS,
  STATIC_BORROW_RECORDS,
  BORROWER_PROFILES,
} from 'shared/constants/staticData';
import BorrowerCreditCard, { computeCreditScore } from './BorrowerCreditCard';
import './BorrowForm.css';

const REGISTERED_BORROWERS = [
  {
    id: 'Amitabh Srivastava',
    name: 'Dr. Amitabh Srivastava (CPPG)',
    borrowerName: 'Amitabh Srivastava',
    center: 'Centre for Public Policy & Governance (CPPG)',
    designation: 'Research Associate',
  },
  {
    id: 'Deepak Chawla',
    name: 'Deepak Chawla (CUG)',
    borrowerName: 'Deepak Chawla',
    center: 'Centre for Urban Governance (CUG)',
    designation: 'Senior Consultant',
  },
  {
    id: 'Rohit Agrawal',
    name: 'Rohit Agrawal (CKM)',
    borrowerName: 'Rohit Agrawal',
    center: 'Centre for Knowledge Management (CKM)',
    designation: 'Systems Analyst',
  },
  {
    id: 'Dr. Sunita Baghel',
    name: 'Dr. Sunita Baghel (CCE)',
    borrowerName: 'Dr. Sunita Baghel',
    center: 'Centre for Climate Change & Environment (CCE)',
    designation: 'Research Fellow',
  },
  {
    id: 'Priyanka Sen',
    name: 'Priyanka Sen (Publications)',
    borrowerName: 'Priyanka Sen',
    center: 'Publications Section',
    designation: 'Documentation Officer',
  },
  {
    id: 'custom',
    name: '➕ Enter New / Other Borrower',
    borrowerName: '',
    center: '',
    designation: '',
  },
];

export default function BorrowForm() {
  const navigate = useNavigate();

  // Selected borrower dropdown state (defaults to Amitabh Srivastava)
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string>('Amitabh Srivastava');

  // Form state
  const [borrowerName, setBorrowerName] = useState('Amitabh Srivastava');
  const [centerOrSection, setCenterOrSection] = useState(
    'Centre for Public Policy & Governance (CPPG)'
  );
  const [designation, setDesignation] = useState('Research Associate');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(
    STATIC_BOOKS[0]?.bookId ?? null
  );
  const [issueDate, setIssueDate] = useState<Date | null>(new Date());

  // Date of return (default: 30 days from today)
  const initialReturn = new Date();
  initialReturn.setDate(initialReturn.getDate() + 30);
  const [returnDate, setReturnDate] = useState<Date | null>(initialReturn);

  // Special permission fields
  const [specialPermission, setSpecialPermission] = useState(false);
  const [permissionGivenBy, setPermissionGivenBy] = useState('');

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Borrower history state
  const [creditScore, setCreditScore] = useState<Library.BorrowerCreditScore | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sections list (centers + admin sections)
  const sectionsList = [
    ...CENTERS.map(c => ({ id: c.name, name: c.name })),
    { id: 'Administration Section', name: 'Administration Section' },
    { id: 'Accounts & Finance Section', name: 'Accounts & Finance Section' },
    { id: 'Publications Section', name: 'Publications Section' },
    { id: 'IT & Digital Infrastructure Section', name: 'IT & Digital Infrastructure Section' },
  ];

  // Borrower dropdown change handler
  const handleBorrowerSelect = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    const found = REGISTERED_BORROWERS.find(b => b.id === borrowerId);
    if (found && found.id !== 'custom') {
      setBorrowerName(found.borrowerName);
      setCenterOrSection(found.center);
      setDesignation(found.designation);
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.borrowerName;
        delete copy.centerOrSection;
        delete copy.designation;
        return copy;
      });
    } else if (found?.id === 'custom') {
      setBorrowerName('');
      setDesignation('');
    }
  };

  // Debounced borrower name search → compute history
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (borrowerName.trim().length < 2) {
      setCreditScore(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const normalised = borrowerName.trim().toLowerCase();
      const matches = STATIC_BORROW_RECORDS.filter(r =>
        r.borrowerName.toLowerCase().includes(normalised)
      );
      if (matches.length > 0) {
        setCreditScore(computeCreditScore(matches));
      } else {
        setCreditScore(null);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [borrowerName]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!borrowerName.trim()) errs.borrowerName = 'Borrower name is required';
    if (!centerOrSection.trim()) errs.centerOrSection = 'Center/Section is required';
    if (!designation.trim()) errs.designation = 'Designation is required';
    if (!selectedBookId) errs.selectedBookId = 'Please select a book to issue';
    if (!issueDate) errs.issueDate = 'Issue date is required';
    if (!returnDate) errs.returnDate = 'Date of return is required';
    if (specialPermission && !permissionGivenBy.trim()) {
      errs.permissionGivenBy = 'Please enter who gave the permission';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const book = STATIC_BOOKS.find(b => b.bookId === selectedBookId);
    const issueDateStr = issueDate!.toISOString().split('T')[0];
    const returnDateStr = returnDate!.toISOString().split('T')[0];

    const newBorrow: Library.BorrowItem = {
      borrowId: Date.now(),
      bookId: selectedBookId!,
      bookTitle: book?.title ?? 'Unknown Book',
      borrowerName,
      centerOrSection,
      designation,
      issueDate: issueDateStr,
      dueDate: returnDateStr,
      returnDate: null,
      specialPermission,
      permissionGivenBy: specialPermission ? permissionGivenBy.trim() : undefined,
      status: 'ISSUED',
      reissueCount: 0,
      notes,
    };

    STATIC_BORROW_RECORDS.unshift(newBorrow);

    setSuccessMessage(
      `Book "${book?.title}" issued to ${borrowerName} successfully! Date of return: ${returnDateStr}`
    );

    setTimeout(() => {
      navigate('/borrow');
    }, 1500);
  };

  // Get extended profile details for the selected borrower
  const currentProfile = BORROWER_PROFILES[borrowerName.trim()] || null;
  const joiningDate = currentProfile?.joiningDate || '2023-06-15';
  const contractEndDate = currentProfile?.contractEndDate || '2027-06-14';

  return (
    <Page
      header="Issue Book for Borrowing"
      subHeader="Select book and borrower details, specify return date, and view borrower loan record"
      className="borrow-page"
    >
      {successMessage && (
        <div className="borrow-success-banner">
          <i className="pi pi-check-circle" /> {successMessage}
        </div>
      )}

      <form onSubmit={handleIssueSubmit} className="borrow-main-form">
        {/* Full-width 50/50 responsive layout - Non-scrollable at 100% zoom */}
        <div className="borrow-layout">
          {/* Left Column (50%): Clean 2-column input grid */}
          <div className="borrow-form-col">
            <Card title="Book & Borrower Details" className="borrow-unified-card">
              <div className="borrow-fields-grid">
                {/* Row 1: Select Book & Select Borrower */}
                <div className="borrow-field">
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
                </div>

                <div className="borrow-field">
                  <DropDownList
                    name="selectedBorrowerId"
                    label="Select Registered Borrower"
                    data={REGISTERED_BORROWERS}
                    textField="name"
                    valueField="id"
                    value={selectedBorrowerId}
                    onChange={handleBorrowerSelect}
                  />
                </div>

                {/* Row 2: Borrower Name & Center / Section */}
                <div className="borrow-field">
                  <TextBox
                    name="borrowerName"
                    label="Borrower Name"
                    value={borrowerName}
                    onChange={val => {
                      setBorrowerName(val);
                      if (val !== selectedBorrowerId) {
                        setSelectedBorrowerId('custom');
                      }
                    }}
                    placeholder="e.g. Amitabh Srivastava"
                    errorMessage={errors.borrowerName}
                    required
                  />
                </div>

                <div className="borrow-field">
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
                </div>

                {/* Row 3: Designation & Date of Issuance */}
                <div className="borrow-field">
                  <TextBox
                    name="designation"
                    label="Designation"
                    value={designation}
                    onChange={val => setDesignation(val)}
                    placeholder="e.g. Senior Research Fellow"
                    errorMessage={errors.designation}
                    required
                  />
                </div>

                <div className="borrow-field">
                  <DatePicker
                    name="issueDate"
                    label="Date of Issuance"
                    value={issueDate}
                    onChange={val => {
                      setIssueDate(val);
                      if (val) {
                        const newRet = new Date(val);
                        newRet.setDate(newRet.getDate() + 30);
                        setReturnDate(newRet);
                      }
                    }}
                    errorMessage={errors.issueDate}
                    required
                  />
                </div>

                {/* Row 4: Date of return & Remarks */}
                <div className="borrow-field">
                  <DatePicker
                    name="returnDate"
                    label="Date of return"
                    value={returnDate}
                    onChange={val => setReturnDate(val)}
                    errorMessage={errors.returnDate}
                    required
                  />
                </div>

                <div className="borrow-field">
                  <TextBox
                    name="notes"
                    label="Remarks / Research Purpose (Optional)"
                    value={notes}
                    onChange={val => setNotes(val)}
                    placeholder="e.g. For state finance survey paper"
                  />
                </div>

                {/* Row 5: Special Permission Checkbox & Who Gave Permission */}
                <div className="borrow-field" style={{ display: 'flex', alignItems: 'center', paddingTop: '0.5rem' }}>
                  <CheckBox
                    name="specialPermission"
                    label="Special Permission"
                    checked={specialPermission}
                    onChange={val => setSpecialPermission(val)}
                  />
                </div>

                <div className="borrow-field">
                  {specialPermission ? (
                    <TextBox
                      name="permissionGivenBy"
                      label="Who gave the permission"
                      value={permissionGivenBy}
                      onChange={val => setPermissionGivenBy(val)}
                      placeholder="e.g. Director General / Section Head"
                      errorMessage={errors.permissionGivenBy}
                      required
                    />
                  ) : (
                    <div style={{ height: '100%' }} />
                  )}
                </div>
              </div>

              {/* Action buttons at bottom */}
              <div className="borrow-form-actions">
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
              </div>
            </Card>
          </div>

          {/* Right Column (50%): Borrower History Card */}
          <div className="borrow-history-col">
            <Card title="Borrower History & Profile" className="borrow-history-card-wrap">
              {/* State 1: Matching history found */}
              {creditScore && (
                <BorrowerCreditCard
                  score={creditScore}
                  centerOrSection={centerOrSection}
                  designation={designation}
                  joiningDate={joiningDate}
                  contractEndDate={contractEndDate}
                />
              )}

              {/* State 2: Borrower name typed but no past records (New Borrower) */}
              {!creditScore && borrowerName.trim().length >= 2 && (
                <div className="borrow-new-borrower-panel">
                  <div className="bnb-header">
                    <div className="bnb-avatar">
                      <i className="pi pi-user" />
                    </div>
                    <div>
                      <div className="bnb-name">{borrowerName}</div>
                      <div className="bnb-sub">
                        {designation ? `${designation} • ` : ''}
                        {centerOrSection || 'New Borrower'}
                      </div>
                    </div>
                  </div>

                  <div className="bcc-dates-banner" style={{ margin: '0.75rem 0' }}>
                    <div className="bcc-date-item">
                      <span className="bcc-date-icon">📅</span>
                      <div className="bcc-date-content">
                        <span className="bcc-date-label">Joining Date</span>
                        <strong className="bcc-date-value">{joiningDate}</strong>
                      </div>
                    </div>
                    <div className="bcc-date-divider" />
                    <div className="bcc-date-item">
                      <span className="bcc-date-icon">⏳</span>
                      <div className="bcc-date-content">
                        <span className="bcc-date-label">Contract End Date</span>
                        <strong className="bcc-date-value">{contractEndDate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bnb-stats">
                    <div className="bnb-stat">
                      <span className="bnb-stat-val">0</span>
                      <span className="bnb-stat-lbl">No of Books issued until now</span>
                    </div>
                    <div className="bnb-stat">
                      <span className="bnb-stat-val">0</span>
                      <span className="bnb-stat-lbl">No of Books currently borrowed</span>
                    </div>
                    <div className="bnb-stat">
                      <span className="bnb-stat-val">0</span>
                      <span className="bnb-stat-lbl">Books crossed return date</span>
                    </div>
                  </div>

                  <div className="borrow-no-records-msg">
                    <i className="pi pi-info-circle" />
                    <span>No previous borrowing records found for this person.</span>
                  </div>
                </div>
              )}

              {/* State 3: Empty name / initial state */}
              {!creditScore && borrowerName.trim().length < 2 && (
                <div className="borrow-idle-panel">
                  <div className="bic-icon-wrap">
                    <i className="pi pi-user" />
                  </div>
                  <div className="bic-title">Borrower History</div>
                  <p className="bic-sub">
                    Select a registered borrower or enter borrower name to view Joining date, Contract end date, books issued until now, currently borrowed, and overdue count.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </form>
    </Page>
  );
}
