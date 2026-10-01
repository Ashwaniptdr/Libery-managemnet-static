import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

export interface TextAreaProps<TForm extends FieldValues = FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  autoResize?: boolean;
}

function InnerTextArea({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  rows = 3,
  autoResize = true,
  className = '',
  subLabel,
  placeholder,
  disabled,
  ...rest
}: TextAreaProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <InputTextarea
        id={inputId}
        value={value ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        autoResize={autoResize}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full ${className}`.trim()}
        {...rest}
      />
    </InputBlock>
  );
}

export default function TextArea<TForm extends FieldValues = FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: TextAreaProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerTextArea
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
        <InnerTextArea
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
