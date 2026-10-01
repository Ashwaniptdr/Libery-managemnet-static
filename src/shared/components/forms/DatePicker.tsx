import { Calendar } from 'primereact/calendar';
import React from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

export interface DatePickerProps<TForm extends FieldValues = FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  dateFormat?: string;
  view?: 'date' | 'month' | 'year';
  minDate?: Date;
  maxDate?: Date;
  showIcon?: boolean;
}

function InnerDatePicker({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  dateFormat = 'yy-mm-dd',
  view = 'date',
  minDate,
  maxDate,
  showIcon = true,
  className = '',
  subLabel,
  placeholder = 'Select date',
  disabled,
}: DatePickerProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <Calendar
        id={inputId}
        value={value ?? null}
        onChange={e => onChange?.(e.value as Date | null)}
        dateFormat={dateFormat}
        view={view}
        minDate={minDate}
        maxDate={maxDate}
        showIcon={showIcon}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${className}`.trim()}
      />
    </InputBlock>
  );
}

export default function DatePicker<TForm extends FieldValues = FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: DatePickerProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerDatePicker
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
        <InnerDatePicker
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
