import type { Control, FieldValues, Path, RefCallBack } from 'react-hook-form';

declare global {
  namespace Controls {
    /** Props for linking React-Hook-Form with Inputs. */
    interface FormProps<TForm extends FieldValues> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      control?: Control<TForm, any, TForm>;
      name?: Path<TForm>;
    }

    /** Props for the wrapper inside which inputs are placed. */
    interface InputBlockProps {
      id?: string;
      label?: string;
      subLabel?: string;
      errorMessage?: string;
      required?: boolean;
    }

    /**Common props for inputs */
    interface InputProps {
      disabled?: boolean;
      ref?: RefCallBack;
      autoFocus?: boolean;
      placeholder?: string;
      loading?: boolean;
      style?: React.CSSProperties;
      className?: string;
    }

    interface RadioProps {
      label?: string;
    }
  }
}
