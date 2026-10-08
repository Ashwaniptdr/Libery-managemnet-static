import { Route, Routes } from 'react-router';
import ProjectList from './ProjectList';

export default function Projects() {
  return (
    <Routes>
      <Route index element={<ProjectList />} />
    </Routes>
  );
}
