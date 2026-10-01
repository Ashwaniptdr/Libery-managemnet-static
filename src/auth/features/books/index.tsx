import React from 'react';
import { Route, Routes } from 'react-router';
import BookForm from './BookForm';
import BookList from './BookList';

export default function Books() {
  return (
    <Routes>
      <Route index element={<BookList />} />
      <Route path="add" element={<BookForm />} />
      <Route path="edit/:id" element={<BookForm />} />
    </Routes>
  );
}
