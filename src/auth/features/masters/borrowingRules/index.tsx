import { Route, Routes } from 'react-router';
import BorrowingRulesList from './BorrowingRulesList';

export default function BorrowingRules() {
  return (
    <Routes>
      <Route path="/" element={<BorrowingRulesList />} />
    </Routes>
  );
}
