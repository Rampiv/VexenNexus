import "./Admin.scss"
import { Loader } from "../../components"
import { AuthScreen } from "./components/AdminUI"
import {
  ResonatorForm,
  WeaponForm,
  MechanicForm,
  EchoSetForm,
  TierListForm,
  SettingsForm,
} from "./components/AdminForms"
import { useAdminData } from "./hooks/useAdminData"
import type { TierList } from "../../types/TierList"

export const Admin = () => {
  const admin = useAdminData()

  if (admin.authLoading || !admin.isDbReady)
    return <Loader width="100px" height="100px" />
  if (!admin.isAuthenticated)
    return (
      <AuthScreen
        inputKey={admin.inputKey}
        setInputKey={admin.setInputKey}
        handleLogin={admin.handleLogin}
        authError={admin.authError}
        authLoading={false}
      />
    )

  return (
    <section className="admin">
      <div className="admin-header">
        {admin.isAdmin && <h1>Админ панель</h1>}
        {admin.isModerator && <h1>Модератор панель</h1>}
        {admin.isTiermake && <h1>Тирмейкер панель</h1>}

        <button onClick={admin.handleLogout} className="btn-logout">
          Выйти
        </button>
      </div>

      <div className="admin-tabs">
        {(admin.isAdmin || admin.isTiermake) && (
          <button
            className={`tab-btn ${admin.activeTab === "resonators" ? "active" : ""}`}
            onClick={() => admin.handleTabChange("resonators")}
          >
            Персонажи
          </button>
        )}
        {admin.isAdmin && (
          <button
            className={`tab-btn ${admin.activeTab === "weapons" ? "active" : ""}`}
            onClick={() => admin.handleTabChange("weapons")}
          >
            Оружие
          </button>
        )}
        {admin.isAdmin && (
          <button
            className={`tab-btn ${admin.activeTab === "mechanics" ? "active" : ""}`}
            onClick={() => admin.handleTabChange("mechanics")}
          >
            Механики
          </button>
        )}
        {admin.isAdmin && (
          <button
            className={`tab-btn ${admin.activeTab === "echoSets" ? "active" : ""}`}
            onClick={() => admin.handleTabChange("echoSets")}
          >
            Эхо Сеты
          </button>
        )}
        {(admin.isAdmin || admin.isTiermake) && (
          <button
            className={`tab-btn ${admin.activeTab === "tierlist" ? "active" : ""}`}
            onClick={() => admin.handleTabChange("tierlist")}
          >
            Тир-лист
          </button>
        )}
        {(admin.isAdmin || admin.isTiermake) && (
          <button
            className={`tab-btn ${admin.activeTab === "settings" ? "active" : ""}`}
            onClick={() => admin.handleTabChange("settings")}
          >
            Настройки
          </button>
        )}
      </div>

      <div className="admin-content">
        <div className="admin-form-container">
          <h2>
            {admin.editingId
              ? "Редактировать"
              : admin.activeTab === "settings"
                ? "Сохранить"
                : "Добавить"}{" "}
            {admin.activeTab === "settings"
              ? "настройки"
              : admin.activeTab === "mechanics"
                ? `механику: ${admin.mechanicForm.title}`
                : admin.activeTab === "weapons"
                  ? `оружие: ${admin.weaponForm.name}`
                  : admin.activeTab === "echoSets"
                    ? "эхо сет"
                    : admin.activeTab === "tierlist"
                      ? `тир-лист: ${admin.tierListForm.name}`
                      : `персонажа: ${admin.resonatorForm.name}`}
          </h2>

          <form onSubmit={admin.handleSubmit} className="admin-form">
            {admin.activeTab === "resonators" && (
              <ResonatorForm
                form={admin.resonatorForm}
                onChange={admin.handleResonatorChange}
                setForm={admin.setResonatorForm}
                allResonators={admin.resonators}
                allEchoSets={admin.echoSets}
              />
            )}

            {admin.activeTab === "weapons" && (
              <WeaponForm
                form={admin.weaponForm}
                onChange={admin.handleWeaponChange}
                setForm={admin.setWeaponForm}
              />
            )}

            {admin.activeTab === "mechanics" && (
              <MechanicForm
                form={admin.mechanicForm}
                onChange={admin.handleMechanicChange}
                setForm={admin.setMechanicForm}
              />
            )}

            {admin.activeTab === "echoSets" && (
              <EchoSetForm
                form={admin.echoSetForm}
                onChange={admin.handleEchoSetChange}
                setForm={admin.setEchoSetForm}
              />
            )}

            {admin.activeTab === "tierlist" && (
              <TierListForm
                form={admin.tierListForm}
                setForm={admin.setTierListForm}
                activeCycleIndex={admin.activeCycleIndex}
                allResonators={admin.resonators}
                globalTagRegistry={admin.globalTagRegistry}
                moveTierListRow={admin.moveTierListRow}
                addCycle={admin.addCycle}
                removeCycle={admin.removeCycle}
                updateCycleName={admin.updateCycleName}
                switchCycle={admin.switchCycle}
                updateCurrentCycleRows={admin.updateCurrentCycleRows}
                registerTag={admin.registerTag}
              />
            )}

            {admin.activeTab === "settings" && (
              <SettingsForm
                form={admin.settingsForm}
                onChange={admin.handleSettingsChange}
                setForm={admin.setSettingsForm}
                resonators={admin.resonators}
                settingsError={admin.settingsError}
                loading={admin.loading}
                refreshSettings={admin.refreshSettings}
                handleAddResonatorToBanner={admin.handleAddResonatorToBanner}
                handleRemoveResonatorFromBanner={
                  admin.handleRemoveResonatorFromBanner
                }
              />
            )}

            <div className="form-actions">
              <button
                type="submit"
                disabled={admin.isSubmitting || admin.loading}
              >
                {admin.isSubmitting
                  ? "Сохранение..."
                  : admin.loading && admin.activeTab === "settings"
                    ? "Загрузка..."
                    : admin.editingId && admin.activeTab !== "settings"
                      ? "Обновить"
                      : "Сохранить"}
              </button>
              {admin.editingId && admin.activeTab !== "settings" && (
                <button
                  type="button"
                  onClick={admin.resetForms}
                  className="btn-cancel"
                  disabled={admin.isSubmitting}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-container">
          <h2>
            Список:{" "}
            {admin.activeTab === "resonators"
              ? "Персонажи"
              : admin.activeTab === "weapons"
                ? "Оружие"
                : admin.activeTab === "mechanics"
                  ? "Механики"
                  : admin.activeTab === "echoSets"
                    ? "Эхо Сеты"
                    : admin.activeTab === "tierlist"
                      ? "Тир-листы"
                      : "Настройки"}
          </h2>
          {admin.activeTab !== "settings" && admin.activeTab !== "tierlist" && (
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={admin.searchTerm}
                onChange={e => admin.setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
            </div>
          )}
          {admin.activeTab === "settings" ? (
            <div className="settings-info">
              <p>
                Глобальные настройки сайта. Изменения применяются ко всем
                пользователям.
              </p>
              {admin.settingsError && (
                <p className="error-text">
                  ⚠️ {admin.settingsError}. Попробуйте обновить страницу.
                </p>
              )}
            </div>
          ) : admin.activeTab === "tierlist" ? (
            <ul className="admin-list">
              {admin.filteredList.length > 0 ? (
                admin.filteredList.map((item: TierList) => (
                  <li key={item.id} className="admin-list-item">
                    <div className="admin-info">
                      <strong>{item.name}</strong>
                      <span className="admin-meta">
                        {item.cycles?.length || 0} цикл(ов)
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button
                        onClick={() => admin.handleEdit(item)}
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      {admin.isAdmin && (
                        <button
                          onClick={() => admin.handleDelete(item.id!)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : admin.loading ? (
                <li className="admin-list-empty">Загрузка...</li>
              ) : (
                <li className="admin-list-empty">Ничего не найдено</li>
              )}
            </ul>
          ) : (
            <ul className="admin-list">
              {admin.filteredList.length > 0 ? (
                admin.filteredList.map((item: any) => (
                  <li key={item.id} className="admin-list-item">
                    <img
                      src={item.resonatorImg || item.img}
                      alt={item.name || item.title}
                      className="admin-thumb"
                      onError={e => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.png"
                      }}
                    />
                    <div className="admin-info">
                      <strong>{item.name || item.title}</strong>
                      {item.engName && (
                        <span className="eng-name">({item.engName})</span>
                      )}
                      <span className="admin-meta">
                        {item.element ||
                          item.type ||
                          (admin.activeTab === "echoSets" ? "Сет" : "Механика")}
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button
                        onClick={() => admin.handleEdit(item)}
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      {admin.isAdmin && (
                        <button
                          onClick={() => admin.handleDelete(item.id)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : admin.loading ? (
                <li className="admin-list-empty">Загрузка...</li>
              ) : (
                <li className="admin-list-empty">Ничего не найдено</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
