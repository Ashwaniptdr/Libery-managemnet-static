import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

interface LoaderProps {
  label?: string;
  type?: 'full' | 'inline';
}

export default function Loader({ label = 'Loading Library Records...', type = 'full' }: LoaderProps) {
  if (type === 'inline') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
        <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        padding: '2rem',
        gap: '1rem',
      }}
    >
      <ProgressSpinner style={{ width: '45px', height: '45px' }} strokeWidth="4" />
      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--primary-color)' }}>
        {label}
      </span>
    </div>
  );
}
