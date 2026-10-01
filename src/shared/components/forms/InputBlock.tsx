import React from 'react';
import './InputBlock.css';

type Orientation = 'vertical' | 'horizontal';

export default function InputBlock(
  props: React.PropsWithChildren<
    Controls.InputBlockProps & {
      orientation?: Orientation;
      className?: string;
    }
  >
) {
  const {
    label,
    subLabel,
    id,
    required,
    errorMessage,
    className = '',
    children,
    orientation = 'vertical',
  } = props;

  return (
    <div className={`input-block ${orientation} ${className}`.trim()}>
      {label ? (
        <label htmlFor={id}>
          <span className="label-text">
            <span>{label}</span>
            {required ? <span className="required">*</span> : null}
          </span>
          {subLabel ? <span className="sub-label">{subLabel}</span> : null}
        </label>
      ) : null}

      <div className={`input-wrapper ${errorMessage ? 'has-error' : ''}`}>
        {children}
        {errorMessage ? (
          <div className="error-message-wrapper">
            <span className="error-message-text">
              <i className="pi pi-exclamation-circle" /> {errorMessage}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
