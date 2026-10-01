import {
  type FieldValues,
  type Path,
  type Resolver,
  useForm,
} from 'react-hook-form';

export function useAppForm<TForm extends FieldValues>({
  resolver,
  defaultValues,
}: {
  resolver?: Resolver<TForm, unknown, TForm>;
  defaultValues?: Forms.FetchDataFunc<TForm>;
}) {
  const {
    control,
    handleSubmit,
    register: _, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...rest
  } = useForm<TForm>({
    mode: 'onSubmit',
    resolver,
    defaultValues,
    shouldFocusError: false,
  });

  return {
    register(key: Path<TForm>) {
      return { control, name: key };
    },
    handleSubmit,
    control,
    ...rest,
  };
}
