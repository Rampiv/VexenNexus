import React, { useState, useCallback, useRef, useEffect } from "react"
import type { Resonator } from "../../types/resonator"
import type { TierListRow, ResonatorSettings } from "../../types/TierList"
import "./TierListEditor.scss"

interface TierListEditorProps {
  rows: TierListRow[]
  setRows: (
    rows: TierListRow[] | ((prev: TierListRow[]) => TierListRow[]),
  ) => void
  allResonators: Resonator[]
}

type DragData = {
  resonatorId: string
  source: "pool" | "row"
  sourceRowIndex?: number
  sourceIndex?: number
}

export const TierListEditor: React.FC<TierListEditorProps> = ({
  rows,
  setRows,
  allResonators,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragOverRowIndex, setDragOverRowIndex] = useState<number | null>(null)

  // Состояние для модального окна
  const [modalOpen, setModalOpen] = useState(false)
  const [modalResonatorId, setModalResonatorId] = useState<string | null>(null)
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null)
  const [modalSettings, setModalSettings] = useState<ResonatorSettings>({
    status: "neutral",
    tags: [],
  })

  const containerRefs = useRef<(HTMLDivElement | null)[]>([])

  const usedResonatorIds = rows.flatMap(row => row.resonatorIds)
  const availableResonators = allResonators.filter(
    r => !usedResonatorIds.includes(r.id || ""),
  )

  const getResonatorById = useCallback(
    (id: string) => allResonators.find(r => r.id === id),
    [allResonators],
  )

  const getRarityColor = (rarity: number | undefined): string => {
    switch (rarity) {
      case 5:
        return "#ffc947"
      default:
        return "#a078ff"
    }
  }

  // === Row Handlers ===
  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        rating: `Tier ${prev.length + 1}`,
        ratingColor: "#4a4a4a",
        ratingImg: "",
        resonatorIds: [],
      },
    ])
  }

  const handleRemoveRow = (rowIndex: number) => {
    setRows(prev => prev.filter((_, idx) => idx !== rowIndex))
    if (editingRow === rowIndex) setEditingRow(null)
  }

  const handleRowSettingChange = (
    rowIndex: number,
    field: string,
    value: string,
  ) => {
    setRows(prev =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [field]: value } : row,
      ),
    )
  }

  // === Modal Handlers ===
  const openSettingsModal = (resonatorId: string, rowIndex: number) => {
    const row = rows[rowIndex]
    const existingSettings = row?.resonatorSettings?.[resonatorId]

    setModalResonatorId(resonatorId)
    setModalRowIndex(rowIndex)
    setModalSettings(existingSettings || { status: "neutral", tags: [] })
    setModalOpen(true)
  }

  const closeSettingsModal = () => {
    setModalOpen(false)
    setModalResonatorId(null)
    setModalRowIndex(null)
    setModalSettings({ status: "neutral", tags: [] })
  }

  const saveModalSettings = () => {
    if (!modalResonatorId || modalRowIndex === null) return

    setRows(prev =>
      prev.map((row, idx) => {
        if (idx !== modalRowIndex) return row

        return {
          ...row,
          resonatorSettings: {
            ...row.resonatorSettings,
            [modalResonatorId]: modalSettings,
          },
        }
      }),
    )
    closeSettingsModal()
  }

  const addTag = () => {
    setModalSettings(prev => ({
      ...prev,
      tags: [
        ...prev.tags,
        { id: crypto.randomUUID(), text: "", color: "#7d40ff" },
      ],
    }))
  }

  const updateTag = (tagId: string, field: "text" | "color", value: string) => {
    setModalSettings(prev => ({
      ...prev,
      tags: prev.tags.map(tag =>
        tag.id === tagId ? { ...tag, [field]: value } : tag,
      ),
    }))
  }

  const removeTag = (tagId: string) => {
    setModalSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId),
    }))
  }

  // === Drag & Drop ===
  const handleDragStart = (
    e: React.DragEvent,
    resonatorId: string,
    source: "pool" | "row",
    sourceRowIndex?: number,
    sourceIndex?: number,
  ) => {
    const data: DragData = { resonatorId, source, sourceRowIndex, sourceIndex }
    e.dataTransfer.setData("application/json", JSON.stringify(data))
    e.dataTransfer.effectAllowed = "move"

    const dragEl = document.createElement("div")
    dragEl.style.width = "64px"
    dragEl.style.height = "64px"
    dragEl.style.borderRadius = "10px"
    dragEl.style.background = "rgba(125, 64, 255, 0.4)"
    dragEl.style.border = "2px solid #7d40ff"
    e.dataTransfer.setDragImage(dragEl, 32, 32)

    setDraggedItem(data)

    requestAnimationFrame(() => {
      if (e.currentTarget) {
        e.currentTarget.classList.add("is-dragging")
      }
    })
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget) {
      e.currentTarget.classList.remove("is-dragging")
    }
    setDraggedItem(null)
    setDragOverIndex(null)
    setDragOverRowIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const calculateDropIndex = (
    e: React.DragEvent,
    container: HTMLDivElement,
  ): number => {
    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left

    const children = Array.from(
      container.querySelectorAll(".dropped-resonator"),
    )

    if (children.length === 0) return 0

    let minDistance = Infinity
    let insertIndex = 0

    children.forEach((child, index) => {
      const childRect = child.getBoundingClientRect()
      const childCenterX = childRect.left - rect.left + childRect.width / 2
      const distance = Math.abs(mouseX - childCenterX)

      if (distance < minDistance) {
        minDistance = distance
        if (mouseX < childCenterX) {
          insertIndex = index
        } else {
          insertIndex = index + 1
        }
      }
    })

    return insertIndex
  }

  const handleDropOnRow = (
    e: React.DragEvent,
    targetRowIndex: number,
    container: HTMLDivElement,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const targetIndex = calculateDropIndex(e, container)

    try {
      const rawData = e.dataTransfer.getData("application/json")
      if (!rawData) return

      const { resonatorId, source, sourceRowIndex }: DragData =
        JSON.parse(rawData)

      setRows(prev => {
        if (targetRowIndex < 0 || targetRowIndex >= prev.length) return prev

        const targetRow = prev[targetRowIndex]
        if (!targetRow) return prev

        if (source === "row" && sourceRowIndex === targetRowIndex) {
          const currentSourceIndex = targetRow.resonatorIds.indexOf(resonatorId)
          if (currentSourceIndex === -1) return prev

          if (currentSourceIndex === targetIndex) {
            return prev.map((row, idx) =>
              idx === targetRowIndex
                ? { ...row, resonatorIds: [...row.resonatorIds] }
                : row,
            )
          }

          const newIds = [...targetRow.resonatorIds]
          newIds.splice(currentSourceIndex, 1)

          const adjustedTargetIndex =
            currentSourceIndex < targetIndex ? targetIndex - 1 : targetIndex

          const safeIndex = Math.max(
            0,
            Math.min(adjustedTargetIndex, newIds.length),
          )
          newIds.splice(safeIndex, 0, resonatorId)

          return prev.map((row, idx) =>
            idx === targetRowIndex ? { ...row, resonatorIds: newIds } : row,
          )
        }

        let newRows = [...prev]

        if (
          source === "row" &&
          sourceRowIndex !== undefined &&
          sourceRowIndex !== targetRowIndex &&
          sourceRowIndex < prev.length
        ) {
          const sourceRow = newRows[sourceRowIndex]
          if (sourceRow) {
            newRows[sourceRowIndex] = {
              ...sourceRow,
              resonatorIds: sourceRow.resonatorIds.filter(
                id => id !== resonatorId,
              ),
            }
          }
        }

        const targetRowUpdated = newRows[targetRowIndex]
        let newResonatorIds = [...targetRowUpdated.resonatorIds].filter(
          id => id !== resonatorId,
        )

        const safeIndex = Math.max(
          0,
          Math.min(targetIndex, newResonatorIds.length),
        )
        newResonatorIds.splice(safeIndex, 0, resonatorId)

        newRows = newRows.map((row, idx) =>
          idx === targetRowIndex
            ? { ...row, resonatorIds: newResonatorIds }
            : row,
        )

        return newRows
      })
    } catch (err) {
      console.error("Drop error:", err)
    }

    setDragOverIndex(null)
    setDragOverRowIndex(null)
  }

  const handleContainerDragOver = (
    e: React.DragEvent,
    rowIndex: number,
    container: HTMLDivElement,
  ) => {
    e.preventDefault()
    const index = calculateDropIndex(e, container)
    setDragOverIndex(index)
    setDragOverRowIndex(rowIndex)
  }

  const handleRemoveFromRow = (rowIndex: number, resonatorId: string) => {
    setRows(prev =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              resonatorIds: row.resonatorIds.filter(id => id !== resonatorId),
            }
          : row,
      ),
    )
  }

  // Закрытие модального окна по клику вне его
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettingsModal()
    }

    if (modalOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [modalOpen])

  // === Рендер ===
  return (
    <div className="tierlist-editor">
      <div className="tierlist-rows-container">
        {rows.map((row, rowIndex) => {
          const draggedResonator = draggedItem
            ? getResonatorById(draggedItem.resonatorId)
            : null

          return (
            <div
              key={row.id}
              className="tierlist-row"
              style={{ "--row-color": row.ratingColor } as React.CSSProperties}
              onDragOver={handleDragOver}
            >
              {/* Левая секция */}
              <div className="tierlist-row-label">
                <div
                  className="rating-badge"
                  style={{ backgroundColor: row.ratingColor }}
                >
                  {row.ratingImg ? (
                    <img
                      src={row.ratingImg}
                      alt={row.rating}
                      className="rating-img"
                    />
                  ) : (
                    <span className="rating-text">{row.rating}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-settings"
                  onClick={() =>
                    setEditingRow(editingRow === rowIndex ? null : rowIndex)
                  }
                  aria-label="Настроить ряд"
                >
                  ⚙️
                </button>

                {editingRow === rowIndex && (
                  <div className="settings-panel">
                    <div className="settings-field">
                      <label>Название</label>
                      <input
                        type="text"
                        value={row.rating}
                        onChange={e =>
                          handleRowSettingChange(
                            rowIndex,
                            "rating",
                            e.target.value,
                          )
                        }
                        placeholder="S, A, B..."
                      />
                    </div>
                    <div className="settings-field">
                      <label>Цвет</label>
                      <input
                        type="color"
                        value={row.ratingColor || "#4a4a4a"}
                        onChange={e =>
                          handleRowSettingChange(
                            rowIndex,
                            "ratingColor",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="settings-field">
                      <label>ИЛИ изображение</label>
                      <input
                        type="text"
                        value={row.ratingImg || ""}
                        onChange={e =>
                          handleRowSettingChange(
                            rowIndex,
                            "ratingImg",
                            e.target.value,
                          )
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Правая секция с персонажами */}
              <div className="tierlist-row-dropper">
                {row.resonatorIds.length === 0 ? (
                  <div
                    className="drop-hint"
                    onDragOver={e => handleDragOver(e)}
                    onDrop={e => {
                      handleDropOnRow(
                        e,
                        rowIndex,
                        e.currentTarget as HTMLDivElement,
                      )
                    }}
                  >
                    Перетащите персонажа сюда
                  </div>
                ) : (
                  <div
                    className="dropped-resonators"
                    ref={el => {
                      containerRefs.current[rowIndex] = el
                    }}
                    onDragOver={e =>
                      handleContainerDragOver(e, rowIndex, e.currentTarget)
                    }
                    onDrop={e => handleDropOnRow(e, rowIndex, e.currentTarget)}
                  >
                    {row.resonatorIds.map((id, index) => {
                      const res = getResonatorById(id)
                      if (!res) return null

                      const settings = row.resonatorSettings?.[id]
                      const showInsertBefore =
                        dragOverRowIndex === rowIndex && dragOverIndex === index

                      return (
                        <React.Fragment key={id}>
                          {showInsertBefore && (
                            <div className="drop-indicator" />
                          )}

                          <div
                            className={`dropped-resonator ${
                              draggedItem?.resonatorId === id &&
                              draggedItem?.source === "row" &&
                              draggedItem?.sourceRowIndex === rowIndex &&
                              draggedItem?.sourceIndex === index
                                ? "is-dragging"
                                : ""
                            }`}
                            draggable={true}
                            onDragStart={e =>
                              handleDragStart(e, id, "row", rowIndex, index)
                            }
                            onDragEnd={handleDragEnd}
                            style={
                              {
                                "--rarity-color": getRarityColor(res.rarity),
                              } as React.CSSProperties
                            }
                          >
                            <img
                              src={res.resonatorImgMini || res.resonatorImg}
                              alt={res.name}
                              className="resonator-thumb"
                              onError={e => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder-character.png"
                              }}
                            />

                            {/* Кнопка удаления */}
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => handleRemoveFromRow(rowIndex, id)}
                              aria-label={`Удалить ${res.name}`}
                            >
                              ×
                            </button>

                            {/* Кнопка настроек (шестерёнка) */}
                            <button
                              type="button"
                              className="btn-settings-resonator"
                              onClick={() => openSettingsModal(id, rowIndex)}
                              aria-label={`Настройки ${res.name}`}
                              title="Настройки персонажа"
                            >
                              ⚙️
                            </button>
                          </div>

                          {showInsertBefore === false &&
                            dragOverRowIndex === rowIndex &&
                            dragOverIndex === index + 1 && (
                              <div className="drop-indicator" />
                            )}
                        </React.Fragment>
                      )
                    })}

                    {dragOverRowIndex === rowIndex &&
                      dragOverIndex === row.resonatorIds.length && (
                        <div className="drop-indicator" />
                      )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-delete-row"
                onClick={() => handleRemoveRow(rowIndex)}
                aria-label="Удалить ряд"
              >
                ✕
              </button>
            </div>
          )
        })}

        <button type="button" onClick={handleAddRow} className="btn-add-row">
          +
        </button>
      </div>

      {/* === Пул персонажей === */}
      <div className="resonator-pool">
        <div className="resonator-grid">
          {availableResonators.map(res => (
            <div
              key={res.id}
              className="resonator-card"
              draggable={true}
              onDragStart={e => handleDragStart(e, res.id || "", "pool")}
              onDragEnd={handleDragEnd}
              title={`${res.name}`}
              style={
                {
                  "--rarity-color": getRarityColor(res.rarity),
                } as React.CSSProperties
              }
            >
              <img
                src={res.resonatorImgMini || res.resonatorImg}
                alt={res.name}
                className="resonator-thumb"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder-character.png"
                }}
              />
              <span className="resonator-name">{res.name}</span>
            </div>
          ))}
          {availableResonators.length === 0 && (
            <p className="pool-empty">Все персонажи уже распределены</p>
          )}
        </div>
      </div>

      {/* === Модальное окно настроек персонажа === */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeSettingsModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Настройки персонажа</h3>
              <button
                type="button"
                className="modal-close"
                onClick={closeSettingsModal}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Выбор статуса */}
              <div className="modal-section">
                <label className="modal-label">Статус персонажа</label>
                <div className="status-options">
                  <label
                    className={`status-option ${modalSettings.status === "up" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="up"
                      checked={modalSettings.status === "up"}
                      onChange={() =>
                        setModalSettings(prev => ({ ...prev, status: "up" }))
                      }
                    />
                    <span className="status-label status-up">
                      <img src='https://i.ibb.co/LzYrsD31/strelka-zelenaya.png' alt="картинка up" />
                    </span>
                  </label>
                  <label
                    className={`status-option ${modalSettings.status === "neutral" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="neutral"
                      checked={modalSettings.status === "neutral"}
                      onChange={() =>
                        setModalSettings(prev => ({
                          ...prev,
                          status: "neutral",
                        }))
                      }
                    />
                    <span className="status-label status-neutral">
                      → neutral
                    </span>
                  </label>
                  <label
                    className={`status-option ${modalSettings.status === "down" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="down"
                      checked={modalSettings.status === "down"}
                      onChange={() =>
                        setModalSettings(prev => ({ ...prev, status: "down" }))
                      }
                    />
                    <span className="status-label status-down">
                      <img src='https://i.ibb.co/M5j5ybmd/strelka-krasnaya.png' alt="картинка down" />
                    </span>
                  </label>
                </div>
              </div>

              {/* Теги */}
              <div className="modal-section">
                <div className="modal-section-header">
                  <label className="modal-label">Теги</label>
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={addTag}
                  >
                    + Добавить тег
                  </button>
                </div>

                {modalSettings.tags.length === 0 ? (
                  <p className="tags-empty">Нет добавленных тегов</p>
                ) : (
                  <div className="tags-list">
                    {modalSettings.tags.map((tag, index) => (
                      <div key={tag.id} className="tag-item">
                        <input
                          type="text"
                          placeholder="Название тега..."
                          value={tag.text}
                          onChange={e =>
                            updateTag(tag.id, "text", e.target.value)
                          }
                          className="tag-input"
                          maxLength={20}
                        />
                        <input
                          type="color"
                          value={tag.color}
                          onChange={e =>
                            updateTag(tag.id, "color", e.target.value)
                          }
                          className="tag-color"
                          title="Цвет тега"
                        />
                        <button
                          type="button"
                          className="btn-remove-tag"
                          onClick={() => removeTag(tag.id)}
                          aria-label="Удалить тег"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={closeSettingsModal}
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={saveModalSettings}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
