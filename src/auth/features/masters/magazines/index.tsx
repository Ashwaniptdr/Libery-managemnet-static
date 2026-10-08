import { Route, Routes } from 'react-router';
import MagazineList from './MagazineList';

export default function Magazines() {
  return (
    <Routes>
      <Route path="/" element={<MagazineList />} />
    </Routes>
  );
}
