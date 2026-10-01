import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

export interface NumberBoxProps<TForm extends FieldValues = FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
}

function InnerNumberBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  min,
  max,
  step = 1,
  className = '',
  subLabel,
  placeholder,
  disabled,
  ...rest
}: NumberBoxProps<FieldValues>) {
  const inputId = id ?? name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange?.(null);
    } else {
      const num = Number(raw);
      if (!isNaN(num)) {
        onChange?.(num);
      }
    }
  };

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <InputText
        type="number"
        id={inputId}
        value={value !== undefined && value !== null ? String(value) : ''}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className={`w-full ${className}`.trim()}
        {...rest}
      />
    </InputBlock>
  );
}

export default function NumberBox<TForm extends FieldValues = FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: NumberBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerNumberBox
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
        <InnerNumberBox
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
