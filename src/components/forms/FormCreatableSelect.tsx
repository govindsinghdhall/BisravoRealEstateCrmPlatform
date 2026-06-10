import { useMemo } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface FormCreatableSelectProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  options: string[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  /** Persist a user-typed value to the server so it appears for future listings. */
  onCreateOption?: (value: string) => Promise<void>
  /** Optional validation before saving a custom value (e.g. 6-digit pincode). */
  validateNewValue?: (value: string) => string | null
}

type OptionItem = string

const filter = createFilterOptions<OptionItem>()

const ADD_PREFIX = '__add__:'

export function FormCreatableSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  disabled = false,
  placeholder,
  onCreateOption,
  validateNewValue,
}: FormCreatableSelectProps<T>) {
  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.localeCompare(b)),
    [options],
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          freeSolo
          disableClearable={required}
          disabled={disabled}
          options={sortedOptions}
          value={(field.value as string) || null}
          onChange={async (_event, newValue) => {
            if (!newValue) {
              field.onChange('')
              return
            }

            if (typeof newValue === 'string' && newValue.startsWith(ADD_PREFIX)) {
              const created = newValue.slice(ADD_PREFIX.length)
              const validationError = validateNewValue?.(created)
              if (validationError) return
              await onCreateOption?.(created)
              field.onChange(created)
              return
            }

            field.onChange(typeof newValue === 'string' ? newValue.trim() : newValue)
          }}
          onInputChange={(_event, inputValue, reason) => {
            if (reason === 'input' || reason === 'clear') {
              field.onChange(inputValue)
            }
          }}
          filterOptions={(opts, params) => {
            const filtered = filter(opts, params)
            const input = params.inputValue.trim()
            if (
              input &&
              !opts.some((option) => option.toLowerCase() === input.toLowerCase())
            ) {
              filtered.push(`${ADD_PREFIX}${input}`)
            }
            return filtered
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string' && option.startsWith(ADD_PREFIX)) {
              return `Add "${option.slice(ADD_PREFIX.length)}"`
            }
            return option
          }}
          isOptionEqualToValue={(option, value) =>
            option.toLowerCase() === String(value).toLowerCase()
          }
          renderOption={(props, option) => {
            const { key, ...rest } = props
            const isAdd = option.startsWith(ADD_PREFIX)
            return (
              <li key={key} {...rest}>
                {isAdd ? (
                  <span>
                    Add &ldquo;<strong>{option.slice(ADD_PREFIX.length)}</strong>&rdquo;
                  </span>
                ) : (
                  option
                )}
              </li>
            )
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              required={required}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  )
}
