import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import NumberBox from 'shared/components/forms/NumberBox';
import RadioButtonList from 'shared/components/forms/RadioButtonList';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { STATIC_BOOKS } from 'shared/constants/staticData';

export default function OtherReports() {
  // Filter motivational and auto-biographies
  const [books, setBooks] = useState<Library.BookItem[]>(
    STATIC_BOOKS.filter(
      b => b.categoryType === 'MOTIVATIONAL' || b.categoryType === 'AUTOBIOGRAPHY'
    )
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubCat, setSelectedSubCat] = useState<'ALL' | 'MOTIVATIONAL' | 'AUTOBIOGRAPHY'>('ALL');

  // Form Fields per specification:
  // Title, Author, Publication, Year, No of copies
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publication, setPublication] = useState('');
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [numberOfCopies, setNumberOfCopies] = useState<number | null>(5);
  const [categoryType, setCategoryType] = useState<Library.BookCategoryType>('MOTIVATIONAL');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const filterOptions = [
    { label: 'All Special Collections', value: 'ALL' },
    { label: 'Motivational Books', value: 'MOTIVATIONAL' },
    { label: 'Auto-Biographies & Biographies', value: 'AUTOBIOGRAPHY' },
  ];

  const formCategoryOptions = [
    { label: 'Motivational Books', value: 'MOTIVATIONAL' },
    { label: 'Auto-Biographies & Biographies', value: 'AUTOBIOGRAPHY' },
  ];

  const displayedBooks = books.filter(b => {
    if (selectedSubCat === 'ALL') return true;
    return b.categoryType === selectedSubCat;
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!author.trim()) errs.author = 'Author name is required';
    if (!publication.trim()) errs.publication = 'Publication is required';
    if (!year || year < 1800 || year > 2099) errs.year = 'Enter a valid year';
    if (!numberOfCopies || numberOfCopies < 1) errs.numberOfCopies = 'Copies must be >= 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newBook: Library.BookItem = {
      bookId: Date.now(),
      title,
      author,
      publication,
      year: year!,
      numberOfCopies: numberOfCopies ?? 1,
      availableCopies: numberOfCopies ?? 1,
      categoryId: categoryType === 'MOTIVATIONAL' ? 2 : 3,
      categoryName:
        categoryType === 'MOTIVATIONAL'
          ? 'Motivational Books'
          : 'Auto-Biographies & Biographies',
      categoryType,
      isActive: true,
    };

    setBooks([newBook, ...books]);
    setSuccessMessage(`"${title}" added to ${newBook.categoryName} successfully!`);
    setShowAddForm(false);
    setTitle('');
    setAuthor('');
    setPublication('');
  };

  const columns: Controls.ColumnProps<Library.BookItem>[] = [
    { field: 'title', header: 'Title', width: '30%', sortable: true },
    { field: 'author', header: 'Author', width: '20%', sortable: true },
    { field: 'publication', header: 'Publication', width: '20%', sortable: true },
    {
      field: 'categoryName',
      header: 'Collection',
      width: '18%',
      sortable: true,
      cell: item => (
        <span
          className={`status-badge ${
            item.categoryType === 'MOTIVATIONAL' ? 'issued' : 'returned'
          }`}
        >
          {item.categoryType === 'MOTIVATIONAL' ? 'Motivational' : 'Auto-Biography'}
        </span>
      ),
    },
    { field: 'year', header: 'Year', width: '12%', sortable: true },
  ];

  return (
    <Page
      header="Other Collections: Motivational & Auto-Biographies"
      subHeader="Inspirational literature, civil service memoirs & biographies of statesmen (classified under Other)"
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
          title="Add New Book"
          onClose={() => setShowAddForm(false)}
        >
          <form onSubmit={handleAddBook}>
            <div style={{ marginBottom: '1rem' }}>
              <RadioButtonList
                name="categoryType"
                label="Target Collection"
                options={formCategoryOptions}
                value={categoryType}
                onChange={val => setCategoryType(val as Library.BookCategoryType)}
                required
              />
            </div>

            <InputPanel orientation="horizontal">
              <TextBox
                name="title"
                label="Title"
                value={title}
                onChange={val => setTitle(val)}
                placeholder="e.g. Wings of Fire / Atomic Habits"
                errorMessage={errors.title}
                required
              />

              <TextBox
                name="author"
                label="Author"
                value={author}
                onChange={val => setAuthor(val)}
                placeholder="e.g. Dr. A. P. J. Abdul Kalam"
                errorMessage={errors.author}
                required
              />

              <TextBox
                name="publication"
                label="Publication"
                value={publication}
                onChange={val => setPublication(val)}
                placeholder="e.g. Universities Press"
                errorMessage={errors.publication}
                required
              />

              <NumberBox
                name="year"
                label="Year"
                value={year}
                onChange={val => setYear(val)}
                min={1800}
                max={2099}
                errorMessage={errors.year}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <NumberBox
                name="numberOfCopies"
                label="No of Copies"
                value={numberOfCopies}
                onChange={val => setNumberOfCopies(val)}
                min={1}
                errorMessage={errors.numberOfCopies}
                required
              />
            </InputPanel>

            <ButtonPanel>
              <Button type="submit" variant="primary" icon="check" label="Save Volume" />
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <RadioButtonList
            name="subCatFilter"
            options={filterOptions}
            value={selectedSubCat}
            onChange={val => setSelectedSubCat(val as 'MOTIVATIONAL' | 'AUTOBIOGRAPHY' | 'ALL')}
          />

          <Button
            variant="primary"
            icon="plus"
            label="+ Add New Volume"
            onClick={() => setShowAddForm(true)}
          />
        </div>
      )}

      <GridPanel
        title={`Collection Listing (${displayedBooks.length})`}
        data={displayedBooks}
        columns={columns}
        searchFields={['title', 'author', 'publication']}
        exportExcel
        onExportExcel={() => alert('Exporting to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
