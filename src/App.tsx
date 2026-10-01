import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import Anonymous from './anonymous';
import Login from './anonymous/pages/Login';
import Authorized from './auth';
import { isAuthenticated } from './shared/utils/auth';

export default function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthed(isAuthenticated());
    };
    window.addEventListener('aiggpa-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('aiggpa-auth-changed', handleAuthChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="public/*" element={<Anonymous />} />
      <Route
        path="/*"
        element={authed ? <Authorized /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
