import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roleId: z.string().min(1, 'Role is required'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  isActive: z.boolean(),
})

export type UserFormData = z.infer<typeof userSchema>
