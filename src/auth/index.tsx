import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import AppLayout from './layout';
import Features from './features';

export default function AuthorizedApp() {
  const toast = useRef<Toast>(null);

  return (
    <div>
      <Toast ref={toast} position="top-right" />
      <AppLayout>
        <Features />
      </AppLayout>
    </div>
  );
}
