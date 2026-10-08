import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { STATIC_GENERAL_REPORTS } from 'shared/constants/staticData';

const GENERAL_CATEGORIES = [
  { id: 'Agriculture', name: 'Agriculture' },
  { id: 'Finance', name: 'Finance' },
  { id: 'Technical', name: 'Technical' },
  { id: 'Research', name: 'Research' },
  { id: 'Medical', name: 'Medical' },
  { id: 'Other', name: 'Other' },
];

export default function GeneralReports() {
  const [reports, setReports] = useState<Library.GeneralReportItem[]>(STATIC_GENERAL_REPORTS);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields per specification:
  // - Title
  // - Category (Agriculture, Finance, Technical, Research, Medical, Other)
  // - Sub Category
  // - Year
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Research');
  const [subCategory, setSubCategory] = useState('');
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState<number | null>(10);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!category.trim()) errs.category = 'Category is required';
    if (!year || year < 1950 || year > 2099) errs.year = 'Enter a valid year';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newReport: Library.GeneralReportItem = {
      reportId: Date.now(),
      title,
      generalCategory: category,
      generalSubCategory: subCategory.trim() || undefined,
      year: year!,
      author: author || 'Government of India / MP',
      publisher: publisher || 'State Government Press',
      numberOfCopies: numberOfCopies ?? 1,
      availableCopies: numberOfCopies ?? 1,
      isActive: true,
    };

    setReports([newReport, ...reports]);
    STATIC_GENERAL_REPORTS.unshift(newReport);
    setSuccessMessage(`General Report "${title}" added successfully!`);
    setShowAddForm(false);
    setTitle('');
    setCategory('Research');
    setSubCategory('');
  };

  const columns: Controls.ColumnProps<Library.GeneralReportItem>[] = [
    { field: 'title', header: 'Report Title', width: '32%', sortable: true },
    {
      field: 'generalCategory',
      header: 'Category',
      width: '15%',
      sortable: true,
      body: row => (
        <span
          style={{
            background: 'var(--theme-subtle-bg, #eff6ff)',
            color: 'var(--theme-primary, #1d4ed8)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.8rem',
          }}
        >
          {row.generalCategory || 'Research'}
        </span>
      ),
    },
    {
      field: 'generalSubCategory',
      header: 'Sub Category',
      width: '18%',
      sortable: true,
      body: row => <span>{row.generalSubCategory || '—'}</span>,
    },
    { field: 'author', header: 'External Dept / Agency', width: '20%', sortable: true },
    { field: 'year', header: 'Year', width: '8%', sortable: true },
    { field: 'numberOfCopies', header: 'Copies', width: '7%', sortable: true },
  ];

  return (
    <Page
      header="External Department Reports (Kisi Bahar ke Department ki Report)"
      subHeader="Accession of outside state surveys, Central Ministry reports & partner departments"
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

      {showAddForm ? (
        <Card
          title="Add New External Department Report"
          onClose={() => setShowAddForm(false)}
        >
          <form onSubmit={handleAddReport}>
            <InputPanel orientation="horizontal">
              <TextBox
                name="title"
                label="Report Title"
                value={title}
                onChange={val => setTitle(val)}
                placeholder="e.g. MP State Economic Survey 2024"
                errorMessage={errors.title}
                required
              />

              <DropDownList
                name="category"
                label="Category"
                data={GENERAL_CATEGORIES}
                textField="name"
                valueField="id"
                value={category}
                onChange={val => setCategory(val || 'Research')}
                errorMessage={errors.category}
                required
              />

              <TextBox
                name="subCategory"
                label="Sub Category"
                value={subCategory}
                onChange={val => setSubCategory(val)}
                placeholder="e.g. State Accounts / Agriculture Survey"
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <TextBox
                name="author"
                label="External Department / Agency Name"
                value={author}
                onChange={val => setAuthor(val)}
                placeholder="e.g. NITI Aayog / Directorate of Economics & Statistics"
              />

              <NumberBox
                name="year"
                label="Report Year"
                value={year}
                onChange={val => setYear(val)}
                min={1950}
                max={2099}
                errorMessage={errors.year}
                required
              />

              <NumberBox
                name="numberOfCopies"
                label="Copies Received"
                value={numberOfCopies}
                onChange={val => setNumberOfCopies(val)}
                min={1}
              />
            </InputPanel>

            <ButtonPanel>
              <Button type="submit" variant="primary" icon="check" label="Save Report" />
              <Button
                type="button"
                variant="outlined"
                icon="times"
                label="Cancel"
                onClick={() => setShowAddForm(false)}
              />
            </ButtonPanel>
          </form>
        </Card>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <Button
            variant="primary"
            icon="plus"
            label="+ Add New General Report"
            onClick={() => setShowAddForm(true)}
          />
        </div>
      )}

      <GridPanel
        title={`General Reports Archive (${reports.length})`}
        data={reports}
        columns={columns}
        searchFields={['title', 'author', 'generalCategory', 'generalSubCategory']}
        exportExcel
        onExportExcel={() => alert('Exporting to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
