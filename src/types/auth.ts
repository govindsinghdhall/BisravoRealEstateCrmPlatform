import type { USER_ROLES } from '@/utils/constants'

export type UserRole = (typeof USER_ROLES)[number]

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ProfileUpdateDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password?: string
}
