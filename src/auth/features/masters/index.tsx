import { Route, Routes } from 'react-router';
import Newspapers from './newspapers';
import BorrowingRules from './borrowingRules';
import Projects from './projects';

export default function Masters() {
  return (
    <Routes>
      <Route path="newspapers/*" element={<Newspapers />} />
      <Route path="magazines/*" element={<Newspapers />} />
      <Route path="borrowing-rules/*" element={<BorrowingRules />} />
      <Route path="projects/*" element={<Projects />} />
    </Routes>
  );
}
