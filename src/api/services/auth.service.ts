import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types'
import type { ApiEnvelope, AuthPayload, BackendUser } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'
import { mapUser } from '../utils/mappers'
import { useAuthStore } from '@/store/authStore'

function toAuthResponse(payload: AuthPayload): AuthResponse {
  return {
    user: mapUser(payload.user) as User,
    token: payload.accessToken,
    refreshToken: payload.refreshToken,
  }
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
    const refreshToken = useAuthStore.getState().refreshToken
    if (refreshToken) {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken })
    }
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<{ userId: string }>>(ENDPOINTS.AUTH.ME)
    const me = unwrap(data)
    const { data: userData } = await apiClient.get<ApiEnvelope<BackendUser>>(
      ENDPOINTS.USERS.BY_ID(me.userId),
    )
    return mapUser(unwrap(userData)) as User
  },
}
