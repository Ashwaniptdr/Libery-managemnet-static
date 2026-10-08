import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Dialog } from 'primereact/dialog';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import DatePicker from 'shared/components/forms/DatePicker';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import RadioButtonList from 'shared/components/forms/RadioButtonList';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { CENTERS } from 'shared/constants/centers';
import {
  STATIC_BOOKS,
  STATIC_AIGGPA_REPORTS,
  STATIC_GENERAL_REPORTS,
  STATIC_NEWSPAPERS,
  STATIC_MAGAZINES,
} from 'shared/constants/staticData';
import './BookForm.css';

const getAllPeriodicals = (): Library.NewspaperItem[] => [
  ...STATIC_NEWSPAPERS,
  ...STATIC_MAGAZINES,
];

type MainCategory = 'CENTER' | 'REPORT' | 'OTHER' | 'NEWSPAPER';
type ReportType = 'CENTER_REPORT' | 'EXTERNAL_REPORT';
type OtherType = 'MOTIVATIONAL' | 'AUTOBIOGRAPHY';

const GENERAL_REPORT_CATEGORIES = [
  { id: 'Agriculture', name: 'Agriculture' },
  { id: 'Finance', name: 'Finance' },
  { id: 'Technical', name: 'Technical' },
  { id: 'Research', name: 'Research' },
  { id: 'Medical', name: 'Medical' },
  { id: 'Other', name: 'Other' },
];

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getDayOfWeek(year: number, monthIndex: number, day: number): string {
  const d = new Date(year, monthIndex, day);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function getFullDayOfWeek(year: number, monthIndex: number, day: number): string {
  const d = new Date(year, monthIndex, day);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

function isSubscriptionActive(from: string, to: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return today >= from && today <= to;
}

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Today reference
  const today = new Date();

  // Main Classification State
  const [mainCategory, setMainCategory] = useState<MainCategory>('CENTER');
  const [reportType, setReportType] = useState<ReportType>('CENTER_REPORT');
  const [otherType, setOtherType] = useState<OtherType>('MOTIVATIONAL');
  const [publicationType, setPublicationType] = useState<Library.PublicationType>('NEWSPAPER');
  const [selectedNewspaperId, setSelectedNewspaperId] = useState<number | null>(1);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);

  // Month & Year state for Periodicals / Newspapers
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());

  // Received attendance tracker map: `${npId}-${year}-${month}` => array of day numbers
  const [receivedDaysState, setReceivedDaysState] = useState<Record<string, number[]>>({});

  // Shared & Specific Form Fields for Books / Reports
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publication, setPublication] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [advisor, setAdvisor] = useState(CENTERS[0]?.advisorName ?? '');
  const [year, setYear] = useState<number | null>(today.getFullYear());
  const [numberOfCopies, setNumberOfCopies] = useState<number | null>(1);
  const [centerId, setCenterId] = useState<number | null>(1);
  const [shelfLocation, setShelfLocation] = useState('');
  const [isbn, setIsbn] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [magazineTopic, setMagazineTopic] = useState('');
  const [magazineEdition, setMagazineEdition] = useState('');

  // Center Books enhancements (Multiple Authors, Edition, Book Sub Title)
  const [subTitle, setSubTitle] = useState('');
  const [edition, setEdition] = useState('');
  const [authors, setAuthors] = useState<string[]>(['Dr. Amitabh Srivastava']);
  const [authorInput, setAuthorInput] = useState('');

  // General/External Reports enhancements (Category dropdown & Sub Category text field)
  const [generalCategory, setGeneralCategory] = useState('Research');
  const [generalSubCategory, setGeneralSubCategory] = useState('');

  // Transaction fields for Magazines & Newspapers (Edition, Subject/Topic, Received by, Receive date)
  const [periodicalEdition, setPeriodicalEdition] = useState('');
  const [subjectTopic, setSubjectTopic] = useState('');
  const [receivedBy, setReceivedBy] = useState('Central Library Desk');
  const [receiveDate, setReceiveDate] = useState<Date | null>(today);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Multiple authors helper handlers
  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      if (!authors.includes(authorInput.trim())) {
        const next = [...authors, authorInput.trim()];
        setAuthors(next);
        setAuthor(next.join(', '));
      }
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (idxToRemove: number) => {
    const next = authors.filter((_, idx) => idx !== idxToRemove);
    setAuthors(next);
    setAuthor(next.join(', '));
  };

  // Helper to determine if a date is strictly in the future
  const checkIsFuture = (y: number, m: number, d: number): boolean => {
    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    if (y > todayY) return true;
    if (y === todayY && m > todayM) return true;
    if (y === todayY && m === todayM && d > todayD) return true;
    return false;
  };

  const getKey = (npId: number, y: number, m: number) => `${npId}-${y}-${m}`;

  // Get currently marked received days for a given paper, year and month
  const getReceivedDays = (npId: number, y: number, m: number): number[] => {
    const key = getKey(npId, y, m);
    if (receivedDaysState[key] !== undefined) {
      return receivedDaysState[key];
    }
    // Default initialization: all past days up to today are marked as received
    const maxDays = getDaysInMonth(y, m);
    const isCurrentY = today.getFullYear() === y;
    const isCurrentM = today.getMonth() === m;
    const isPastY = y < today.getFullYear();
    const isPastM = isPastY || (isCurrentY && m < today.getMonth());

    let limit = 0;
    if (isPastY || isPastM) {
      limit = maxDays;
    } else if (isCurrentY && isCurrentM) {
      limit = today.getDate();
    }
    const defaultReceived: number[] = [];
    for (let i = 1; i <= limit; i++) {
      defaultReceived.push(i);
    }
    return defaultReceived;
  };

  // Toggle day received vs missed (future dates are disabled)
  const handleToggleDay = (dayNum: number) => {
    if (!selectedNewspaperId) return;
    if (checkIsFuture(selectedYear, selectedMonth, dayNum)) return; // Future dates are disabled!

    const currentList = getReceivedDays(selectedNewspaperId, selectedYear, selectedMonth);
    const isAlreadyReceived = currentList.includes(dayNum);

    const updated = isAlreadyReceived
      ? currentList.filter(d => d !== dayNum)
      : [...currentList, dayNum].sort((a, b) => a - b);

    const key = getKey(selectedNewspaperId, selectedYear, selectedMonth);
    setReceivedDaysState(prev => ({
      ...prev,
      [key]: updated,
    }));
  };

  // Mark all past days as received
  const handleMarkAllPast = () => {
    if (!selectedNewspaperId) return;
    const maxDays = getDaysInMonth(selectedYear, selectedMonth);
    const isCurrentY = today.getFullYear() === selectedYear;
    const isCurrentM = today.getMonth() === selectedMonth;
    const isPastY = selectedYear < today.getFullYear();
    const isPastM = isPastY || (isCurrentY && selectedMonth < today.getMonth());

    let limit = 0;
    if (isPastY || isPastM) {
      limit = maxDays;
    } else if (isCurrentY && isCurrentM) {
      limit = today.getDate();
    }
    const allPast: number[] = [];
    for (let i = 1; i <= limit; i++) {
      allPast.push(i);
    }
    const key = getKey(selectedNewspaperId, selectedYear, selectedMonth);
    setReceivedDaysState(prev => ({
      ...prev,
      [key]: allPast,
    }));
  };

  // Clear all marked days for current month
  const handleClearMonth = () => {
    if (!selectedNewspaperId) return;
    const key = getKey(selectedNewspaperId, selectedYear, selectedMonth);
    setReceivedDaysState(prev => ({
      ...prev,
      [key]: [],
    }));
  };

  // Year adjustments
  const handleYearChange = (delta: number) => {
    const newY = selectedYear + delta;
    setSelectedYear(newY);
    setYear(newY);
  };

  // Month adjustments
  const handleMonthChange = (mIndex: number) => {
    setSelectedMonth(mIndex);
  };

  // Filter active subscriptions strictly by chosen publicationType (Newspaper vs Magazine)
  const activeSubscriptionsForType = getAllPeriodicals().filter(n => {
    return (
      n.publicationType === publicationType &&
      n.isActive &&
      isSubscriptionActive(n.subscriptionFrom, n.subscriptionTo)
    );
  });

  // When publication type changes (Newspaper <-> Magazine)
  const handlePublicationTypeChange = (newType: Library.PublicationType) => {
    setPublicationType(newType);
    const matches = getAllPeriodicals().filter(
      n =>
        n.publicationType === newType &&
        n.isActive &&
        isSubscriptionActive(n.subscriptionFrom, n.subscriptionTo)
    );
    setSelectedNewspaperId(matches[0]?.newspaperId ?? null);
    setShelfLocation(
      newType === 'NEWSPAPER'
        ? 'Newspaper Reading Stand / Rack N-1'
        : 'Periodicals & Magazines Rack M-2'
    );
    setErrors({});
  };

  // On card click (select newspaper / magazine)
  const handleSelectCard = (np: Library.NewspaperItem) => {
    setSelectedNewspaperId(np.newspaperId);
    setShelfLocation(
      np.publicationType === 'NEWSPAPER'
        ? 'Newspaper Reading Stand / Rack N-1'
        : 'Periodicals & Magazines Rack M-2'
    );
    setTitle(`${np.name} - ${FULL_MONTH_NAMES[selectedMonth]} ${selectedYear} Accession Register`);
    setAuthor(np.publisher);
    setPublication(np.publisher);
    setYear(selectedYear);
  };

  // Handle center selection auto-updating advisor for Center Reports
  const handleCenterChange = (selectedCenterId: number | null) => {
    setCenterId(selectedCenterId);
    if (selectedCenterId) {
      const foundCenter = CENTERS.find(c => c.centerId === selectedCenterId);
      if (foundCenter?.advisorName) {
        setAdvisor(foundCenter.advisorName);
      }
    }
  };

  // Populate data when editing
  useEffect(() => {
    if (isEditMode && id) {
      const book = STATIC_BOOKS.find(b => b.bookId === Number(id));
      if (book) {
        setTitle(book.title);
        setAuthor(book.author || '');
        setPublication(book.publication || '');
        setDepartment(book.department || '');
        setAdvisor(book.advisor || '');
        setYear(book.year);
        setNumberOfCopies(book.numberOfCopies);
        setShelfLocation(book.shelfLocation ?? '');
        setIsbn(book.isbn ?? '');
        setDocumentUrl(book.documentUrl ?? '');
        setSubCategory(book.subCategory ?? '');

        setSubTitle(book.subTitle ?? '');
        setEdition(book.edition ?? '');
        if (book.authors && book.authors.length > 0) {
          setAuthors(book.authors);
        } else if (book.author) {
          setAuthors([book.author]);
        }
        setGeneralCategory(book.generalCategory ?? 'Research');
        setGeneralSubCategory(book.generalSubCategory ?? '');
        setPeriodicalEdition(book.edition ?? '');
        setSubjectTopic(book.subjectTopic ?? book.subCategory ?? '');
        setReceivedBy(book.receivedBy ?? 'Central Library Desk');
        setReceiveDate(book.receiveDate ? new Date(book.receiveDate) : today);

        if (book.categoryType === 'CENTER') {
          setMainCategory('CENTER');
          setCenterId(book.centerId ?? 1);
        } else if (book.categoryType === 'AIGGPA_REPORT') {
          setMainCategory('REPORT');
          setReportType('CENTER_REPORT');
          setCenterId(book.centerId ?? 1);
          setAdvisor(book.advisor ?? CENTERS[0]?.advisorName ?? '');
        } else if (book.categoryType === 'GENERAL_REPORT') {
          setMainCategory('REPORT');
          setReportType('EXTERNAL_REPORT');
          setDepartment(book.department || book.author || '');
          setGeneralCategory(book.generalCategory ?? 'Research');
          setGeneralSubCategory(book.generalSubCategory ?? '');
        } else if (book.categoryType === 'MOTIVATIONAL') {
          setMainCategory('OTHER');
          setOtherType('MOTIVATIONAL');
        } else if (book.categoryType === 'AUTOBIOGRAPHY') {
          setMainCategory('OTHER');
          setOtherType('AUTOBIOGRAPHY');
        } else if (book.categoryType === 'NEWSPAPER') {
          setMainCategory('NEWSPAPER');
        }
      }
    }
  }, [id, isEditMode]);

  // Main Category Options matching Screenshot 1
  const mainCategoryOptions = [
    {
      label: 'Centers Collection (9 Centers)',
      value: 'CENTER',
      icon: 'pi pi-book',
    },
    {
      label: 'Reports & Studies',
      value: 'REPORT',
      icon: 'pi pi-file-pdf',
    },
    {
      label: 'Other Collections (Motivational & Bio)',
      value: 'OTHER',
      icon: 'pi pi-bookmark',
    },
    {
      label: 'Newspapers & Magazines',
      value: 'NEWSPAPER',
      icon: 'pi pi-calendar',
    },
  ];

  // Report Sub-Type Options
  const reportSubOptions = [
    {
      label: 'Center Report',
      value: 'CENTER_REPORT',
      icon: 'pi pi-chart-bar',
    },
    {
      label: 'External Department Report',
      value: 'EXTERNAL_REPORT',
      icon: 'pi pi-building',
    },
  ];

  // Other Sub-Type Options matching Screenshot 4
  const otherSubOptions = [
    {
      label: 'Motivational Books',
      value: 'MOTIVATIONAL',
      icon: 'pi pi-star',
    },
    {
      label: 'Auto-Biographies & Biographies',
      value: 'AUTOBIOGRAPHY',
      icon: 'pi pi-user',
    },
  ];

  // Publication Type Options matching Screenshot 4 style
  const publicationTypeOptions = [
    {
      label: 'Newspaper',
      value: 'NEWSPAPER',
      icon: 'pi pi-calendar',
    },
    {
      label: 'Magazine',
      value: 'MAGAZINE',
      icon: 'pi pi-bookmark',
    },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (mainCategory === 'NEWSPAPER') {
      if (!selectedNewspaperId) {
        errs.selectedNewspaperId = `Please select a ${
          publicationType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine'
        } card`;
      }
      return Object.keys(errs).length === 0;
    }

    if (!title.trim()) {
      errs.title =
        mainCategory === 'REPORT' ? 'Report / Project title is required' : 'Book title is required';
    }

    if (!year || year < 1800 || year > 2099) {
      errs.year = 'Enter a valid 4-digit year';
    }

    if (!numberOfCopies || numberOfCopies < 1) {
      errs.numberOfCopies = 'Copies must be at least 1';
    }

    if (mainCategory === 'CENTER') {
      if (!centerId) errs.centerId = 'Please select an AIGGPA Center';
      if (authors.length === 0 && !author.trim()) errs.author = 'At least one author name is required';
      if (!publication.trim()) errs.publication = 'Publication is required';
    } else if (mainCategory === 'REPORT') {
      if (reportType === 'CENTER_REPORT') {
        if (!centerId) errs.centerId = 'Please select an AIGGPA Center';
        if (!advisor.trim()) errs.advisor = 'Center Advisor name is required';
      } else {
        if (!department.trim())
          errs.department = 'External Department / Organization name is required';
        if (!generalCategory.trim())
          errs.generalCategory = 'Category is required';
      }
    } else if (mainCategory === 'OTHER') {
      if (!author.trim()) errs.author = 'Author name is required';
      if (!publication.trim()) errs.publication = 'Publication is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Handle Newspaper / Periodicals registration
    if (mainCategory === 'NEWSPAPER') {
      const selectedNp = getAllPeriodicals().find(n => n.newspaperId === selectedNewspaperId);
      const receivedDays = getReceivedDays(selectedNewspaperId!, selectedYear, selectedMonth);

      let recordTitle = '';
      if (publicationType === 'MAGAZINE') {
        const parts = [selectedNp?.name || 'Magazine'];
        if (periodicalEdition.trim()) parts.push(periodicalEdition.trim());
        else if (magazineEdition.trim()) parts.push(magazineEdition.trim());
        parts.push(`${FULL_MONTH_NAMES[selectedMonth]} ${selectedYear}`);
        if (subjectTopic.trim()) parts.push(`(${subjectTopic.trim()})`);
        else if (magazineTopic.trim()) parts.push(`(${magazineTopic.trim()})`);
        recordTitle = parts.join(' - ');
      } else {
        recordTitle = `${selectedNp?.name || 'Newspaper'} - ${FULL_MONTH_NAMES[selectedMonth]} ${selectedYear} (${receivedDays.length} Issues Received)`;
      }

      const newRecord: Library.BookItem = {
        bookId: Date.now(),
        title: recordTitle,
        author: selectedNp?.publisher || 'Publisher',
        publication: selectedNp?.publisher || 'Publisher',
        edition: periodicalEdition.trim() || undefined,
        subjectTopic: subjectTopic.trim() || undefined,
        receivedBy: receivedBy.trim() || undefined,
        receiveDate: receiveDate ? receiveDate.toISOString().split('T')[0] : undefined,
        year: selectedYear,
        numberOfCopies: numberOfCopies || 1,
        availableCopies: numberOfCopies || 1,
        categoryId: 6,
        categoryName:
          publicationType === 'NEWSPAPER'
            ? 'Daily Newspapers (Central Library)'
            : 'Periodicals & Magazines (Central Library)',
        categoryType: 'NEWSPAPER',
        subCategory: publicationType === 'MAGAZINE' ? (subjectTopic.trim() || magazineTopic.trim() || undefined) : undefined,
        shelfLocation:
          shelfLocation.trim() ||
          (publicationType === 'NEWSPAPER'
            ? 'Newspaper Reading Stand / Rack N-1'
            : 'Periodicals & Magazines Rack M-2'),
        isActive: true,
      };

      STATIC_BOOKS.unshift(newRecord);

      setSuccessMessage(
        `"${recordTitle}" successfully recorded! ${receivedDays.length} issue(s) confirmed received in Central Register.`
      );

      setTimeout(() => {
        navigate('/books');
      }, 1500);
      return;
    }

    let targetCategoryType: Library.BookCategoryType = 'CENTER';
    let targetCategoryName = 'Centers Collection (9 Centers)';
    let targetCategoryId = 1;
    let selectedCenter = centerId ? CENTERS.find(c => c.centerId === centerId) : null;

    if (mainCategory === 'CENTER') {
      targetCategoryType = 'CENTER';
      targetCategoryName = 'Centers Collection (9 Centers)';
      targetCategoryId = 1;
    } else if (mainCategory === 'REPORT') {
      if (reportType === 'CENTER_REPORT') {
        targetCategoryType = 'AIGGPA_REPORT';
        targetCategoryName = 'AIGGPA Center Reports';
        targetCategoryId = 4;

        STATIC_AIGGPA_REPORTS.unshift({
          reportId: Date.now(),
          centerId: centerId!,
          centerName: selectedCenter?.name || 'AIGGPA Center',
          advisor: advisor.trim(),
          projectName: title.trim(),
          year: year!,
          numberOfCopies: numberOfCopies || 1,
          availableCopies: numberOfCopies || 1,
          documentUrl: documentUrl || undefined,
          isActive: true,
        });
      } else {
        targetCategoryType = 'GENERAL_REPORT';
        targetCategoryName = 'External Department Reports';
        targetCategoryId = 5;

        STATIC_GENERAL_REPORTS.unshift({
          reportId: Date.now(),
          title: title.trim(),
          year: year!,
          numberOfCopies: numberOfCopies || 1,
          availableCopies: numberOfCopies || 1,
          author: department.trim(),
          publisher: department.trim(),
          generalCategory: generalCategory,
          generalSubCategory: generalSubCategory.trim() || undefined,
          isActive: true,
        });
      }
    } else if (mainCategory === 'OTHER') {
      if (otherType === 'MOTIVATIONAL') {
        targetCategoryType = 'MOTIVATIONAL';
        targetCategoryName = 'Motivational Books';
        targetCategoryId = 2;
      } else {
        targetCategoryType = 'AUTOBIOGRAPHY';
        targetCategoryName = 'Auto-Biographies & Biographies';
        targetCategoryId = 3;
      }
    }

    const newRecord: Library.BookItem = {
      bookId: isEditMode && id ? Number(id) : Date.now(),
      title: title.trim(),
      subTitle: mainCategory === 'CENTER' ? subTitle.trim() || undefined : undefined,
      edition: mainCategory === 'CENTER' ? edition.trim() || undefined : undefined,
      authors: mainCategory === 'CENTER' && authors.length > 0 ? authors : undefined,
      author:
        mainCategory === 'REPORT'
          ? reportType === 'CENTER_REPORT'
            ? advisor
            : department
          : mainCategory === 'CENTER' && authors.length > 0
          ? authors.join(', ')
          : author.trim(),
      publication:
        mainCategory === 'REPORT'
          ? reportType === 'CENTER_REPORT'
            ? 'AIGGPA Research Center'
            : department
          : publication.trim(),
      year: year!,
      numberOfCopies: numberOfCopies || 1,
      availableCopies: numberOfCopies || 1,
      categoryId: targetCategoryId,
      categoryName: targetCategoryName,
      categoryType: targetCategoryType,
      generalCategory:
        mainCategory === 'REPORT' && reportType === 'EXTERNAL_REPORT' ? generalCategory : undefined,
      generalSubCategory:
        mainCategory === 'REPORT' && reportType === 'EXTERNAL_REPORT'
          ? generalSubCategory.trim() || undefined
          : undefined,
      centerId:
        mainCategory === 'CENTER' || (mainCategory === 'REPORT' && reportType === 'CENTER_REPORT')
          ? centerId
          : null,
      centerName:
        mainCategory === 'CENTER' || (mainCategory === 'REPORT' && reportType === 'CENTER_REPORT')
          ? selectedCenter?.name
          : undefined,
      advisor:
        mainCategory === 'REPORT' && reportType === 'CENTER_REPORT' ? advisor : undefined,
      department:
        mainCategory === 'REPORT' && reportType === 'EXTERNAL_REPORT' ? department : undefined,
      shelfLocation: shelfLocation.trim() || undefined,
      isbn: isbn.trim() || undefined,
      documentUrl: documentUrl.trim() || undefined,
      subCategory: mainCategory === 'OTHER' ? subCategory.trim() || undefined : undefined,
      isActive: true,
    };

    if (isEditMode && id) {
      const idx = STATIC_BOOKS.findIndex(b => b.bookId === Number(id));
      if (idx !== -1) {
        STATIC_BOOKS[idx] = newRecord;
      }
    } else {
      STATIC_BOOKS.unshift(newRecord);
    }

    setSuccessMessage(
      isEditMode
        ? `"${title}" updated successfully in Central Catalog!`
        : `"${title}" registered successfully under ${targetCategoryName}!`
    );

    setTimeout(() => {
      navigate('/books');
    }, 1200);
  };

  const handleReset = () => {
    setTitle('');
    setAuthor('');
    setPublication('');
    setDepartment('');
    setAdvisor(CENTERS[0]?.advisorName ?? '');
    setYear(new Date().getFullYear());
    setNumberOfCopies(1);
    setMainCategory('CENTER');
    setReportType('CENTER_REPORT');
    setOtherType('MOTIVATIONAL');
    setPublicationType('NEWSPAPER');
    setSelectedNewspaperId(1);
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setCenterId(1);
    setShelfLocation('');
    setIsbn('');
    setDocumentUrl('');
    setSubCategory('');
    setMagazineTopic('');
    setMagazineEdition('');
    setSubTitle('');
    setEdition('');
    setAuthors(['Dr. Amitabh Srivastava']);
    setAuthorInput('');
    setGeneralCategory('Research');
    setGeneralSubCategory('');
    setPeriodicalEdition('');
    setSubjectTopic('');
    setReceivedBy('Central Library Desk');
    setReceiveDate(today);
    setErrors({});
    setSuccessMessage('');
  };

  // Selected subscription details helper
  const selectedSubscription = selectedNewspaperId
    ? getAllPeriodicals().find(n => n.newspaperId === selectedNewspaperId)
    : null;

  // Days count for selected month/year
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Stats calculation for the selected month
  const activeReceivedList = selectedNewspaperId
    ? getReceivedDays(selectedNewspaperId, selectedYear, selectedMonth)
    : [];

  let pastDaysCount = 0;
  let futureDaysCount = 0;
  daysArray.forEach(d => {
    if (checkIsFuture(selectedYear, selectedMonth, d)) {
      futureDaysCount++;
    } else {
      pastDaysCount++;
    }
  });

  const receivedCount = activeReceivedList.filter(d => !checkIsFuture(selectedYear, selectedMonth, d)).length;
  const missedCount = pastDaysCount - receivedCount;

  return (
    <Page
      header={isEditMode ? 'Edit Catalog Record' : 'Book & Periodical Accession'}
      subHeader="Accessioning for AIGGPA Centers, Reports, Books and Daily Periodicals Attendance"
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <i className="pi pi-check-circle" /> {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Classification */}
        <Card>
          <RadioButtonList
            name="mainCategory"
            options={mainCategoryOptions}
            value={mainCategory}
            variant="pill"
            onChange={val => {
              setMainCategory(val as MainCategory);
              setErrors({});
              if (val === 'CENTER' && !centerId) {
                setCenterId(1);
              }
              if (val === 'NEWSPAPER') {
                const active = getAllPeriodicals().filter(
                  n =>
                    n.publicationType === publicationType &&
                    n.isActive &&
                    isSubscriptionActive(n.subscriptionFrom, n.subscriptionTo)
                );
                setSelectedNewspaperId(active[0]?.newspaperId ?? null);
              }
            }}
            required
          />

          {/* Sub-Classification: When Reports & Studies is selected */}
          {mainCategory === 'REPORT' && (
            <div className="periodical-sub-card">
              <div className="periodical-sub-title">
                <i className="pi pi-file-pdf" style={{ fontSize: '1.05rem' }} />
                Report Type
              </div>
              <RadioButtonList
                name="reportType"
                options={reportSubOptions}
                value={reportType}
                variant="pill"
                onChange={val => {
                  setReportType(val as ReportType);
                  setErrors({});
                }}
                required
              />
            </div>
          )}

          {/* Sub-Classification: When Other Collections is selected (Screenshot 4) */}
          {mainCategory === 'OTHER' && (
            <div
              className="periodical-sub-card"
              style={{
                backgroundColor: 'var(--theme-subtle-bg, #eff6ff)',
                borderColor: 'var(--theme-subtle-border, #bfdbfe)',
              }}
            >
              <div
                className="periodical-sub-title"
                style={{ color: 'var(--theme-text-accent, #1d4ed8)' }}
              >
                <i className="pi pi-bookmark" style={{ fontSize: '1.05rem' }} />
                Collection Category
              </div>
              <RadioButtonList
                name="otherType"
                options={otherSubOptions}
                value={otherType}
                variant="pill"
                onChange={val => setOtherType(val as OtherType)}
                required
              />
            </div>
          )}

          {/* Sub-Classification: When Newspapers & Magazines is selected (Screenshot 4 style) */}
          {mainCategory === 'NEWSPAPER' && (
            <div className="periodical-sub-card">
              <div className="periodical-sub-title">
                <i className="pi pi-calendar" style={{ fontSize: '1.05rem' }} />
                Publication Type
              </div>
              <RadioButtonList
                name="publicationType"
                options={publicationTypeOptions}
                value={publicationType}
                variant="pill"
                onChange={val => handlePublicationTypeChange(val as Library.PublicationType)}
                required
              />
            </div>
          )}
        </Card>

        {/* ─── CASE A: NEWSPAPERS & MAGAZINES (Clean Cards + Pop-up Attendance Dialog) ─── */}
        {mainCategory === 'NEWSPAPER' && (
          <Card
            title={
              publicationType === 'NEWSPAPER'
                ? '📰 Select Newspaper & Accession Details'
                : '📖 Select Magazine & Accession Details'
            }
          >
            {/* Step 1: Small Cards Grid for all active Newspapers / Magazines */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary, #64748b)',
                  marginBottom: '0.5rem',
                }}
              >
                Available Active {publicationType === 'NEWSPAPER' ? 'Newspapers' : 'Magazines'} ({activeSubscriptionsForType.length}):
              </div>

              <div className="periodical-card-grid">
                {activeSubscriptionsForType.map(item => {
                  const isSelected = selectedNewspaperId === item.newspaperId;
                  const itemReceived = getReceivedDays(item.newspaperId, selectedYear, selectedMonth);
                  return (
                    <div
                      key={item.newspaperId}
                      className={`periodical-card-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectCard(item)}
                    >
                      <div className="periodical-card-header">
                        <div className="periodical-card-icon-wrap">
                          {item.publicationType === 'NEWSPAPER' ? '📰' : '📖'}
                        </div>
                        <span className="periodical-card-badge">
                          <i className="pi pi-check-circle" /> Active
                        </span>
                      </div>

                      <div className="periodical-card-title">{item.name}</div>

                      <div className="periodical-card-meta">
                        <span><strong>Pub:</strong> {item.publisher}</span>
                        <span><strong>Lang:</strong> {item.language || 'Hindi / English'} &bull; {item.frequency || 'Daily'}</span>
                        <span><strong>Valid:</strong> {item.subscriptionFrom} to {item.subscriptionTo}</span>
                      </div>

                      <div className="periodical-card-footer">
                        <div className="periodical-footer-info">
                          <span>
                            {itemReceived.length} Days in {MONTH_NAMES[selectedMonth]}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="periodical-card-attendance-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCard(item);
                            setShowAttendanceDialog(true);
                          }}
                          title="Open Daily Receipt Attendance Modal"
                        >
                          <i className="pi pi-calendar" /> Attendance
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeSubscriptionsForType.length === 0 && (
                <div
                  style={{
                    color: 'var(--danger-color, #b91c1c)',
                    padding: '1rem',
                    background: 'var(--danger-bg, #fee2e2)',
                    borderRadius: '10px',
                    fontWeight: 600,
                  }}
                >
                  <i className="pi pi-exclamation-triangle" /> No active{' '}
                  {publicationType === 'NEWSPAPER' ? 'newspapers' : 'magazines'} found for current
                  date. Add or renew subscriptions in{' '}
                  <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => navigate('/masters/newspapers')}
                  >
                    Newspapers &amp; Magazines Master
                  </span>
                  .
                </div>
              )}
            </div>

            {/* Step 2: Sleek Selected Subscription Strip with prominent Dialog Trigger */}
            {selectedSubscription && (
              <div className="periodical-selected-summary-strip">
                <div className="pss-left">
                  <div className="pss-icon-wrap">
                    {selectedSubscription.publicationType === 'NEWSPAPER' ? '📰' : '📖'}
                  </div>
                  <div className="pss-details">
                    <div className="pss-title-row">
                      <span className="pss-name">{selectedSubscription.name}</span>
                      <span className="pss-active-pill">
                        <i className="pi pi-check-circle" /> Active Subscription ({selectedSubscription.subscriptionFrom} to {selectedSubscription.subscriptionTo})
                      </span>
                    </div>
                    <div className="pss-meta-row">
                      <span><strong>Publisher:</strong> {selectedSubscription.publisher}</span>
                      <span>&bull;</span>
                      <span><strong>Language:</strong> {selectedSubscription.language || 'Hindi / English'}</span>
                      <span>&bull;</span>
                      <span><strong>Frequency:</strong> {selectedSubscription.frequency || 'Daily'}</span>
                    </div>
                  </div>
                </div>

                <div className="pss-right">
                  <div className="pss-status-stat">
                    <span className="pss-stat-val">{receivedCount} / {pastDaysCount}</span>
                    <span className="pss-stat-lbl">Days Arrived ({MONTH_NAMES[selectedMonth]} {selectedYear})</span>
                  </div>
                  <button
                    type="button"
                    className="pss-open-btn"
                    onClick={() => setShowAttendanceDialog(true)}
                  >
                    <i className="pi pi-calendar-plus" />
                    Open Daily Attendance Dialog
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Transaction page fields for both Magazines & Newspapers */}
            {selectedSubscription && (
              <InputPanel orientation="horizontal">
                <TextBox
                  name="periodicalEdition"
                  label="Edition / Issue No."
                  value={periodicalEdition}
                  onChange={val => setPeriodicalEdition(val)}
                  placeholder={
                    publicationType === 'NEWSPAPER'
                      ? 'e.g. Morning City Edition / Sunday Special'
                      : 'e.g. Vol. 18 Issue 10, Special Edition'
                  }
                />

                <TextBox
                  name="subjectTopic"
                  label="Subject / Topic / Theme"
                  value={subjectTopic}
                  onChange={val => setSubjectTopic(val)}
                  placeholder={
                    publicationType === 'NEWSPAPER'
                      ? 'e.g. Headline News / State Governance'
                      : 'e.g. Union Budget 2026, AI Governance'
                  }
                />

                <TextBox
                  name="receivedBy"
                  label="Received By (Staff / Officer)"
                  value={receivedBy}
                  onChange={val => setReceivedBy(val)}
                  placeholder="e.g. Ramesh Kumar (Library Attendant)"
                />

                <DatePicker
                  name="receiveDate"
                  label="Receive Date"
                  value={receiveDate}
                  onChange={val => setReceiveDate(val)}
                />
              </InputPanel>
            )}

            {/* Step 4: Accession Parameters (Copies, Shelf, ISSN) */}
            {selectedSubscription && (
              <InputPanel orientation="horizontal">
                <NumberBox
                  name="numberOfCopies"
                  label="Copies Received per Issue"
                  value={numberOfCopies}
                  onChange={val => setNumberOfCopies(val)}
                  min={1}
                  required
                />

                <TextBox
                  name="shelfLocation"
                  label={
                    publicationType === 'NEWSPAPER'
                      ? 'Reading Stand / Shelf Location'
                      : 'Magazine Rack / Shelf Location'
                  }
                  value={shelfLocation}
                  onChange={val => setShelfLocation(val)}
                  placeholder={
                    publicationType === 'NEWSPAPER'
                      ? 'Newspaper Reading Stand / Rack N-1'
                      : 'Periodicals & Magazines Rack M-2'
                  }
                />

                <TextBox
                  name="isbn"
                  label="ISSN / Periodical Code (Optional)"
                  value={isbn}
                  onChange={val => setIsbn(val)}
                  placeholder="e.g. ISSN 0971-751X"
                />
              </InputPanel>
            )}

            {/* ─── POP-UP MODAL DIALOG: Daily Receipt Attendance (Horizontal Months & Vertical Dates) ─── */}
            <Dialog
              visible={showAttendanceDialog}
              onHide={() => setShowAttendanceDialog(false)}
              header={
                <div className="attendance-dialog-header">
                  <div className="adh-left">
                    <span className="adh-icon">
                      {selectedSubscription?.publicationType === 'NEWSPAPER' ? '📰' : '📖'}
                    </span>
                    <div>
                      <div className="adh-title">
                        {selectedSubscription?.name} &bull; Daily Receipt Attendance
                      </div>
                      <div className="adh-sub">
                        {selectedSubscription?.publisher} &bull; {selectedSubscription?.frequency || 'Daily'} &bull; Subscription: {selectedSubscription?.subscriptionFrom} to {selectedSubscription?.subscriptionTo}
                      </div>
                    </div>
                  </div>
                  <span className="adh-badge">
                    {receivedCount} of {pastDaysCount} Arrived in {MONTH_NAMES[selectedMonth]} {selectedYear}
                  </span>
                </div>
              }
              style={{ width: '920px', maxWidth: '96vw' }}
              className="attendance-dialog"
              modal
            >
              {selectedSubscription && (
                <div className="attendance-dialog-body">
                  {/* Top Bar: Year Control & Quick Mark Actions */}
                  <div className="attendance-controls-bar">
                    <div className="periodical-year-control">
                      <button
                        type="button"
                        className="periodical-year-btn"
                        onClick={() => handleYearChange(-1)}
                        title="Previous Year"
                      >
                        <i className="pi pi-chevron-left" />
                      </button>
                      <span className="periodical-year-text">{selectedYear}</span>
                      <button
                        type="button"
                        className="periodical-year-btn"
                        onClick={() => handleYearChange(1)}
                        title="Next Year"
                      >
                        <i className="pi pi-chevron-right" />
                      </button>
                    </div>

                    <div className="attendance-quick-actions">
                      <button
                        type="button"
                        className="attendance-quick-btn"
                        onClick={handleMarkAllPast}
                        title="Mark all past days as received"
                      >
                        <i className="pi pi-check-circle" style={{ color: 'var(--success-color)' }} />
                        Mark All Past as Received
                      </button>
                      <button
                        type="button"
                        className="attendance-quick-btn"
                        onClick={handleClearMonth}
                        title="Reset current month"
                      >
                        <i className="pi pi-refresh" />
                        Reset Month
                      </button>
                    </div>
                  </div>

                  {/* Axis 1: Horizontal Scrollable Month Bar */}
                  <div className="periodical-months-bar">
                    {MONTH_NAMES.map((mName, mIdx) => {
                      const mDays = getReceivedDays(selectedSubscription.newspaperId, selectedYear, mIdx);
                      return (
                        <button
                          key={mName}
                          type="button"
                          className={`periodical-month-pill ${selectedMonth === mIdx ? 'active' : ''}`}
                          onClick={() => handleMonthChange(mIdx)}
                        >
                          <span>{mName}</span>
                          {mDays.length > 0 && <span className="month-pill-badge">{mDays.length}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Axis 2: Vertically Managed Date Grid with Day (Date with Day: 1 THU, 2 FRI...) */}
                  <div className="attendance-days-scroll-container">
                    <div className="attendance-days-grid">
                      {daysArray.map(dayNum => {
                        const isFuture = checkIsFuture(selectedYear, selectedMonth, dayNum);
                        const isReceived = !isFuture && activeReceivedList.includes(dayNum);
                        const isMissed = !isFuture && !isReceived;
                        const isToday =
                          today.getFullYear() === selectedYear &&
                          today.getMonth() === selectedMonth &&
                          today.getDate() === dayNum;
                        const dayName = getDayOfWeek(selectedYear, selectedMonth, dayNum);

                        let stateClass = 'missed';
                        if (isFuture) stateClass = 'future';
                        else if (isReceived) stateClass = 'received';

                        return (
                          <div
                            key={dayNum}
                            className={`attendance-day-card ${stateClass} ${isToday ? 'today-ring' : ''}`}
                            onClick={() => handleToggleDay(dayNum)}
                            title={
                              isFuture
                                ? `Day ${dayNum}: Future date (Disabled)`
                                : isReceived
                                ? `Day ${dayNum} (${dayName}): Arrived ✅ (Click to mark missed)`
                                : `Day ${dayNum} (${dayName}): Missed ⚠️ (Click to mark arrived)`
                            }
                          >
                            <span className="day-num">{dayNum}</span>
                            <span className="day-name">{dayName}</span>
                            <span className="day-status-icon">
                              {isFuture ? '🔒' : isReceived ? '✅' : '⚠️'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dialog Footer: Legend, Stats & Done Button */}
                  <div className="attendance-dialog-footer">
                    <div className="attendance-legend">
                      <div className="legend-item">
                        <span className="legend-dot received" />
                        <span>Arrived &amp; Received ({receivedCount})</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot missed" />
                        <span>Missed / Not Delivered ({missedCount})</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot future" />
                        <span>Future Dates (Disabled - {futureDaysCount})</span>
                      </div>
                    </div>

                    <div className="attendance-stats-summary">
                      <span>Delivery Rate: <strong>{pastDaysCount > 0 ? Math.round((receivedCount / pastDaysCount) * 100) : 0}%</strong></span>
                      <Button
                        type="button"
                        variant="primary"
                        label="Done & Apply"
                        icon="check"
                        onClick={() => setShowAttendanceDialog(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Dialog>
          </Card>
        )}

        {/* ─── CASE B: BOOKS & RESEARCH REPORTS ─── */}
        {mainCategory !== 'NEWSPAPER' && (
          <Card title={mainCategory === 'REPORT' ? 'Report Details' : 'Book Details'}>
            {mainCategory === 'OTHER' && (
              <InputPanel orientation="horizontal">
                <TextBox
                  name="subCategory"
                  label="Sub-Category (Optional)"
                  value={subCategory}
                  onChange={val => setSubCategory(val)}
                  placeholder="e.g. Leadership, Civil Service, Science & Innovation"
                />
              </InputPanel>
            )}

            {mainCategory === 'CENTER' && (
              <InputPanel orientation="horizontal">
                <DropDownList
                  name="centerId"
                  label="AIGGPA Center"
                  data={CENTERS}
                  textField="name"
                  valueField="centerId"
                  value={centerId}
                  onChange={handleCenterChange}
                  errorMessage={errors.centerId}
                  required
                />
              </InputPanel>
            )}

            {mainCategory === 'REPORT' && reportType === 'CENTER_REPORT' && (
              <InputPanel orientation="horizontal">
                <DropDownList
                  name="centerId"
                  label="AIGGPA Center"
                  data={CENTERS}
                  textField="name"
                  valueField="centerId"
                  value={centerId}
                  onChange={handleCenterChange}
                  errorMessage={errors.centerId}
                  required
                />

                <TextBox
                  name="advisor"
                  label="Center Advisor / Lead"
                  value={advisor}
                  onChange={val => setAdvisor(val)}
                  placeholder="e.g. Dr. R. K. Sharma"
                  errorMessage={errors.advisor}
                  required
                />
              </InputPanel>
            )}

            {mainCategory === 'REPORT' && reportType === 'EXTERNAL_REPORT' && (
              <InputPanel orientation="horizontal">
                <TextBox
                  name="department"
                  label="External Department / Organization"
                  value={department}
                  onChange={val => setDepartment(val)}
                  placeholder="e.g. Directorate of Economics and Statistics, MP"
                  errorMessage={errors.department}
                  required
                />

                <DropDownList
                  name="generalCategory"
                  label="Category"
                  data={GENERAL_REPORT_CATEGORIES}
                  textField="name"
                  valueField="id"
                  value={generalCategory}
                  onChange={val => setGeneralCategory(val || 'Research')}
                  errorMessage={errors.generalCategory}
                  required
                />

                <TextBox
                  name="generalSubCategory"
                  label="Sub Category"
                  value={generalSubCategory}
                  onChange={val => setGeneralSubCategory(val)}
                  placeholder="e.g. Agricultural Statistics, Clinical Trials, Economic Survey"
                />
              </InputPanel>
            )}

            {/* Inputs Row for Center Books: Title, Sub Title, Edition */}
            {mainCategory === 'CENTER' && (
              <>
                <InputPanel orientation="horizontal">
                  <TextBox
                    name="title"
                    label="Book Title"
                    value={title}
                    onChange={val => setTitle(val)}
                    placeholder="e.g. Good Governance in Public Administration"
                    errorMessage={errors.title}
                    required
                  />

                  <TextBox
                    name="subTitle"
                    label="Book Sub title"
                    value={subTitle}
                    onChange={val => setSubTitle(val)}
                    placeholder="e.g. Framework for Policy Implementation and Monitoring"
                  />

                  <TextBox
                    name="edition"
                    label="Edition"
                    value={edition}
                    onChange={val => setEdition(val)}
                    placeholder="e.g. 2nd Revised Edition"
                  />
                </InputPanel>

                {/* Multiple Authors UI */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Author(s) <span style={{ color: 'var(--danger-color, #dc2626)' }}>*</span>
                  </label>
                  <div className="authors-input-group">
                    <div
                      style={{ flex: 1 }}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAuthor();
                        }
                      }}
                    >
                      <TextBox
                        name="authorInput"
                        value={authorInput}
                        onChange={val => setAuthorInput(val)}
                        placeholder="Type author name and click 'Add Author' or press Enter"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outlined"
                      icon="plus"
                      label="Add Author"
                      onClick={handleAddAuthor}
                    />
                  </div>

                  {authors.length > 0 && (
                    <div className="authors-chips-list">
                      {authors.map((auth, idx) => (
                        <span key={idx} className="author-chip">
                          <i className="pi pi-user" style={{ fontSize: '0.75rem' }} />
                          {auth}
                          <button
                            type="button"
                            className="author-chip-remove"
                            onClick={() => handleRemoveAuthor(idx)}
                            title="Remove author"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.author && (
                    <div style={{ color: 'var(--danger-color, #dc2626)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                      {errors.author}
                    </div>
                  )}
                </div>

                <InputPanel orientation="horizontal">
                  <TextBox
                    name="publication"
                    label="Publication / Publisher"
                    value={publication}
                    onChange={val => setPublication(val)}
                    placeholder="e.g. Oxford University Press / HarperCollins"
                    errorMessage={errors.publication}
                    required
                  />

                  <NumberBox
                    name="year"
                    label="Year of Publication"
                    value={year}
                    onChange={val => setYear(val)}
                    min={1900}
                    max={2099}
                    errorMessage={errors.year}
                    required
                  />
                </InputPanel>
              </>
            )}

            {/* Inputs Row for Reports and Other Collections */}
            {mainCategory !== 'CENTER' && (
              <InputPanel orientation="horizontal">
                <TextBox
                  name="title"
                  label={
                    mainCategory === 'REPORT'
                      ? reportType === 'CENTER_REPORT'
                        ? 'Project / Report Title'
                        : 'Report Title'
                      : 'Book Title'
                  }
                  value={title}
                  onChange={val => setTitle(val)}
                  placeholder={
                    mainCategory === 'REPORT'
                      ? reportType === 'CENTER_REPORT'
                        ? 'e.g. CM Helpline Citizen Satisfaction & Redressal Audit Report'
                        : 'e.g. MP State Economic Survey 2023-24'
                      : 'e.g. Good Governance in Public Administration'
                  }
                  errorMessage={errors.title}
                  required
                />

                {mainCategory === 'OTHER' && (
                  <>
                    <TextBox
                      name="author"
                      label="Author(s)"
                      value={author}
                      onChange={val => setAuthor(val)}
                      placeholder="e.g. Dr. Bimal Jalan / Dr. A.P.J. Abdul Kalam"
                      errorMessage={errors.author}
                      required
                    />

                    <TextBox
                      name="publication"
                      label="Publication / Publisher"
                      value={publication}
                      onChange={val => setPublication(val)}
                      placeholder="e.g. Oxford University Press / HarperCollins"
                      errorMessage={errors.publication}
                      required
                    />
                  </>
                )}

                <NumberBox
                  name="year"
                  label={mainCategory === 'REPORT' ? 'Report Year' : 'Year of Publication'}
                  value={year}
                  onChange={val => setYear(val)}
                  min={1900}
                  max={2099}
                  errorMessage={errors.year}
                  required
                />
              </InputPanel>
            )}

            {/* Inputs Row 2: Copies, Shelf Location, ISBN/Doc */}
            <InputPanel orientation="horizontal">
              <NumberBox
                name="numberOfCopies"
                label="Total Number of Copies"
                value={numberOfCopies}
                onChange={val => setNumberOfCopies(val)}
                min={1}
                errorMessage={errors.numberOfCopies}
                required
              />

              <TextBox
                name="shelfLocation"
                label="Shelf / Rack Location"
                value={shelfLocation}
                onChange={val => setShelfLocation(val)}
                placeholder="e.g. Rack A1-04 or Reports Section R2"
              />

              {mainCategory === 'REPORT' ? (
                <TextBox
                  name="documentUrl"
                  label="Digital Document URL / PDF (Optional)"
                  value={documentUrl}
                  onChange={val => setDocumentUrl(val)}
                  placeholder="/docs/reports/sample-report.pdf"
                />
              ) : (
                <TextBox
                  name="isbn"
                  label="ISBN (Optional)"
                  value={isbn}
                  onChange={val => setIsbn(val)}
                  placeholder="e.g. 978-8129135001"
                />
              )}
            </InputPanel>
          </Card>
        )}

        {/* Buttons */}
        <ButtonPanel align="start">
          <Button
            type="submit"
            variant="primary"
            icon="check"
            label={
              isEditMode
                ? 'Update Record'
                : mainCategory === 'REPORT'
                ? reportType === 'CENTER_REPORT'
                  ? 'Register Center Report'
                  : 'Register External Dept Report'
                : mainCategory === 'NEWSPAPER'
                ? `Save ${publicationType === 'NEWSPAPER' ? 'Newspaper' : 'Magazine'} Receipt Log`
                : 'Register Book'
            }
          />
          <Button
            type="button"
            variant="outlined"
            icon="refresh"
            label="Reset Form"
            onClick={handleReset}
          />
          <Button
            type="button"
            variant="outlined"
            icon="arrow-left"
            label="Back to Registry"
            onClick={() => navigate('/books')}
          />
        </ButtonPanel>
      </form>
    </Page>
  );
}
