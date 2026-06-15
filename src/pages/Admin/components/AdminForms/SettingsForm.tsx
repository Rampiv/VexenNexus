import type React from "react"
import { InputGroup } from "../AdminUI"
import {
  useAdminData,
  type SettingsForm as SettingsFormType,
} from "../../hooks/useAdminData"
import type { Resonator } from "../../../../types/resonator"
import { DescriptionEditor } from "../../../../components"

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
      {admin.isAdmin && (
        <>
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
                          ;(e.target as HTMLImageElement).src =
                            "/placeholder.png"
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
          <InputGroup
            label="Ссылка на Preview Image (Баннер)"
            name="preview_img"
            value={form.preview_img || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="Ссылка на Filter Image (Фильтр)"
            name="filter_img"
            value={form.filter_img || ""}
            onChange={onChange}
            placeholder="https://..."
          />
        </>
      )}

      {(admin.isAdmin || admin.isTiermake) && (
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
