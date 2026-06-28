import type { AuthResponse, LoginCredentials, ProfileUpdateDto, RegisterCredentials, User } from '@/types'
import type { ApiEnvelope, AuthPayload, BackendUser } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'
import { mapUser } from '../utils/mappers'

function toAuthResponse(payload: AuthPayload): AuthResponse {
  return {
    user: mapUser(payload.user) as User,
    token: payload.accessToken,
  }
}

async function getMyBackendUser(): Promise<BackendUser> {
  const { data } = await apiClient.get<ApiEnvelope<{ userId: string }>>(ENDPOINTS.AUTH.ME)
  const me = unwrap(data)
  const { data: userData } = await apiClient.get<ApiEnvelope<BackendUser>>(
    ENDPOINTS.USERS.BY_ID(me.userId),
  )
  return unwrap(userData)
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(
      ENDPOINTS.AUTH.REGISTER,
      credentials,
    )
    return toAuthResponse(unwrap(data))
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    )
    return toAuthResponse(unwrap(data))
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
    } catch {
      // Client clears token regardless of server response
    }
  },

  async getMe(): Promise<User> {
    const backendUser = await getMyBackendUser()
    return mapUser(backendUser) as User
  },

  getMyBackendUser,

  async updateProfile(dto: ProfileUpdateDto): Promise<User> {
    const profile = await getMyBackendUser()
    const payload: Record<string, unknown> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone ?? null,
      roleId: profile.roleId,
      isActive: profile.isActive,
    }
    if (dto.password) payload.password = dto.password

    const { data } = await apiClient.put<ApiEnvelope<BackendUser>>(
      ENDPOINTS.USERS.BY_ID(profile.id),
      payload,
    )
    return mapUser(unwrap(data)) as User
  },
}
