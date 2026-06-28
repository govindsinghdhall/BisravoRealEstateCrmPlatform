import { useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
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
  showPasswordToggle?: boolean
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
  showPasswordToggle = false,
}: FormTextFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password' && showPasswordToggle
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type
  const isNativeDateInput = type === 'datetime-local' || type === 'date' || type === 'time'

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={inputType}
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
          slotProps={{
            inputLabel: isNativeDateInput ? { shrink: true } : undefined,
            input: isPasswordField
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((visible) => !visible)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined,
          }}
        />
      )}
    />
  )
}
