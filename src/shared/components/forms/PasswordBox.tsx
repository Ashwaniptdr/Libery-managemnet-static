import { Password } from 'primereact/password';
import { Controller, type FieldValues } from 'react-hook-form';
import './PasswordBox.css';

import InputBlock from './InputBlock';

interface PasswordBoxProps<TForm extends FieldValues>
  extends Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  showsWeakness?: boolean;
  required?: boolean;
  icon?: string; // e.g. "pi pi-lock"
  iconPosition?: 'left' | 'right';
}

function InnerPasswordBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  showsWeakness,
  icon,
  iconPosition = 'left',
  ...rest
}: PasswordBoxProps<FieldValues>) {
  const inputId = id ?? name;
  return (
    <InputBlock label={label} id={inputId} errorMessage={errorMessage}>
      <span
        className={`p-input-icon-${iconPosition}`}
        style={{ width: 'auto', position: 'relative' }}
      >
        {icon && (
          <i
            className={icon}
            style={{
              fontSize: '1rem',
              color: '#000',
              ...(iconPosition === 'left'
                ? { left: '1rem' }
                : { right: '0rem' }),
              position: 'absolute',
              top: '50%',
              // transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
        <Password
          inputId={inputId}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          feedback={showsWeakness}
          invalid={!!errorMessage}
          toggleMask={true}
          inputClassName="pl-6"
          {...rest}
        />
      </span>
    </InputBlock>
  );
}

export default function PasswordBox<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: PasswordBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerPasswordBox
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
      render={({ field, formState }) => {
        return (
          <InnerPasswordBox
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
          />
        );
      }}
    />
  );
}
