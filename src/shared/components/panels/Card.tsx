import React from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  headerAction?: React.ReactNode;
}

export default function Card({
  title,
  note,
  children,
  className = '',
  style,
  onClose,
  headerAction,
}: CardProps) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {(title || note || onClose || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {note && <p className="card-note">{note}</p>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {headerAction}
            {onClose && (
              <button
                className="card-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card-content">{children}</div>
    </div>
  );
}
