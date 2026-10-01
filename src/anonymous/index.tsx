import { Route, Routes } from 'react-router';
import Login from './pages/Login';

export default function Anonymous() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route index element={<Login />} />
    </Routes>
  );
}
