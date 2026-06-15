import type { UserRole } from "@contexts/AuthContext"
import type React from "react"
import { Link, useLocation } from "react-router"

interface AuthScreenProps {
  inputKey: string
  setInputKey: (value: string) => void
  handleLogin: (e: React.FormEvent) => void
  authError: string
  authLoading: boolean
}

// Маппинг путей к ролям
const PATH_TO_ROLE: Record<string, UserRole> = {
  "/admin": "admin",
  "/moderator": "moderator",
  "/tiermake": "tiermake",
}

const ROLE_TO_PATH: Record<UserRole, string> = {
  admin: "/admin",
  moderator: "/moderator",
  tiermake: "/tiermake",
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  inputKey,
  setInputKey,
  handleLogin,
  authError,
  authLoading,
}) => {
  const location = useLocation()

  // Определяем текущую роль по pathname
  const currentRole: UserRole =
    PATH_TO_ROLE[location.pathname] || "admin"

  return (
    <section className="admin-auth-screen">
      <div className="admin-auth-box">
        <h2>Доступ ограничен</h2>

        <div className="admin-auth-links">
          {(Object.keys(ROLE_TO_PATH) as UserRole[]).map(role => (
            <Link
              key={role}
              to={ROLE_TO_PATH[role]}
              className={`auth-link ${currentRole === role ? "active" : ""}`}
              onClick={()=>setInputKey('')}
            >
              {role === "admin"
                ? "Admin"
                : role === "moderator"
                  ? "Moderator"
                  : "Tiermake"}
            </Link>
          ))}
        </div>

        <form onSubmit={handleLogin} className="admin-key-form">
          <input
            type="password"
            placeholder="Ключ..."
            value={inputKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputKey(e.target.value)
            }
            autoFocus
          />
          <button type="submit" disabled={authLoading}>
            {authLoading ? "..." : "Войти"}
          </button>
        </form>
        {authError && <p className="admin-error-msg">{authError}</p>}
      </div>
    </section>
  )
}