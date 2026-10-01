import { MultiSelect } from 'primereact/multiselect';
import { Controller, type FieldValues } from 'react-hook-form';

import InputBlock from './InputBlock';

interface MultiSelectProps<TData, TForm extends FieldValues, TValue = unknown>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  data?: TData[];
  value?: TValue[];
  textField?: keyof TData;
  onChange?: (obj: TValue[]) => void;
  required?: boolean;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
  optionValue?: string;
  dataKey?: string;
}

function InnerMultiSelectList<TData = Data.DataItem<number>, TValue = unknown>({
  id,
  name,
  errorMessage,
  label,
  data,
  textField = 'text' as keyof TData,
  onChange,
  required,
  appendTo = 'self',
  ...rest
}: MultiSelectProps<TData, FieldValues, TValue>) {
  return (
    <InputBlock
      id={id}
      label={label}
      errorMessage={errorMessage}
      required={required}
    >
      <MultiSelect
        inputId={id ?? name}
        options={data}
        optionLabel={textField as string}
        onChange={e => onChange?.(e.value)}
        invalid={!!errorMessage}
        filter={true}
        resetFilterOnHide={true}
        display="chip"
        maxSelectedLabels={1}
        selectedItemsLabel="{0} items selected"
        appendTo={appendTo}
        {...rest}
      />
    </InputBlock>
  );
}

export default function MultiSelectList<
  TForm extends FieldValues,
  TData = Data.DataItem<number>,
  TValue = unknown,
>({ name, control, ...rest }: MultiSelectProps<TData, TForm, TValue>) {
  if (!control || !name) {
    return <InnerMultiSelectList name={name} {...rest} />;
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => {
        return (
          <InnerMultiSelectList
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
          />
        );
      }}
    />
  );
}
