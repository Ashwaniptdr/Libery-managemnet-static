import { RadioButton as PrimeRadioButton } from 'primereact/radiobutton';
import { Controller, type FieldValues, type Path } from 'react-hook-form';
import './RadioButtonList.css';

export interface RadioOption<TValue = any> {
  label: string;
  value: TValue;
  disabled?: boolean;
  icon?: string;
}

export interface RadioButtonListProps<TForm extends FieldValues = FieldValues, TValue = any> {
  control?: Controls.FormProps<TForm>['control'];
  name?: Path<TForm>;
  label?: string;
  options: RadioOption<TValue>[];
  value?: TValue;
  onChange?: (value: TValue) => void;
  required?: boolean;
  errorMessage?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  variant?: 'default' | 'pill';
}

function InnerRadioList<TValue = any>({
  name = 'radio-group',
  label,
  options,
  value,
  onChange,
  required,
  errorMessage,
  orientation = 'horizontal',
  className = '',
  variant = 'default',
}: Omit<RadioButtonListProps<FieldValues, TValue>, 'control'>) {
  return (
    <div className={`radio-button-container ${className}`.trim()}>
      {label && (
        <div className="radio-container-label">
          {label} {required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
        </div>
      )}

      {variant === 'pill' ? (
        <div className={`radio-pill-group ${orientation === 'vertical' ? 'vertical' : ''}`}>
          {options.map((opt, idx) => {
            const isSelected = value === opt.value;
            const inputId = `${name}-${idx}`;
            return (
              <label
                key={String(opt.value)}
                htmlFor={inputId}
                className={`radio-pill-item ${isSelected ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}`}
              >
                <input
                  type="radio"
                  id={inputId}
                  name={name}
                  value={String(opt.value)}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange?.(opt.value)}
                  className="radio-pill-native"
                />
                <span className="radio-pill-circle" aria-hidden="true">
                  {isSelected && <span className="radio-pill-dot" />}
                </span>
                {opt.icon && <i className={`radio-pill-icon ${opt.icon}`} />}
                <span className="radio-pill-label">{opt.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            gap: orientation === 'vertical' ? '0.5rem' : '1.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {options.map((opt, idx) => {
            const inputId = `${name}-${idx}`;
            return (
              <div key={String(opt.value)} className="radio-option-item">
                <PrimeRadioButton
                  inputId={inputId}
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  disabled={opt.disabled}
                  onChange={e => onChange?.(e.value)}
                />
                <label htmlFor={inputId}>
                  {opt.icon && <i className={opt.icon} style={{ marginRight: '0.4rem' }} />}
                  {opt.label}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {errorMessage && (
        <span className="radio-error-text">
          <i className="pi pi-exclamation-circle" /> {errorMessage}
        </span>
      )}
    </div>
  );
}

export default function RadioButtonList<TForm extends FieldValues = FieldValues, TValue = any>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: RadioButtonListProps<TForm, TValue>) {
  if (!control || !name) {
    return (
      <InnerRadioList<TValue>
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
        <InnerRadioList<TValue>
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
