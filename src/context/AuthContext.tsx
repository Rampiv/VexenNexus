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

// Простая функция хеширования строки (не криптографически стойкая, но для сравнения подойдет)
const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16)
}

type UserRole = "admin" | "moderator" | null

interface AuthContextType {
  userRole: UserRole
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    key: string,
    role: "admin" | "moderator",
    rememberMe?: boolean,
  ) => Promise<boolean>
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
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Проверяем роль из URL при монтировании
  useEffect(() => {
    const path = window.location.pathname
    const detectedRole = path.includes("/moderator") ? "moderator" : "admin"
    setUserRole(detectedRole)

    // Проверяем сохраненную сессию в cookies
    checkSavedSession(detectedRole)
  }, [])

  const checkSavedSession = async (role: "admin" | "moderator") => {
    try {
      const cookieNameId =
        role === "admin" ? "vexen_admin_id" : "vexen_moderator_id"
      const cookieNameHash =
        role === "admin" ? "vexen_admin_hash" : "vexen_moderator_hash"
      
      const savedDocId = Cookies.get(cookieNameId)
      const savedKeyHash = Cookies.get(cookieNameHash)

      if (savedDocId && savedKeyHash) {
        // Загружаем документ по ID
        const docRef = doc(db, "admin_keys", savedDocId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          // Определяем поле ключа в зависимости от роли
          const currentKey = role === "admin" ? data.key : data.moderator
          
          if (currentKey) {
            // Хешируем текущий ключ из базы
            const currentKeyHash = simpleHash(currentKey)
            
            // Сравниваем с хешем из кук
            if (currentKeyHash === savedKeyHash) {
              setUserRole(role)
              setIsAuthenticated(true)
            } else {
              // Ключ изменился в базе данных
              console.log("Key mismatch. Logging out.")
              Cookies.remove(cookieNameId)
              Cookies.remove(cookieNameHash)
            }
          } else {
             // Поле ключа отсутствует в документе
             Cookies.remove(cookieNameId)
             Cookies.remove(cookieNameHash)
          }
        } else {
          // Документ удален
          Cookies.remove(cookieNameId)
          Cookies.remove(cookieNameHash)
        }
      }
    } catch (error) {
      console.error("Ошибка проверки сессии:", error)
      const cookieNameId = role === "admin" ? "vexen_admin_id" : "vexen_moderator_id"
      const cookieNameHash = role === "admin" ? "vexen_admin_hash" : "vexen_moderator_hash"
      Cookies.remove(cookieNameId)
      Cookies.remove(cookieNameHash)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (
    key: string,
    role: "admin" | "moderator",
    rememberMe: boolean = false,
  ): Promise<boolean> => {
    try {
      const keyField = role === "admin" ? "key" : "moderator"
      const q = query(
        collection(db, "admin_keys"),
        where(keyField, "==", key.trim()),
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]
        const docId = docSnap.id
        // Берем ключ из найденного документа для генерации хеша
        const data = docSnap.data()
        const validKey = role === "admin" ? data.key : data.moderator

        if (validKey) {
          setUserRole(role)
          setIsAuthenticated(true)

          const cookieNameId =
            role === "admin" ? "vexen_admin_id" : "vexen_moderator_id"
          const cookieNameHash =
            role === "admin" ? "vexen_admin_hash" : "vexen_moderator_hash"
          
          const expires = rememberMe ? 7 : undefined
          const keyHash = simpleHash(validKey)

          // Сохраняем ID документа и Хеш ключа
          Cookies.set(cookieNameId, docId, {
            expires: expires,
            secure: true,
            sameSite: "strict",
          })
          
          Cookies.set(cookieNameHash, keyHash, {
            expires: expires,
            secure: true,
            sameSite: "strict",
          })

          return true
        }
      }

      return false
    } catch (error) {
      console.error("Ошибка входа:", error)
      return false
    }
  }

  const logout = () => {
    const cookieNameId =
      userRole === "admin" ? "vexen_admin_id" : "vexen_moderator_id"
    const cookieNameHash =
      userRole === "admin" ? "vexen_admin_hash" : "vexen_moderator_hash"
    
    Cookies.remove(cookieNameId)
    Cookies.remove(cookieNameHash)
    
    setUserRole(null)
    setIsAuthenticated(false)
  }

  const value = {
    userRole,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}