import { Route, Routes } from 'react-router';
import Audit from './audit';
import Books from './books';
import Dashboard from './dashboard';
import Home from './home/Home';
import Reports from './reports';
import Borrow from './borrow';

export default function Features() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="books/*" element={<Books />} />
      <Route path="reports/*" element={<Reports />} />
      <Route path="borrow/*" element={<Borrow />} />
      <Route path="audit/*" element={<Audit />} />
    </Routes>
  );
}
