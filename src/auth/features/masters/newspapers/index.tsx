import { Route, Routes } from 'react-router';
import NewspaperList from './NewspaperList';

export default function Newspapers() {
  return (
    <Routes>
      <Route index element={<NewspaperList />} />
    </Routes>
  );
}
