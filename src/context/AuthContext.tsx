import type { ReactNode } from "react"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { db } from "../firebase/config"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"
import Cookies from "js-cookie"

// ============================================================================
// 🍪 КОНФИГУРАЦИЯ COOKIE
// ============================================================================

const COOKIE_KEYS = {
  roleId: "vexen_role_id",
  userName: "vexen_user_name",
  sessionHash: "vexen_session_hash",
} as const

// ============================================================================
// 🔧 УТИЛИТЫ
// ============================================================================

const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

// ============================================================================
// 🎯 AUTH CONTEXT
// ============================================================================

export type UserRole = string

interface AuthContextType {
  userRole: string | null
  userName: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Проверка сохранённой сессии при загрузке
  useEffect(() => {
    checkSavedSession()
  }, [])

  const checkSavedSession = async () => {
    try {
      const savedRoleId = Cookies.get(COOKIE_KEYS.roleId)
      const savedUserName = Cookies.get(COOKIE_KEYS.userName)
      const savedHash = Cookies.get(COOKIE_KEYS.sessionHash)

      if (!savedRoleId || !savedUserName || !savedHash) {
        setIsLoading(false)
        return
      }

      const docSnap = await getDoc(doc(db, "roles", savedRoleId))

      if (!docSnap.exists()) {
        clearSession()
        return
      }

      const data = docSnap.data()
      const currentPassword = data.password

      if (!currentPassword || simpleHash(currentPassword) !== savedHash) {
        clearSession()
        return
      }

      setUserRole(savedRoleId)
      setUserName(savedUserName)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Ошибка проверки сессии:", error)
      clearSession()
    } finally {
      setIsLoading(false)
    }
  }

  // Вход по имени роли и паролю
  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const q = query(
        collection(db, "roles"),
        where("name", "==", username.trim()),
      )

      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return false

      const docSnap = querySnapshot.docs[0]
      const roleData = docSnap.data()

      if (roleData.password !== password.trim()) return false

      const roleId = docSnap.id
      const sessionHash = simpleHash(password.trim())

      Cookies.set(COOKIE_KEYS.roleId, roleId, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      })
      Cookies.set(COOKIE_KEYS.userName, username.trim(), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      })
      Cookies.set(COOKIE_KEYS.sessionHash, sessionHash, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      })

      setUserRole(roleId)
      setUserName(username.trim())
      setIsAuthenticated(true)

      return true
    } catch (error) {
      console.error("Ошибка входа:", error)
      return false
    }
  }

  const logout = () => {
    clearSession()
    setUserRole(null)
    setUserName(null)
    setIsAuthenticated(false)
  }

  const clearSession = () => {
    Cookies.remove(COOKIE_KEYS.roleId)
    Cookies.remove(COOKIE_KEYS.userName)
    Cookies.remove(COOKIE_KEYS.sessionHash)
  }

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userName,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
