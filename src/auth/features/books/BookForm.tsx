import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
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
} from 'shared/constants/staticData';

type MainCategory = 'CENTER' | 'REPORT' | 'OTHER';
type ReportType = 'CENTER_REPORT' | 'EXTERNAL_REPORT';
type OtherType = 'MOTIVATIONAL' | 'AUTOBIOGRAPHY';

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Main Classification State
  const [mainCategory, setMainCategory] = useState<MainCategory>('CENTER');
  const [reportType, setReportType] = useState<ReportType>('CENTER_REPORT');
  const [otherType, setOtherType] = useState<OtherType>('MOTIVATIONAL');

  // Shared & Specific Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publication, setPublication] = useState('');
  const [department, setDepartment] = useState('');
  const [advisor, setAdvisor] = useState(CENTERS[0]?.advisorName ?? '');
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [numberOfCopies, setNumberOfCopies] = useState<number | null>(1);
  const [centerId, setCenterId] = useState<number | null>(1);
  const [shelfLocation, setShelfLocation] = useState('');
  const [isbn, setIsbn] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

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
        } else if (book.categoryType === 'MOTIVATIONAL') {
          setMainCategory('OTHER');
          setOtherType('MOTIVATIONAL');
        } else if (book.categoryType === 'AUTOBIOGRAPHY') {
          setMainCategory('OTHER');
          setOtherType('AUTOBIOGRAPHY');
        }
      }
    }
  }, [id, isEditMode]);

  // Main Category Options with icons matching Screenshot 1
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
  ];

  // Report Sub-Type Options (per user specification)
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

  // Other Sub-Type Options (exact options from user screenshot)
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

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = mainCategory === 'REPORT' ? 'Report / Project title is required' : 'Book title is required';
    }

    if (!year || year < 1800 || year > 2099) {
      errs.year = 'Enter a valid 4-digit year';
    }

    if (!numberOfCopies || numberOfCopies < 1) {
      errs.numberOfCopies = 'Copies must be at least 1';
    }

    // Specific validation based on selected category & type
    if (mainCategory === 'CENTER') {
      if (!centerId) errs.centerId = 'Please select an AIGGPA Center';
      if (!author.trim()) errs.author = 'Author name is required';
      if (!publication.trim()) errs.publication = 'Publication is required';
    } else if (mainCategory === 'REPORT') {
      if (reportType === 'CENTER_REPORT') {
        if (!centerId) errs.centerId = 'Please select an AIGGPA Center';
        if (!advisor.trim()) errs.advisor = 'Center Advisor name is required';
      } else {
        if (!department.trim()) errs.department = 'External Department / Organization name is required';
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

        // Also add to STATIC_AIGGPA_REPORTS
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

        // Also add to STATIC_GENERAL_REPORTS
        STATIC_GENERAL_REPORTS.unshift({
          reportId: Date.now(),
          title: title.trim(),
          year: year!,
          numberOfCopies: numberOfCopies || 1,
          availableCopies: numberOfCopies || 1,
          author: department.trim(),
          publisher: department.trim(),
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
      author: mainCategory === 'REPORT' ? (reportType === 'CENTER_REPORT' ? advisor : department) : author.trim(),
      publication: mainCategory === 'REPORT' ? (reportType === 'CENTER_REPORT' ? 'AIGGPA Research Center' : department) : publication.trim(),
      year: year!,
      numberOfCopies: numberOfCopies || 1,
      availableCopies: numberOfCopies || 1,
      categoryId: targetCategoryId,
      categoryName: targetCategoryName,
      categoryType: targetCategoryType,
      centerId: (mainCategory === 'CENTER' || (mainCategory === 'REPORT' && reportType === 'CENTER_REPORT')) ? centerId : null,
      centerName: (mainCategory === 'CENTER' || (mainCategory === 'REPORT' && reportType === 'CENTER_REPORT')) ? selectedCenter?.name : undefined,
      advisor: mainCategory === 'REPORT' && reportType === 'CENTER_REPORT' ? advisor : undefined,
      department: mainCategory === 'REPORT' && reportType === 'EXTERNAL_REPORT' ? department : undefined,
      shelfLocation: shelfLocation.trim() || undefined,
      isbn: isbn.trim() || undefined,
      documentUrl: documentUrl.trim() || undefined,
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
    setCenterId(1);
    setShelfLocation('');
    setIsbn('');
    setDocumentUrl('');
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <Page
      header={isEditMode ? 'Edit Catalog Record' : 'Book & Report Registration'}
      subHeader="Accessioning for AIGGPA Centers, Reports, and Collections"
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
              if (val === 'CENTER') {
                if (!centerId) setCenterId(1);
              }
            }}
            required
          />

          {/* Sub-Classification: When Reports & Studies is selected */}
          {mainCategory === 'REPORT' && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1.1rem 1.25rem',
                backgroundColor: 'var(--theme-subtle-bg, #fff7ed)',
                border: '1.5px solid var(--theme-subtle-border, #fed7aa)',
                borderRadius: '10px',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--theme-text-accent, #c2410c)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
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

          {/* Sub-Classification: When Other Collections is selected (Motivational & Auto-Biographies) */}
          {mainCategory === 'OTHER' && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1.1rem 1.25rem',
                backgroundColor: 'var(--theme-subtle-bg, #eff6ff)',
                border: '1.5px solid var(--theme-subtle-border, #bfdbfe)',
                borderRadius: '10px',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--theme-text-accent, #1d4ed8)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
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
        </Card>

        {/* Record Details */}
        <Card title={mainCategory === 'REPORT' ? 'Report Details' : 'Book Details'}>
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
            </InputPanel>
          )}

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

            {(mainCategory === 'CENTER' || mainCategory === 'OTHER') && (
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
