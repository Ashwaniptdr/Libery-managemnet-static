import React from 'react';
import './InputPanel.css';

interface Props {
  title?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export default function InputPanel({
  title,
  orientation = 'horizontal',
  className = '',
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div className={`input-panel ${orientation} ${className}`.trim()}>
      {title && (
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)', gridColumn: '1 / -1' }}>
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
