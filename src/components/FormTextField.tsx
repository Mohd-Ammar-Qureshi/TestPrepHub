import React from 'react';
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import {TextField, type TextFieldProps} from './TextField';

interface FormTextFieldProps<T extends FieldValues> extends Omit<
  TextFieldProps,
  'value' | 'onChangeText' | 'onBlur' | 'error'
> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: ControllerProps<T, FieldPath<T>>['rules'];
}

/** TextField connected to React Hook Form. Shows the field's error message. */
export function FormTextField<T extends FieldValues>({
  control,
  name,
  rules,
  ...fieldProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: {onChange, onBlur, value, ref},
        fieldState: {error},
      }) => (
        <TextField
          {...fieldProps}
          ref={ref}
          value={(value ?? '') as string}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}
