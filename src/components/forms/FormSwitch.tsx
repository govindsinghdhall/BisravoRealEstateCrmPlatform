import { FormControlLabel, Switch } from '@mui/material'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  disabled?: boolean
}

export function FormSwitch<T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!field.value}
              onChange={field.onChange}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  )
}
