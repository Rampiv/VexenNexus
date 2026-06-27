import type React from "react"

interface AuthScreenProps {
  inputUsername: string
  setInputUsername: (value: string) => void
  inputPassword: string
  setInputPassword: (value: string) => void
  handleLogin: (e: React.FormEvent) => void
  authError: string
  authLoading: boolean
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  inputUsername,
  setInputUsername,
  inputPassword,
  setInputPassword,
  handleLogin,
  authError,
  authLoading,
}) => {
  return (
    <section className="admin-auth-screen">
      <div className="admin-auth-box">
        <h2>Вход в админ-панель</h2>
        <p>Введите свои учетные данные для доступа</p>

        <form onSubmit={handleLogin} className="admin-key-form">
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              placeholder="Введите имя..."
              value={inputUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputUsername(e.target.value)
              }
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль..."
              value={inputPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputPassword(e.target.value)
              }
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={authLoading}>
            {authLoading ? "Вход..." : "Войти"}
          </button>
        </form>

        {authError && <p className="admin-error-msg">{authError}</p>}
      </div>
    </section>
  )
}