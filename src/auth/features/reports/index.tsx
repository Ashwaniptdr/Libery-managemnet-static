import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import AiggpaReports from './AiggpaReports';
import GeneralReports from './GeneralReports';
import OtherReports from './OtherReports';

export default function Reports() {
  return (
    <Routes>
      <Route index element={<Navigate to="aiggpa" replace />} />
      <Route path="aiggpa" element={<AiggpaReports />} />
      <Route path="general" element={<GeneralReports />} />
      <Route path="other" element={<OtherReports />} />
    </Routes>
  );
}
