import { RadioButton as PrimeRadioButton } from 'primereact/radiobutton';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import './RadioButtonList.css';

export interface RadioOption<TValue = string | number | boolean> {
  label: string;
  value: TValue;
  disabled?: boolean;
  inputId?: string;
}

export interface RadioButtonListProps<
  TForm extends FieldValues = FieldValues,
  TValue = string | number | boolean,
> {
  name: string;
  control?: Control<TForm>;
  options: RadioOption<TValue>[];
  value?: TValue;
  onChange?: (e: { target: { name: string; value: TValue } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  errorMessage?: string;
  id?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: 'horizontal' | 'vertical';
  labelWidth?: string;
  optionLayout?: 'horizontal' | 'vertical';
}

export default function RadioButtonList<TForm extends FieldValues>({
  name,
  control,
  options,
  value,
  onChange,
  onBlur,
  errorMessage,
  id,
  label,
  className = '',
  disabled = false,
  required = false,
  variant = 'horizontal',
  labelWidth = '240px',
  optionLayout = 'horizontal',
}: RadioButtonListProps<TForm>) {
  const renderContent = (
    curValue: string | number | boolean | undefined,
    curError?: string,
    fieldOnBlur?: () => void,
    fieldOnChange?: (val: string | number | boolean) => void
  ) => {
    const error = curError || errorMessage;

    return (
      <div className={`radio-button-container ${className} w-full mb-1`}>
        <div
          className={
            variant === 'vertical'
              ? 'flex flex-col gap-2'
              : 'flex flex-col md:flex-row md:items-start gap-2 md:gap-4'
          }
        >
          {label && (
            <label
              className="flex-shrink-0 font-semibold text-sm text-gray-700 dark:text-gray-300 pt-1"
              style={variant === 'horizontal' ? { width: labelWidth } : {}}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}

          <div className="flex-1 w-full">
            <div
              className={`flex ${
                optionLayout === 'vertical'
                  ? 'flex-col gap-2'
                  : 'flex-row gap-4 flex-wrap'
              }`}
            >
              {options.map(opt => {
                const optId =
                  opt.inputId || `${id || name}-${String(opt.value)}`;

                return (
                  <div
                    key={String(opt.value)}
                    className="flex items-center gap-2"
                  >
                    <PrimeRadioButton
                      inputId={optId}
                      name={name}
                      value={opt.value}
                      checked={curValue === opt.value}
                      disabled={disabled || opt.disabled}
                      invalid={!!error}
                      onBlur={e => {
                        fieldOnBlur?.();
                        onBlur?.(e);
                      }}
                      onChange={e => {
                        fieldOnChange?.(e.value);
                        onChange?.({ target: { name, value: e.value } });
                      }}
                    />
                    <label
                      htmlFor={optId}
                      className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                    >
                      {opt.label}
                    </label>
                  </div>
                );
              })}
            </div>

            {error && (
              <small className="p-error block mt-1 text-sm text-red-500">
                {error}
              </small>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!control) return renderContent(value);

  return (
    <Controller
      name={name as Path<TForm>}
      control={control}
      render={({ field, fieldState }) =>
        renderContent(
          field.value,
          fieldState.error?.message,
          field.onBlur,
          field.onChange
        )
      }
    />
  );
}
