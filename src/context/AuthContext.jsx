import { createContext, useCallback, useContext, useMemo } from 'react'
import toast from 'react-hot-toast'
import { config } from '../config'
import { useLocalStorageState } from '../hooks/useLocalStorage'
import { apiRequest, unwrapApiResponse } from '../api/http'

const AuthContext = createContext(null)

function safeUserFromLogin(data) {
  if (!data) return null
  return { name: data.name, email: data.email }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorageState(config.storage.tokenKey, null)
  const [user, setUser] = useLocalStorageState(config.storage.userKey, null)

  const isAuthenticated = Boolean(token)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    toast.success('Logged out')
  }, [setToken, setUser])

  const login = useCallback(
    async ({ email, password }) => {
      const payload = await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } })
      const data = unwrapApiResponse(payload)
      setToken(data.token)
      setUser(safeUserFromLogin(data))
      toast.success('Welcome back!')
      return data
    },
    [setToken, setUser],
  )

  const register = useCallback(async ({ name, email, password }) => {
    const payload = await apiRequest('/api/auth/register', { method: 'POST', body: { name, email, password } })
    unwrapApiResponse(payload)
    toast.success('Account created. Please login.')
  }, [])

  // ── Forgot Password ───────────────────────────────────────────
  // Backend no longer returns the reset token in the response body.
  // It sends it via email and returns only a generic success message.
  // We validate success with unwrapApiResponse (throws on failure),
  // then surface payload.message so the UI can display it to the user.
  const forgotPassword = useCallback(async ({ email }) => {
    const payload = await apiRequest('/api/auth/forgot-password', { method: 'POST', body: { email } })
    unwrapApiResponse(payload) // throws ApiError if success === false
    return { message: payload?.message }
  }, [])

  const resetPassword = useCallback(async ({ token: resetToken, newPassword }) => {
    const payload = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetToken, newPassword },
    })
    unwrapApiResponse(payload)
    toast.success('Password updated. Please login.')
  }, [])

  const getProfile = useCallback(async () => {
    if (!token) return null
    const payload = await apiRequest('/api/users/profile', { token })
    const data = unwrapApiResponse(payload)
    setUser({ name: data.name, email: data.email })
    return data
  }, [token, setUser])

  const updateProfile = useCallback(
    async ({ name, email }) => {
      const payload = await apiRequest('/api/users/profile', { method: 'PUT', token, body: { name, email } })
      const data = unwrapApiResponse(payload)
      setUser({ name: data.name, email: data.email })
      toast.success('Profile updated')
      return data
    },
    [token, setUser],
  )

  const changePassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      const payload = await apiRequest('/api/users/change-password', {
        method: 'PUT',
        token,
        body: { currentPassword, newPassword, confirmPassword },
      })
      unwrapApiResponse(payload)
      toast.success('Password changed')
    },
    [token],
  )

  const deleteAccount = useCallback(async () => {
    const payload = await apiRequest('/api/users/account', { method: 'DELETE', token })
    unwrapApiResponse(payload)
    setToken(null)
    setUser(null)
    toast.success('Account deleted')
  }, [token, setToken, setUser])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      getProfile,
      updateProfile,
      changePassword,
      deleteAccount,
    }),
    [
      token,
      user,
      isAuthenticated,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      getProfile,
      updateProfile,
      changePassword,
      deleteAccount,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}