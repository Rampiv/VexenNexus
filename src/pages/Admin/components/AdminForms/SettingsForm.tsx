import type React from "react"
import { InputGroup } from "../AdminUI"
import {
  useAdminData,
  type SettingsForm as SettingsFormType,
} from "../../hooks/useAdminData"
import type { Resonator } from "../../../../types/resonator"
import { DescriptionEditor } from "../../../../components"
import type {
  RolePermissions,
  SettingsFields,
  TabKey,
} from "../../../../types/roles"

interface SettingsFormProps {
  form: SettingsFormType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  setForm: React.Dispatch<React.SetStateAction<SettingsFormType>>
  resonators: Resonator[]
  settingsError: string | null
  loading: boolean
  refreshSettings: () => void
  handleAddResonatorToBanner: (resonatorId: string) => void
  handleRemoveResonatorFromBanner: (resonatorId: string) => void
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  form,
  onChange,
  setForm,
  resonators,
  settingsError,
  loading,
  refreshSettings,
  handleAddResonatorToBanner,
  handleRemoveResonatorFromBanner,
}) => {
  const admin = useAdminData()
  const canEdit = (field: keyof SettingsFields) =>
    admin.hasFieldPermission("settings", field)

  // Список всех доступных вкладок для чекбоксов
  const allTabs: TabKey[] = [
    "resonators",
    "weapons",
    "mechanics",
    "echoSets",
    "tierlist",
    "settings",
  ]

  const fieldGroups = {
    resonators: [
      "name",
      "engName",
      "element",
      "rarity",
      "weaponType",
      "resonatorImg",
      "resonatorImgMini",
      "resonatorImgBanner",
      "resonatorPreview",
      "resonatorYTLink",
      "resonatorImgGuide",
      "resonatorImgDetails",
      "descr",
      "result",
      "teams",
      "echoSets",
    ],
    echoSets: [
      "name",
      "engName",
      "img",
      "patchNumber",
      "index",
      "onePartsDescr",
      "twoPartsDescr",
      "fivePartsDescr",
      "threePartsDescr",
      "important",
    ],
    weapons: [
      "name",
      "engName",
      "type",
      "rarity",
      "stat1",
      "stat2",
      "img",
      "description",
    ],
    mechanics: ["title", "engName", "img", "paragraphs"],
    tierlist: ["name", "nameImg", "cycles", "rows"],
    settings: [
      "nextBannerDate",
      "futureResonatorIds",
      "preview_img",
      "filter_img",
      "tierListDescriptions",
    ],
  }

  // Компонент для отрисовки секции прав
  const renderPermissionsSection = (
    title: string,
    formType: keyof RolePermissions["fields"],
    fields: string[],
  ) => (
    <>
      <h4>{title}</h4>
      <div className="checkbox-grid">
        {fields.map(field => (
          <label key={field} className="checkbox-label">
            <input
              type="checkbox"
              checked={
                !!(admin.roleForm.permissions?.fields?.[formType] as any)?.[
                  field
                ]
              }
              onChange={e => {
                const isChecked = e.target.checked
                admin.setRoleForm(prev => {
                  const currentFields = (prev.permissions?.fields as any) || {}
                  const currentFormFields = currentFields[formType] || {}
                  const newFormFields = {
                    ...currentFormFields,
                    [field]: isChecked,
                  }

                  const currentTabs = prev.permissions?.tabs || {
                    resonators: false,
                    weapons: false,
                    mechanics: false,
                    echoSets: false,
                    tierlist: false,
                    settings: false,
                  }

                  return {
                    ...prev,
                    permissions: {
                      tabs: currentTabs,
                      fields: { ...currentFields, [formType]: newFormFields },
                    },
                  }
                })
              }}
            />
            {field}
          </label>
        ))}
      </div>
    </>
  )

  return (
    <div className="settings-container">
      {settingsError && (
        <div className="settings-error-banner">
          ⚠️ {settingsError}
          <button type="button" onClick={refreshSettings} className="btn-retry">
            Повторить
          </button>
        </div>
      )}

      {canEdit("nextBannerDate") && (
        <div className="form-group">
          <label>Дата следующего баннера</label>
          <input
            type="datetime-local"
            name="nextBannerDate"
            value={
              form.nextBannerDate
                ? new Date(form.nextBannerDate).toISOString().slice(0, 16)
                : ""
            }
            onChange={e =>
              setForm(prev => ({
                ...prev,
                nextBannerDate: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </div>
      )}
      {canEdit("futureResonatorIds") && (
        <div className="form-group">
          <label>Персонажи на будущем баннере</label>
          <div className="resonator-selector">
            <select
              onChange={e => {
                if (e.target.value) handleAddResonatorToBanner(e.target.value)
                e.target.value = ""
              }}
              className="resonator-select"
              disabled={resonators.length === 0}
            >
              <option value="">
                {resonators.length !== 0 && "Выберите персонажа..."}
              </option>
              {resonators.map(r => (
                <option
                  key={r.id}
                  value={r.id}
                  disabled={form.futureResonatorIds.includes(r.id || "")}
                >
                  {r.name} ({r.engName})
                </option>
              ))}
            </select>
          </div>
          {resonators.length === 0 && (
            <p className="hint">⏳ Персонажи загружаются...</p>
          )}
          <ul className="selected-resonators">
            {form.futureResonatorIds.map(id => {
              const res = resonators.find(r => r.id === id)
              return (
                res && (
                  <li key={id} className="selected-resonator-item">
                    <img
                      src={res.resonatorImg}
                      alt={res.name}
                      className="resonator-thumb"
                      onError={e => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.png"
                      }}
                    />
                    <span>{res.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResonatorFromBanner(id)}
                      className="btn-remove-resonator"
                    >
                      ×
                    </button>
                  </li>
                )
              )
            })}
          </ul>
        </div>
      )}
      {canEdit("preview_img") && (
        <InputGroup
          label="Ссылка на Preview Image (Баннер)"
          name="preview_img"
          value={form.preview_img || ""}
          onChange={onChange}
          placeholder="https://..."
        />
      )}

      {canEdit("filter_img") && (
        <InputGroup
          label="Ссылка на Filter Image (Фильтр)"
          name="filter_img"
          value={form.filter_img || ""}
          onChange={onChange}
          placeholder="https://..."
        />
      )}

      {canEdit("tierListDescriptions") && (
        <>
          <div className="form-group">
            <label>Глобальные описания для тир-листов</label>
            {form.tierListDescriptions.map(desc => (
              <DescriptionEditor
                key={desc.id}
                title={desc.title}
                content={desc.content}
                onTitleChange={newTitle =>
                  setForm(prev => ({
                    ...prev,
                    tierListDescriptions: prev.tierListDescriptions.map(d =>
                      d.id === desc.id ? { ...d, title: newTitle } : d,
                    ),
                  }))
                }
                onContentChange={newContent =>
                  setForm(prev => ({
                    ...prev,
                    tierListDescriptions: prev.tierListDescriptions.map(d =>
                      d.id === desc.id ? { ...d, content: newContent } : d,
                    ),
                  }))
                }
                onRemove={() =>
                  setForm(prev => ({
                    ...prev,
                    tierListDescriptions: prev.tierListDescriptions.filter(
                      d => d.id !== desc.id,
                    ),
                  }))
                }
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setForm(prev => ({
                  ...prev,
                  tierListDescriptions: [
                    ...prev.tierListDescriptions,
                    { id: crypto.randomUUID(), title: "", content: "" },
                  ],
                }))
              }
              className="btn-add-description"
            >
              + Добавить описание
            </button>
            <p className="hint">
              Эти описания будут отображаться на <strong>всех</strong> страницах
              тир-листов.
            </p>
          </div>
        </>
      )}

      {/* Секция управления ролями */}
      {admin.isAdmin && (
        <div className="form-group role-management-section">
          <h3>Управление Ролями</h3>
          <div className="role-list">
            {admin.roles.map(role => (
              <div key={role.id} className="role-item">
                <span>{role.name}</span>
                <div className="role-actions">
                  <button
                    type="button"
                    onClick={() => admin.handleEditRole(role)}
                    className="btn-edit-role"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => admin.handleDeleteRole(role.id)}
                    className="btn-delete-role"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={admin.startCreatingRole}
              className="btn-add-role"
            >
              + Создать новую роль
            </button>
          </div>

          {admin.editingId && (
            <div onSubmit={admin.handleRoleSubmit} className="role-editor-form">
              <InputGroup
                label="Название роли"
                name="name"
                value={admin.roleForm.name || ""}
                onChange={e =>
                  admin.setRoleForm(prev => ({ ...prev, name: e.target.value }))
                }
              />
              <InputGroup
                label="Пароль для входа"
                name="password"
                type="text"
                value={admin.roleForm.password || ""}
                onChange={e =>
                  admin.setRoleForm(prev => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Введите пароль"
              />
              <label className="checkbox-label super-admin-checkbox">
                <input
                  type="checkbox"
                  checked={!!admin.roleForm.isSuperAdmin}
                  onChange={e =>
                    admin.setRoleForm(prev => ({
                      ...prev,
                      isSuperAdmin: e.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>Супер-админ</strong> — полный доступ ко всему (в обход
                  всех настроек прав)
                </span>
              </label>
              
              <div className="permissions-grid">
                <h4>Доступ к вкладкам</h4>
                <div className="checkbox-grid">
                  {allTabs.map(tab => (
                    <label key={tab} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!admin.roleForm.permissions?.tabs?.[tab]}
                        onChange={e => {
                          const isChecked = e.target.checked
                          admin.setRoleForm(prev => {
                            const currentTabs = prev.permissions?.tabs || {
                              resonators: false,
                              weapons: false,
                              mechanics: false,
                              echoSets: false,
                              tierlist: false,
                              settings: false,
                            }
                            const newTabs = { ...currentTabs, [tab]: isChecked }
                            const currentFields = prev.permissions?.fields || {
                              resonators: {},
                              echoSets: {},
                              weapons: {},
                              mechanics: {},
                              tierlist: {},
                              settings: {},
                            }
                            return {
                              ...prev,
                              permissions: {
                                tabs: newTabs,
                                fields: currentFields,
                              },
                            }
                          })
                        }}
                      />
                      {tab}
                    </label>
                  ))}
                </div>

                {renderPermissionsSection(
                  "Поля Персонажей (Resonators)",
                  "resonators",
                  fieldGroups.resonators,
                )}
                {renderPermissionsSection(
                  "Поля Оружия (Weapons)",
                  "weapons",
                  fieldGroups.weapons,
                )}
                {renderPermissionsSection(
                  "Поля Механик (Mechanics)",
                  "mechanics",
                  fieldGroups.mechanics,
                )}
                {renderPermissionsSection(
                  "Поля Эхо Сетов (EchoSets)",
                  "echoSets",
                  fieldGroups.echoSets,
                )}
                {renderPermissionsSection(
                  "Тир-листы (TierList)",
                  "tierlist",
                  fieldGroups.tierlist,
                )}
                {renderPermissionsSection(
                  "Настройки (Settings)",
                  "settings",
                  fieldGroups.settings,
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={admin.handleRoleSubmit}
                  disabled={admin.isSubmitting}
                >
                  {admin.isSubmitting ? "Сохранение..." : "Сохранить роль"}
                </button>
                <button
                  type="button"
                  onClick={admin.cancelRoleForm}
                  className="btn-cancel"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="settings-actions">
        <button
          type="button"
          onClick={refreshSettings}
          className="btn-refresh-settings"
          disabled={loading}
        >
          🔄 Обновить настройки
        </button>
        {loading && <span className="loading-indicator">Загрузка...</span>}
      </div>
    </div>
  )
}
