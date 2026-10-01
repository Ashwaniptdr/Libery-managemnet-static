import React from 'react';
import './ButtonPanel.css';

interface ButtonPanelProps extends React.PropsWithChildren {
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export default function ButtonPanel({
  children,
  className = '',
  align = 'start',
}: ButtonPanelProps) {
  return (
    <div className={`button-panel ${align} ${className}`.trim()}>
      {children}
    </div>
  );
}
