import React, { createContext, useContext, useState, useCallback } from 'react'
import { api } from '@/services/api'

export interface AuthCtx {
  user: any | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  guestLogin: () => Promise<void>
  educatorId?: string
  educatorChildren?: any[]
  lessonProgress: (lessonId: string) => Promise<any>
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setUser(res.user)
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, role = 'child') => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { email, password, role })
      setUser(res.user)
    } finally {
      setLoading(false)
    }
  }, [])

  const guestLogin = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.post('/auth/guest', {})
      setUser(res.user)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = () => setUser(null)

  const lessonProgress = async (lessonId: string) =>
    api.get(`/progress/lesson/${lessonId}`)

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      guestLogin,
      lessonProgress
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
