import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import React from 'react';
import { Controller, type FieldValues } from 'react-hook-form';

export interface CheckBoxProps<TForm extends FieldValues = FieldValues>
  extends Controls.FormProps<TForm> {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function CheckBox<TForm extends FieldValues = FieldValues>({
  name,
  control,
  label,
  checked,
  onChange,
  disabled,
  className = '',
  id,
}: CheckBoxProps<TForm>) {
  const inputId = id ?? name;

  if (!control || !name) {
    return (
      <div className={`flex align-items-center gap-2 ${className}`.trim()} style={{ margin: '0.5rem 0' }}>
        <PrimeCheckbox
          inputId={inputId}
          checked={checked ?? false}
          onChange={e => onChange?.(e.checked ?? false)}
          disabled={disabled}
        />
        <label htmlFor={inputId} style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
          {label}
        </label>
      </div>
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex align-items-center gap-2 ${className}`.trim()} style={{ margin: '0.5rem 0' }}>
          <PrimeCheckbox
            inputId={inputId}
            checked={field.value ?? false}
            onChange={e => {
              field.onChange(e.checked);
              onChange?.(e.checked ?? false);
            }}
            disabled={disabled}
          />
          <label htmlFor={inputId} style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
            {label}
          </label>
        </div>
      )}
    />
  );
}
