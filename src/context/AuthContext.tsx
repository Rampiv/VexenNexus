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
import { useLocation } from "react-router"

// ============================================================================
// 🔐 КОНФИГУРАЦИЯ РОЛЕЙ (добавление новой роли = одна строка здесь)
// ============================================================================

export type UserRole = "admin" | "moderator" | "tiermake"

interface RoleConfig {
  cookieId: string
  cookieHash: string
  firestoreField: string
  label: string
}

export const ROLES: Record<UserRole, RoleConfig> = {
  admin: {
    cookieId: "vexen_admin_id",
    cookieHash: "vexen_admin_hash",
    firestoreField: "admin",
    label: "Админ",
  },
  moderator: {
    cookieId: "vexen_moderator_id",
    cookieHash: "vexen_moderator_hash",
    firestoreField: "moderator",
    label: "Модератор",
  },
  tiermake: {
    cookieId: "vexen_tiermake_id",
    cookieHash: "vexen_tiermake_hash",
    firestoreField: "tiermake",
    label: "Тирмейкер",
  },
}

// Определяем роль по URL
const detectRoleFromPath = (): UserRole => {
  const path = window.location.pathname
  if (path.includes("/moderator")) return "moderator"
  if (path.includes("/tiermake")) return "tiermake"
  return "admin"
}

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

interface AuthContextType {
  userRole: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (key: string, role: UserRole, rememberMe?: boolean) => Promise<boolean>
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
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const detectedRole = detectRoleFromPath()
    setUserRole(detectedRole)
    setIsAuthenticated(false)
    checkSavedSession(detectedRole)
  }, [location.pathname])

  const checkSavedSession = async (role: UserRole) => {
    const config = ROLES[role]
    try {
      const savedDocId = Cookies.get(config.cookieId)
      const savedKeyHash = Cookies.get(config.cookieHash)

      if (!savedDocId || !savedKeyHash) return

      const docSnap = await getDoc(doc(db, "admin_keys", savedDocId))

      if (!docSnap.exists()) {
        clearCookies(role)
        return
      }

      const data = docSnap.data()
      const currentKey = data[config.firestoreField]

      if (!currentKey || simpleHash(currentKey) !== savedKeyHash) {
        clearCookies(role)
        return
      }

      setUserRole(role)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Ошибка проверки сессии:", error)
      clearCookies(role)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (
    key: string,
    role: UserRole,
    rememberMe: boolean = false,
  ): Promise<boolean> => {
    const config = ROLES[role]
    try {
      const q = query(
        collection(db, "admin_keys"),
        where(config.firestoreField, "==", key.trim()),
      )

      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return false

      const docSnap = querySnapshot.docs[0]
      const validKey = docSnap.data()[config.firestoreField]
      if (!validKey) return false

      setUserRole(role)
      setIsAuthenticated(true)

      const expires = rememberMe ? 7 : undefined
      const keyHash = simpleHash(validKey)

      Cookies.set(config.cookieId, docSnap.id, {
        expires,
        secure: true,
        sameSite: "strict",
      })
      Cookies.set(config.cookieHash, keyHash, {
        expires,
        secure: true,
        sameSite: "strict",
      })

      return true
    } catch (error) {
      console.error("Ошибка входа:", error)
      return false
    }
  }
  const logout = () => {
    if (userRole) clearCookies(userRole)
    setUserRole(null)
    setIsAuthenticated(false)
  }

  const clearCookies = (role: UserRole) => {
    const config = ROLES[role]
    Cookies.remove(config.cookieId)
    Cookies.remove(config.cookieHash)
  }

  return (
    <AuthContext.Provider
      value={{
        userRole,
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
