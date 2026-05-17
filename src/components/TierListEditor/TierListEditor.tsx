import React, { useState } from "react"
import type { Resonator } from "../../types/resonator"
import type { TierListRow } from "../../types/TierList"
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

type DropTarget = {
  rowIndex: number
  index: number
}

export const TierListEditor: React.FC<TierListEditorProps> = ({
  rows,
  setRows,
  allResonators,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)

  const usedResonatorIds = rows.flatMap(row => row.resonatorIds)
  const availableResonators = allResonators.filter(
    r => !usedResonatorIds.includes(r.id || ""),
  )

  const getResonatorById = (id: string) => allResonators.find(r => r.id === id)

  const getRarityColor = (rarity: number | undefined): string => {
    switch (rarity) {
      case 5:
        return "#ffc947" // золотой
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

    // Создаём простой визуальный образ для перетаскивания
    const dragEl = document.createElement("div")
    dragEl.style.width = "64px"
    dragEl.style.height = "64px"
    dragEl.style.borderRadius = "10px"
    dragEl.style.background = "rgba(125, 64, 255, 0.4)"
    dragEl.style.border = "2px solid #7d40ff"
    e.dataTransfer.setDragImage(dragEl, 32, 32)

    setDraggedItem(data)

    // Добавляем класс для визуального эффекта (с небольшой задержкой)
    requestAnimationFrame(() => {
      e.currentTarget.classList.add("is-dragging")
    })
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("is-dragging")
    setDraggedItem(null)
    setDropTarget(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropOnIndex = (
    e: React.DragEvent,
    targetRowIndex: number,
    targetIndex: number,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const rawData = e.dataTransfer.getData("application/json")
      if (!rawData) return
      const { resonatorId, source, sourceRowIndex, sourceIndex }: DragData =
        JSON.parse(rawData)

      setRows(prev => {
        const newRows = [...prev]
        const targetRow = { ...newRows[targetRowIndex] }
        let newResonatorIds = [...targetRow.resonatorIds]

        // Сценарий 1: Сортировка внутри того же ряда
        if (
          source === "row" &&
          sourceRowIndex === targetRowIndex &&
          sourceIndex !== undefined
        ) {
          if (sourceIndex === targetIndex) return prev
          newResonatorIds = newResonatorIds.filter(
            (_, idx) => idx !== sourceIndex,
          )
          const adjustedTargetIndex =
            sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
          newResonatorIds.splice(adjustedTargetIndex, 0, resonatorId)
          targetRow.resonatorIds = newResonatorIds
          newRows[targetRowIndex] = targetRow
          return newRows
        }

        // Сценарий 2: Из другого ряда или пула
        if (
          source === "row" &&
          sourceRowIndex !== undefined &&
          sourceRowIndex !== targetRowIndex
        ) {
          const sourceRow = { ...newRows[sourceRowIndex] }
          sourceRow.resonatorIds = sourceRow.resonatorIds.filter(
            id => id !== resonatorId,
          )
          newRows[sourceRowIndex] = sourceRow
        }

        // Удаляем, если уже есть в целевом ряду (для перемещения)
        if (newResonatorIds.includes(resonatorId)) {
          newResonatorIds = newResonatorIds.filter(id => id !== resonatorId)
        }

        // Вставляем на новую позицию
        newResonatorIds.splice(targetIndex, 0, resonatorId)
        targetRow.resonatorIds = newResonatorIds
        newRows[targetRowIndex] = targetRow
        return newRows
      })
    } catch (err) {
      console.error("Drop error:", err)
    }
    setDropTarget(null)
  }

  const handleDropOnRow = (e: React.DragEvent, targetRowIndex: number) => {
    e.preventDefault()
    handleDropOnIndex(
      e,
      targetRowIndex,
      rows[targetRowIndex]?.resonatorIds.length || 0,
    )
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

  // === Рендер ===
  return (
    <div className="tierlist-editor">
      <div className="tierlist-rows-container">
        {rows.map((row, rowIndex) => {
          const showGhost = dropTarget?.rowIndex === rowIndex && draggedItem
          const ghostIndex = showGhost ? dropTarget!.index : -1
          const draggedResonator = draggedItem
            ? getResonatorById(draggedItem.resonatorId)
            : null

          return (
            <div
              key={row.id}
              className="tierlist-row"
              style={{ "--row-color": row.ratingColor } as React.CSSProperties}
              onDragOver={handleDragOver}
              onDrop={e => handleDropOnRow(e, rowIndex)}
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
                {row.resonatorIds.length === 0 && !dropTarget ? (
                  <div className="drop-hint">Перетащите персонажа сюда</div>
                ) : (
                  <div className="dropped-resonators">
                    {/* Слот ПЕРЕД первым элементом */}
                    <div
                      className="drop-slot"
                      onDragOver={e => {
                        handleDragOver(e)
                        setDropTarget({ rowIndex, index: 0 })
                      }}
                      onDrop={e => handleDropOnIndex(e, rowIndex, 0)}
                    />

                    {row.resonatorIds.map((id, index) => {
                      const res = getResonatorById(id)
                      if (!res) return null

                      const isDraggingThis =
                        draggedItem?.source === "row" &&
                        draggedItem?.sourceRowIndex === rowIndex &&
                        draggedItem?.sourceIndex === index

                      // Показываем призрак ПЕРЕД этим элементом, если это целевая позиция
                      const showGhostBefore = showGhost && ghostIndex === index

                      return (
                        <React.Fragment key={id}>
                          {/* Ghost Preview */}
                          {showGhostBefore && draggedResonator && (
                            <div className="ghost-preview">
                              <img
                                src={
                                  draggedResonator.resonatorImgMini ||
                                  draggedResonator.resonatorImg
                                }
                                alt={draggedResonator.name}
                                className="resonator-thumb ghost"
                                onError={e => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder-character.png"
                                }}
                              />
                            </div>
                          )}

                          {/* Сам персонаж */}
                          <div
                            className={`dropped-resonator ${isDraggingThis ? "is-dragging" : ""}`}
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
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => handleRemoveFromRow(rowIndex, id)}
                              aria-label={`Удалить ${res.name}`}
                            >
                              ×
                            </button>
                          </div>

                          {/* Слот ПОСЛЕ этого элемента */}
                          <div
                            className="drop-slot"
                            onDragOver={e => {
                              handleDragOver(e)
                              setDropTarget({ rowIndex, index: index + 1 })
                            }}
                            onDrop={e =>
                              handleDropOnIndex(e, rowIndex, index + 1)
                            }
                          />
                        </React.Fragment>
                      )
                    })}

                    {/* Ghost в конце ряда */}
                    {showGhost &&
                      ghostIndex === row.resonatorIds.length &&
                      draggedResonator && (
                        <div className="ghost-preview">
                          <img
                            src={
                              draggedResonator.resonatorImgMini ||
                              draggedResonator.resonatorImg
                            }
                            alt={draggedResonator.name}
                            className="resonator-thumb ghost"
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder-character.png"
                            }}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Кнопка удаления ряда */}
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
        <h4>Доступные персонажи</h4>
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
    </div>
  )
}
