import type { USER_ROLES } from '@/utils/constants'

export type UserRole = (typeof USER_ROLES)[number]

export interface UserRecord {
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  role: UserRole
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  roleId: string
  phone?: string
  password: string
  isActive: boolean
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>> & { password?: string }
