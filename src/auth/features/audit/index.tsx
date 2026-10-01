import React from 'react';
import { Route, Routes } from 'react-router';
import AuditList from './AuditList';

export default function Audit() {
  return (
    <Routes>
      <Route index element={<AuditList />} />
    </Routes>
  );
}
