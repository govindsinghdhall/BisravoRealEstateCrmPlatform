import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { capitalize } from '@/utils/formatters'

interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  options: readonly string[] | { value: string | number; label: string }[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  /** Coerce selected menu value to number (for BHK, price, area, etc.). */
  numeric?: boolean
}

function resolveSelectValue(
  value: unknown,
  options: { value: string | number; label: string }[],
  placeholder?: string,
): string | number {
  if (value === '' || value === undefined || value === null) return ''
  const hasOption = options.some((opt) => opt.value === value)
  if (!hasOption && placeholder) return ''
  return value as string | number
}

function isSelectEmpty(value: unknown, options: { value: string | number; label: string }[], placeholder?: string) {
  return resolveSelectValue(value, options, placeholder) === ''
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  disabled = false,
  placeholder,
  numeric = false,
}: FormSelectProps<T>) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: capitalize(opt) } : opt,
  )
  const labelId = `${String(name)}-label`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectValue = resolveSelectValue(field.value, normalizedOptions, placeholder)
        const empty = isSelectEmpty(field.value, normalizedOptions, placeholder)

        return (
          <FormControl fullWidth error={!!error} required={required} disabled={disabled} variant="outlined">
            <InputLabel id={labelId} shrink={!empty || !!placeholder}>
              {label}
            </InputLabel>
            <Select
              id={String(name)}
              name={field.name}
              inputRef={field.ref}
              onBlur={field.onBlur}
              labelId={labelId}
              label={label}
              value={selectValue}
              displayEmpty={!!placeholder}
              onChange={(e) => {
                const raw = e.target.value
                field.onChange(numeric && raw !== '' ? Number(raw) : raw)
              }}
              renderValue={(selected) => {
                if (selected === '' && placeholder) {
                  return (
                    <Typography component="span" variant="body1" color="text.secondary">
                      {placeholder}
                    </Typography>
                  )
                }
                const match = normalizedOptions.find((opt) => opt.value === selected)
                return match?.label ?? String(selected)
              }}
            >
              {placeholder && (
                <MenuItem value="">
                  <em>{placeholder}</em>
                </MenuItem>
              )}
              {normalizedOptions.map((opt) => (
                <MenuItem key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}
