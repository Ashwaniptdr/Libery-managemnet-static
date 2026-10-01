import { Calendar } from 'primereact/calendar';
import { Controller, type FieldValues } from 'react-hook-form';

import InputBlock from './InputBlock';

interface TimePickerProps<TForm extends FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: Date | null;
  onChange?: (value?: Date | null) => void;
  required?: boolean;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
}

/* =========================
   Inner Time Picker
========================= */
function InnerTimePicker({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  appendTo = 'self',
  ...rest
}: TimePickerProps<FieldValues>) {
  const inputId = id ?? name;
  const displayLabel = required && label ? `${label} *` : label;

  return (
    <InputBlock label={displayLabel} id={inputId} errorMessage={errorMessage}>
      <div className="datepicker-wrapper">
        <Calendar
          inputId={inputId}
          value={value ?? null}
          onChange={e => onChange?.(e.value ?? null)}
          timeOnly
          hourFormat="12" // ✅ AM / PM
          showSeconds={false}
          className="w-full custom-calendar"
          invalid={!!errorMessage}
          appendTo={appendTo}
          {...rest}
        />
        <i className="pi pi-clock calendar-icon" />
      </div>
    </InputBlock>
  );
}

/* =========================
   Main Time Picker
========================= */
export default function TimePicker<TForm extends FieldValues>({
  control,
  name,
  errorMessage,
  onChange,
  ...rest
}: TimePickerProps<TForm>) {
  // ✅ Without react-hook-form
  if (!control || !name) {
    return (
      <InnerTimePicker
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        {...rest}
      />
    );
  }

  // ✅ With react-hook-form
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InnerTimePicker
          {...field}
          {...rest}
          value={field.value ?? null}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
