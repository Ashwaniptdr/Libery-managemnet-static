import React from 'react';
import './InputPanel.css';

interface Props {
  title?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export default function InputPanel({
  title,
  orientation = 'horizontal',
  className = '',
  columns,
  children,
}: React.PropsWithChildren<Props>) {
  const validChildren = React.Children.toArray(children).filter(Boolean);
  const childCount = validChildren.length;
  const colCount = columns || (childCount > 0 && childCount <= 4 ? childCount : 4);
  const colClass = orientation === 'horizontal' ? `cols-${colCount}` : '';

  return (
    <div className={`input-panel ${orientation} ${colClass} ${className}`.trim()}>
      {title && (
        <h4 style={{ margin: '0 0 0.65rem 0', color: 'var(--primary-color)', gridColumn: '1 / -1' }}>
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
