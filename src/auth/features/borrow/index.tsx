import React from 'react';
import { Route, Routes } from 'react-router';
import BorrowForm from './BorrowForm';
import BorrowList from './BorrowList';

export default function Borrow() {
  return (
    <Routes>
      <Route index element={<BorrowList />} />
      <Route path="issue" element={<BorrowForm />} />
    </Routes>
  );
}
