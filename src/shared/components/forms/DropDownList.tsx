import { Dropdown } from 'primereact/dropdown';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

export interface DropDownProps<TData, TForm extends FieldValues = FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  data?: TData[];
  value?: any;
  textField?: keyof TData | string;
  valueField?: keyof TData | string;
  onChange?: (value: any) => void;
  defaultOptionText?: string;
  filter?: boolean;
  showClear?: boolean;
}

function InnerDropDownList<TData = any>({
  id,
  name,
  errorMessage,
  label,
  data = [],
  textField = 'name',
  valueField = 'id',
  onChange,
  required,
  defaultOptionText = 'Select an option',
  filter = true,
  placeholder,
  value,
  subLabel,
  disabled,
  showClear = false,
  className = '',
  ...rest
}: DropDownProps<TData, FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      id={inputId}
      label={label}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <Dropdown
        inputId={inputId}
        value={value}
        options={data}
        optionLabel={String(textField)}
        optionValue={String(valueField)}
        onChange={e => onChange?.(e.value)}
        placeholder={placeholder ?? defaultOptionText}
        filter={filter}
        showClear={showClear}
        disabled={disabled}
        className={`w-full ${className}`.trim()}
        {...rest}
      />
    </InputBlock>
  );
}

export default function DropDownList<TData = any, TForm extends FieldValues = FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: DropDownProps<TData, TForm>) {
  if (!control || !name) {
    return (
      <InnerDropDownList<TData>
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
        <InnerDropDownList<TData>
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
