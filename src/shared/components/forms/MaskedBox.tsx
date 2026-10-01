import { InputMask } from 'primereact/inputmask';
import { Controller, type FieldValues } from 'react-hook-form';
import InputBlock from './InputBlock';

interface MaskedBoxProps<TForm extends FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  mask: string;
}

function InnerMaskedBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  ...rest
}: MaskedBoxProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock label={label} id={inputId} errorMessage={errorMessage}>
      <InputMask
        id={inputId}
        value={value || ''}
        onChange={e => onChange?.(e.target.value ?? '')}
        {...rest}
      />
    </InputBlock>
  );
}

export default function MaskedBox<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: MaskedBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerMaskedBox
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
      render={({ field, formState }) => (
        <InnerMaskedBox
          errorMessage={formState.errors?.[name]?.message?.toString()}
          {...field}
          {...rest}
        />
      )}
    />
  );
}
