import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'shared/components/buttons/Button';
import DropDownList from 'shared/components/forms/DropDownList';
import GridPanel from 'shared/components/panels/GridPanel';
import Page from 'shared/components/panels/Page';
import { BOOK_CATEGORIES } from 'shared/constants/categories';
import { CENTERS } from 'shared/constants/centers';
import { STATIC_BOOKS } from 'shared/constants/staticData';

export default function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Library.BookItem[]>(STATIC_BOOKS);
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredBooks = books.filter(b => {
    if (selectedCenter && b.centerId !== selectedCenter) return false;
    if (selectedCategory && b.categoryId !== selectedCategory) return false;
    return true;
  });

  const handleDelete = (book: Library.BookItem) => {
    if (window.confirm(`Are you sure you want to remove "${book.title}" from catalog?`)) {
      setBooks(prev => prev.filter(b => b.bookId !== book.bookId));
    }
  };

  const columns: Controls.ColumnProps<Library.BookItem>[] = [
    { field: 'title', header: 'Book Title', width: '28%', sortable: true },
    { field: 'author', header: 'Author', width: '18%', sortable: true },
    { field: 'publication', header: 'Publication', width: '16%', sortable: true },
    {
      field: 'categoryName',
      header: 'Category',
      width: '18%',
      sortable: true,
      cell: item => (
        <div>
          <div>{item.categoryName}</div>
          {item.centerName && (
            <small style={{ color: 'var(--secondary-color)', fontWeight: 600, display: 'block' }}>
              <i className="pi pi-building" style={{ fontSize: '0.7rem', marginRight: '0.2rem' }} />
              {item.centerName}
            </small>
          )}
          {item.department && (
            <small style={{ color: '#0284c7', fontWeight: 600, display: 'block' }}>
              <i className="pi pi-external-link" style={{ fontSize: '0.7rem', marginRight: '0.2rem' }} />
              {item.department}
            </small>
          )}
        </div>
      ),
    },
    { field: 'year', header: 'Year', width: '8%', sortable: true },
    {
      field: 'numberOfCopies',
      header: 'Copies',
      width: '12%',
      cell: item => (
        <span>
          <strong>{item.availableCopies}</strong> / {item.numberOfCopies} Available
        </span>
      ),
    },
  ];

  return (
    <Page
      header="AIGGPA Central Registry & Catalog"
      subHeader="Unified registry of all books, 9 Centers reports, external departmental reports & biographies"
      headerActions={
        <Button
          size="medium"
          variant="primary"
          icon="plus"
          label="+ Register Book / Report"
          onClick={() => navigate('/books/add')}
        />
      }
    >
      {/* Inline Filters — directly below header button, directly above table */}
      <div className="list-inline-filters">
        <div style={{ width: '280px' }}>
          <DropDownList
            data={CENTERS}
            textField="name"
            valueField="centerId"
            value={selectedCenter}
            onChange={val => setSelectedCenter(val)}
            placeholder="All Centers (9 Centers)"
            defaultOptionText="All Centers (9 Centers)"
            showClear
          />
        </div>

        <div style={{ width: '240px' }}>
          <DropDownList
            data={BOOK_CATEGORIES}
            textField="name"
            valueField="categoryId"
            value={selectedCategory}
            onChange={val => setSelectedCategory(val)}
            placeholder="All Categories"
            defaultOptionText="All Categories"
            showClear
          />
        </div>

        {(selectedCenter || selectedCategory) && (
          <Button
            size="small"
            variant="outlined"
            label="Clear Filters"
            icon="times"
            onClick={() => {
              setSelectedCenter(null);
              setSelectedCategory(null);
            }}
          />
        )}
      </div>

      {/* Main Table */}
      <GridPanel
        title={`Registered Books Collection (${filteredBooks.length} items)`}
        data={filteredBooks}
        columns={columns}
        searchFields={['title', 'author', 'publication', 'categoryName', 'centerName']}
        onEdit={item => navigate(`/books/edit/${item.bookId}`)}
        onRemove={handleDelete}
        exportExcel
        onExportExcel={() => alert('Exporting book catalog to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
