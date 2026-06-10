import { TextField } from '@mui/material'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface FormTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  type?: string
  multiline?: boolean
  rows?: number
  required?: boolean
  disabled?: boolean
}

export function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  multiline = false,
  rows,
  required = false,
  disabled = false,
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          required={required}
          disabled={disabled}
          fullWidth
          error={!!error}
          helperText={error?.message}
          value={field.value ?? (type === 'number' ? 0 : '')}
          onChange={(e) => {
            if (type === 'number') {
              const input = e.target as HTMLInputElement
              field.onChange(input.valueAsNumber || 0)
            } else {
              field.onChange(e.target.value)
            }
          }}
        />
      )}
    />
  )
}
