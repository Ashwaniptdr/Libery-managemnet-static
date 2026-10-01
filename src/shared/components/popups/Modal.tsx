import React from 'react';

interface ModalProps extends React.PropsWithChildren {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="card"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2001,
          maxWidth: '500px',
          width: '90%',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {onClose && (
            <button className="card-close-btn" onClick={onClose}>
              &times;
            </button>
          )}
        </div>
        <div className="card-content">{children}</div>
      </div>
    </div>
  );
}
