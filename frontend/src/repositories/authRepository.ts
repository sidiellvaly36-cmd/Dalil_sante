import { httpClient } from '@/lib/httpClient'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserProfileResponse,
} from '@/types'

/**
 * طبقة الوصول للبيانات الخاصة بالمصادقة - تستدعي الـ Backend الحقيقي مباشرة.
 * كل دالة هنا تطابق حرفيًا Endpoint واحد من AuthController.java.
 * لا يُستدعى httpClient مباشرة من أي مكان آخر خارج طبقة الـ Repositories.
 */
export const authRepository = {
  /** POST /auth/login */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>('/auth/login', payload)
    return data
  },

  /** POST /auth/register - الـ Backend يُرجع نفس شكل LoginResponse (توكن صالح فورًا) */
  async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>('/auth/register', payload)
    return data
  },

  /** GET /auth/me */
  async getCurrentUser(): Promise<UserProfileResponse> {
    const { data } = await httpClient.get<UserProfileResponse>('/auth/me')
    return data
  },

  /** PUT /auth/change-password */
  async changePassword(payload: ChangePasswordRequest): Promise<string> {
    const { data } = await httpClient.put<string>('/auth/change-password', payload)
    return data
  },
}
