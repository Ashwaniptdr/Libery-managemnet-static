import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

export interface TextBoxProps<TForm extends FieldValues = FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  maxLength?: number;
  minLength?: number;
}

function InnerTextBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  icon,
  className = '',
  subLabel,
  iconPosition = 'left',
  type = 'text',
  placeholder,
  disabled,
  ...rest
}: TextBoxProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <i
            className={`pi pi-${icon}`}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [iconPosition]: '0.75rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
        <InputText
          type={type}
          id={inputId}
          value={value ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full ${className}`.trim()}
          style={{
            paddingLeft: icon && iconPosition === 'left' ? '2.5rem' : undefined,
            paddingRight: icon && iconPosition === 'right' ? '2.5rem' : undefined,
          }}
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

export default function TextBox<TForm extends FieldValues = FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: TextBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerTextBox
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InnerTextBox
          name={name}
          errorMessage={errorMessage ?? fieldState.error?.message}
          value={field.value}
          onChange={val => {
            field.onChange(val);
            onChange?.(val);
          }}
          {...rest}
        />
      )}
    />
  );
}
