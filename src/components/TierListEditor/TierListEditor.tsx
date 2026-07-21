import React, { useState, useCallback, useRef, useEffect, useMemo } from "react"
import type { Resonator } from "../../types/resonator"
import type {
  TierListRow,
  ResonatorSettings,
  TierListTag,
} from "../../types/TierList"
import "./TierListEditor.scss"
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../../firebase/config"

interface TierListEditorProps {
  rows: TierListRow[]
  setRows: (
    rows: TierListRow[] | ((prev: TierListRow[]) => TierListRow[]),
  ) => void
  allResonators: Resonator[]
  availableTags?: TierListTag[]
  onTagCreated?: (tag: TierListTag) => void
  onTagRegistered?: (tag: TierListTag) => void
  onMoveRow?: (direction: "up" | "down", rowIndex: number) => void
  canMoveUp?: (index: number) => boolean
  canMoveDown?: (index: number) => boolean
}

type Role = "dps" | "hybrid" | "support"
type DragData = {
  resonatorId: string
  source: "pool" | "row"
  sourceRowIndex?: number
  sourceRole?: Role
  sourceIndex?: number
}

export const TierListEditor: React.FC<TierListEditorProps> = ({
  rows,
  setRows,
  allResonators,
  availableTags = [],
  onTagCreated,
  onTagRegistered,
  onMoveRow,
  canMoveUp,
  canMoveDown,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<{
    rowIndex: number
    role: Role
    index: number
  } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalResonatorId, setModalResonatorId] = useState<string | null>(null)
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null)
  const [modalSettings, setModalSettings] = useState<ResonatorSettings>({
    status: "neutral",
    tags: [],
  })

  const [editableTags, setEditableTags] = useState<
    Array<{ id: string; text: string; color: string }>
  >([])
  const [selectedTagId, setSelectedTagId] = useState<string>("")

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // прокрутка во время drag и drop
  const isDraggingRef = useRef(false)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const SCROLL_THRESHOLD = 100
  const SCROLL_SPEED = 10

  // теги
  const [globalTagPool, setGlobalTagPool] = useState<TierListTag[]>([])

  useEffect(() => {
    let cancelled = false

    const fetchAndMigrateTags = async () => {
      try {
        const tagMap = new Map<string, TierListTag>()

        // 1. Сначала загружаем теги из новой глобальной коллекции (самый быстрый способ)
        const tagsSnapshot = await getDocs(collection(db, "tags"))
        tagsSnapshot.forEach(docSnap => {
          const data = docSnap.data()
          if (data?.id) {
            tagMap.set(data.id, {
              id: data.id,
              name: data.name || "",
              color: data.color || "#7d40ff",
            })
          }
        })

        // 2. Загружаем старые данные из tier_lists для миграции
        const tierListsSnapshot = await getDocs(collection(db, "tier_lists"))
        const tagsToMigrate: TierListTag[] = []

        tierListsSnapshot.forEach(docSnap => {
          const data = docSnap.data()
          const rows = data?.rows || []

          rows.forEach((row: any) => {
            if (row?.resonatorSettings) {
              Object.values(row.resonatorSettings).forEach((settings: any) => {
                if (settings?.tags && Array.isArray(settings.tags)) {
                  settings.tags.forEach((tag: any) => {
                    if (tag?.id && !tagMap.has(tag.id)) {
                      const newTag: TierListTag = {
                        id: tag.id,
                        name: tag.text || tag.name || "",
                        color: tag.color || "#7d40ff",
                      }
                      tagMap.set(tag.id, newTag)
                      tagsToMigrate.push(newTag) // Сохраняем для фоновой миграции
                    }
                  })
                }
              })
            }
          })
        })

        // 3. Фоновая миграция: сохраняем найденные старые теги в новую коллекцию `tags`
        // Это гарантирует, что при следующем запуске шаг 2 будет работать быстрее
        if (tagsToMigrate.length > 0) {
          const migrationPromises = tagsToMigrate.map(tag =>
            setDoc(doc(db, "tags", tag.id), tag, { merge: true }),
          )
          // Выполняем в фоне, не блокируя UI (await не обязателен здесь, но можно оставить)
          Promise.all(migrationPromises).catch(err =>
            console.warn("Не удалось мигрировать некоторые теги:", err),
          )
        }

        if (!cancelled) {
          setGlobalTagPool(Array.from(tagMap.values()))
        }
      } catch (err) {
        console.error("Ошибка загрузки и миграции тегов:", err)
      }
    }

    fetchAndMigrateTags()

    return () => {
      cancelled = true
    }
  }, [])

  const handleDeleteGlobalTag = async (tagId: string) => {
    const isUsed = rows.some(row =>
      Object.values(row.resonatorSettings || {}).some(settings =>
        settings.tags?.some(tag => tag.id === tagId),
      ),
    )

    if (isUsed) {
      alert(
        "Этот тег используется в одном или нескольких тир-листах. Удалите его сначала из всех тир-листов.",
      )
      return
    }
    
    try {
      await deleteDoc(doc(db, "tags", tagId))

      setGlobalTagPool(prev => prev.filter(tag => tag.id !== tagId))

      setModalSettings(prev => ({
        ...prev,
        tags: (prev.tags || []).filter(tag => tag.id !== tagId),
      }))

      setEditableTags(prev => prev.filter(tag => tag.id !== tagId))

      console.log(`Тег с ID ${tagId} успешно удален`)
    } catch (err) {
      console.error("Ошибка при удалении тега:", err)
    }
  }

  const getResonatorById = useCallback(
    (id: string) => allResonators.find(r => r.id === id),
    [allResonators],
  )

  const getRarityColor = (rarity: number | undefined): string => {
    return rarity === 5 ? "#ffc947" : "#a078ff"
  }

  const getResonatorsByRole = (row: TierListRow, role: Role): string[] => {
    switch (role) {
      case "dps":
        return row.dpsResonatorIds || []
      case "hybrid":
        return row.hybridResonatorIds || []
      case "support":
        return row.supportResonatorIds || []
      default:
        return []
    }
  }

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        rating: `Tier ${prev.length + 1}`,
        ratingColor: "#4a4a4a",
        ratingImg: "",
        dpsResonatorIds: [],
        hybridResonatorIds: [],
        supportResonatorIds: [],
      },
    ])
  }

  const handleRemoveRow = (rowIndex: number) => {
    setRows(prev => prev.filter((_, idx) => idx !== rowIndex))
    if (editingRow === rowIndex) setEditingRow(null)
  }

  const handleMoveRow = (direction: "up" | "down", rowIndex: number) => {
    onMoveRow?.(direction, rowIndex)
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

  const openSettingsModal = (resonatorId: string, rowIndex: number) => {
    const row = rows[rowIndex]
    const existingSettings = row?.resonatorSettings?.[resonatorId]

    setModalResonatorId(resonatorId)
    setModalRowIndex(rowIndex)
    setModalSettings(existingSettings || { status: "neutral", tags: [] })
    setEditableTags([])
    setSelectedTagId("")
    setModalOpen(true)
  }

  const closeSettingsModal = () => {
    setModalOpen(false)
    setModalResonatorId(null)
    setModalRowIndex(null)
    setModalSettings({ status: "neutral", tags: [] })
    setEditableTags([])
    setSelectedTagId("")
  }

  const saveModalSettings = () => {
    if (!modalResonatorId || modalRowIndex === null) return

    const allTags = [
      ...(modalSettings.tags || []),
      ...editableTags.filter(t => t.text.trim()),
    ]

    setRows(prev =>
      prev.map((row, idx) => {
        if (idx !== modalRowIndex) return row
        return {
          ...row,
          resonatorSettings: {
            ...row.resonatorSettings,
            [modalResonatorId]: {
              ...modalSettings,
              tags: allTags,
            },
          },
        }
      }),
    )

    editableTags
      .filter(t => t.text.trim())
      .forEach(async tag => {
        const newTag: TierListTag = {
          id: tag.id,
          name: tag.text,
          color: tag.color,
        }
        onTagCreated?.(newTag)
        onTagRegistered?.(newTag)

        // Сохраняем тег в глобальную коллекцию tags
        try {
          await setDoc(doc(db, "tags", tag.id), newTag)
          setGlobalTagPool(prev => {
            if (prev.some(t => t.id === newTag.id)) return prev
            return [...prev, newTag]
          })
        } catch (err) {
          console.error("Не удалось сохранить тег в Firestore:", err)
        }
      })

    closeSettingsModal()
  }

  const handleAddTagFromSelect = () => {
    if (!selectedTagId) return
    const tag = globalTagPool.find(t => t.id === selectedTagId)
    if (!tag) return

    const exists = [...(modalSettings.tags || []), ...editableTags].some(
      t => t.id === tag.id,
    )
    if (exists) {
      setSelectedTagId("")
      return
    }

    setEditableTags(prev => [
      ...prev,
      { id: tag.id, text: tag.name, color: tag.color },
    ])
    setSelectedTagId("")
    onTagRegistered?.(tag)
  }

  const handleAddEditableTag = () => {
    setEditableTags(prev => [
      ...prev,
      { id: crypto.randomUUID(), text: "", color: "#7d40ff" },
    ])
  }

  const updateEditableTag = (
    tagId: string,
    field: "text" | "color",
    value: string,
  ) => {
    setEditableTags(prev =>
      prev.map(tag => (tag.id === tagId ? { ...tag, [field]: value } : tag)),
    )
  }

  const removeEditableTag = (tagId: string) => {
    setEditableTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  const updateSavedTag = (
    tagId: string,
    field: "text" | "color",
    value: string,
  ) => {
    setModalSettings(prev => ({
      ...prev,
      tags: (prev.tags || []).map(tag =>
        tag.id === tagId ? { ...tag, [field]: value } : tag,
      ),
    }))
  }

  const removeSavedTag = (tagId: string) => {
    setModalSettings(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag.id !== tagId),
    }))
  }

  const handleDragStart = (
    e: React.DragEvent,
    resonatorId: string,
    source: "pool" | "row",
    sourceRowIndex?: number,
    sourceRole?: Role,
    sourceIndex?: number,
  ) => {
    const data: DragData = {
      resonatorId,
      source,
      sourceRowIndex,
      sourceRole,
      sourceIndex,
    }
    e.dataTransfer.setData("application/json", JSON.stringify(data))
    e.dataTransfer.effectAllowed = "move"

    const dragEl = document.createElement("div")
    dragEl.style.cssText =
      "width:64px;height:64px;border-radius:10px;background:rgba(125,64,255,0.4);border:2px solid #7d40ff"
    e.dataTransfer.setDragImage(dragEl, 32, 32)

    setDraggedItem(data)
    isDraggingRef.current = true

    document.addEventListener("dragend", handleGlobalDragEnd)

    requestAnimationFrame(() => {
      if (e.currentTarget) e.currentTarget.classList.add("is-dragging")
    })
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget) e.currentTarget.classList.remove("is-dragging")
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

    const mouseYAbsolute = e.clientY
    let sameRowChildren: { element: Element; center: number; index: number }[] =
      []

    children.forEach((child, index) => {
      const childRect = child.getBoundingClientRect()
      const childCenterY = childRect.top + childRect.height / 2
      if (Math.abs(mouseYAbsolute - childCenterY) < childRect.height / 2) {
        const childCenterX = childRect.left - rect.left + childRect.width / 2
        sameRowChildren.push({ element: child, center: childCenterX, index })
      }
    })

    if (sameRowChildren.length === 0) return children.length
    sameRowChildren.sort((a, b) => a.center - b.center)

    let insertIndex = sameRowChildren[sameRowChildren.length - 1].index + 1
    for (let i = 0; i < sameRowChildren.length; i++) {
      if (mouseX < sameRowChildren[i].center) {
        insertIndex = sameRowChildren[i].index
        break
      }
    }
    return insertIndex
  }

  const handleDropOnColumn = (
    e: React.DragEvent,
    targetRowIndex: number,
    targetRole: Role,
    container: HTMLDivElement,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    const targetIndex = calculateDropIndex(e, container)

    setTimeout(() => {
      if (!isDraggingRef.current) cleanupDragListeners()
    }, 0)

    try {
      const rawData = e.dataTransfer.getData("application/json")
      if (!rawData) return

      const { resonatorId, source, sourceRowIndex, sourceRole }: DragData =
        JSON.parse(rawData)

      setRows(prev => {
        if (targetRowIndex < 0 || targetRowIndex >= prev.length) return prev
        const currentTargetRow = prev[targetRowIndex]
        if (!currentTargetRow) return prev

        if (
          source === "row" &&
          sourceRowIndex === targetRowIndex &&
          sourceRole === targetRole
        ) {
          const currentIds = getResonatorsByRole(currentTargetRow, targetRole)
          const currentSourceIndex = currentIds.indexOf(resonatorId)
          if (currentSourceIndex === -1) return prev
          if (currentSourceIndex === targetIndex)
            return prev.map((row, idx) =>
              idx === targetRowIndex ? { ...row } : row,
            )

          const newIds = [...currentIds]
          newIds.splice(currentSourceIndex, 1)
          const adjustedTargetIndex =
            currentSourceIndex < targetIndex ? targetIndex - 1 : targetIndex
          const safeIndex = Math.max(
            0,
            Math.min(adjustedTargetIndex, newIds.length),
          )
          newIds.splice(safeIndex, 0, resonatorId)

          return prev.map((row, idx) => {
            if (idx !== targetRowIndex) return row
            const updatedRow = { ...row }
            if (targetRole === "dps") updatedRow.dpsResonatorIds = newIds
            else if (targetRole === "hybrid")
              updatedRow.hybridResonatorIds = newIds
            else updatedRow.supportResonatorIds = newIds
            return updatedRow
          })
        }

        let newRows = [...prev]

        if (source === "row" && sourceRowIndex !== undefined) {
          const sourceRow = newRows[sourceRowIndex]
          if (sourceRow) {
            const updatedSourceRow = { ...sourceRow }
            if (sourceRole === "dps")
              updatedSourceRow.dpsResonatorIds = (
                sourceRow.dpsResonatorIds || []
              ).filter(id => id !== resonatorId)
            else if (sourceRole === "hybrid")
              updatedSourceRow.hybridResonatorIds = (
                sourceRow.hybridResonatorIds || []
              ).filter(id => id !== resonatorId)
            else if (sourceRole === "support")
              updatedSourceRow.supportResonatorIds = (
                sourceRow.supportResonatorIds || []
              ).filter(id => id !== resonatorId)
            newRows[sourceRowIndex] = updatedSourceRow
          }
        }

        const targetRow = newRows[targetRowIndex]
        let newResonatorIds = [
          ...(getResonatorsByRole(targetRow, targetRole) || []),
        ].filter(id => id !== resonatorId)
        const safeIndex = Math.max(
          0,
          Math.min(targetIndex, newResonatorIds.length),
        )
        newResonatorIds.splice(safeIndex, 0, resonatorId)

        newRows = newRows.map((row, idx) => {
          if (idx !== targetRowIndex) return row
          const updatedRow = { ...row }
          if (targetRole === "dps") updatedRow.dpsResonatorIds = newResonatorIds
          else if (targetRole === "hybrid")
            updatedRow.hybridResonatorIds = newResonatorIds
          else updatedRow.supportResonatorIds = newResonatorIds
          return updatedRow
        })

        return newRows
      })
    } catch (err) {
      console.error("Drop error:", err)
    }
    setDragOverIndex(null)
  }

  const handleContainerDragOver = (
    e: React.DragEvent,
    rowIndex: number,
    role: Role,
    container: HTMLDivElement,
  ) => {
    e.preventDefault()
    const index = calculateDropIndex(e, container)
    setDragOverIndex({ rowIndex, role, index })
  }

  const handleRemoveFromRow = (
    rowIndex: number,
    resonatorId: string,
    role: Role,
  ) => {
    setRows(prev =>
      prev.map((row, idx) => {
        if (idx !== rowIndex) return row
        const updatedRow = { ...row }
        if (role === "dps")
          updatedRow.dpsResonatorIds = (row.dpsResonatorIds || []).filter(
            id => id !== resonatorId,
          )
        else if (role === "hybrid")
          updatedRow.hybridResonatorIds = (row.hybridResonatorIds || []).filter(
            id => id !== resonatorId,
          )
        else
          updatedRow.supportResonatorIds = (
            row.supportResonatorIds || []
          ).filter(id => id !== resonatorId)
        return updatedRow
      }),
    )
  }

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

  // логика прокрутки страницы drag и drop
  const cleanupDragListeners = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
    isDraggingRef.current = false
  }, [])

  const checkAndScroll = useCallback((clientY: number) => {
    const viewportHeight = window.innerHeight
    const scrollTop = window.scrollY
    const cursorY = clientY - scrollTop

    let scrolled = false

    // Прокрутка вверх
    if (cursorY < SCROLL_THRESHOLD && scrollTop > 0) {
      window.scrollBy({ top: -SCROLL_SPEED, behavior: "auto" })
      scrolled = true
    }
    // Прокрутка вниз
    else if (viewportHeight - cursorY < SCROLL_THRESHOLD) {
      window.scrollBy({ top: SCROLL_SPEED, behavior: "auto" })
      scrolled = true
    }

    // Продолжаем интервал только если была прокрутка И всё ещё тащим
    if (scrolled && isDraggingRef.current) {
      scrollIntervalRef.current = setTimeout(() => {
        if (isDraggingRef.current) checkAndScroll(clientY)
      }, 16)
    }
  }, [])

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      checkAndScroll(e.clientY)
    },
    [checkAndScroll],
  )

  const handleGlobalDragEnd = useCallback(() => {
    cleanupDragListeners()
    setDraggedItem(null)
    setDragOverIndex(null)
  }, [cleanupDragListeners])

  useEffect(() => {
    if (!isDraggingRef.current) return

    // Добавляем слушатели
    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("dragend", handleGlobalDragEnd)
    document.addEventListener("mouseup", cleanupDragListeners)

    // Очистка при размонтировании или остановке drag
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("dragend", handleGlobalDragEnd)
      document.removeEventListener("mouseup", cleanupDragListeners)
      cleanupDragListeners()
    }
  }, [handleGlobalMouseMove, handleGlobalDragEnd, cleanupDragListeners])

  return (
    <div className="tierlist-editor">
      <div className="tierlist-rows-container">
        {rows.map((row, rowIndex) => (
          <div
            key={row.id}
            className="tierlist-row"
            style={{ "--row-color": row.ratingColor } as React.CSSProperties}
            onDragOver={handleDragOver}
          >
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

              <div className="row-move-controls">
                <button
                  type="button"
                  className="btn-move-row"
                  disabled={!canMoveUp?.(rowIndex)}
                  onClick={() => handleMoveRow("up", rowIndex)}
                  title="Переместить выше"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="btn-move-row"
                  disabled={!canMoveDown?.(rowIndex)}
                  onClick={() => handleMoveRow("down", rowIndex)}
                  title="Переместить ниже"
                >
                  ▼
                </button>
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

            <div className="tierlist-row-columns">
              {(["dps", "hybrid", "support"] as Role[]).map(role => {
                const roleResonatorIds = getResonatorsByRole(row, role)
                const columnKey = `${rowIndex}-${role}`

                return (
                  <div key={role} className={`tierlist-column column-${role}`}>
                    {rowIndex === 0 && (
                      <div className="column-header">
                        <span className="column-title">
                          {role === "dps"
                            ? "МДД"
                            : role === "hybrid"
                              ? "САП-ДД"
                              : "САППОРТ"}
                        </span>
                      </div>
                    )}

                    <div
                      className="dropped-resonators"
                      ref={el => {
                        containerRefs.current[columnKey] = el
                      }}
                      onDragOver={e =>
                        handleContainerDragOver(
                          e,
                          rowIndex,
                          role,
                          e.currentTarget,
                        )
                      }
                      onDrop={e =>
                        handleDropOnColumn(e, rowIndex, role, e.currentTarget)
                      }
                    >
                      {roleResonatorIds.length === 0 ? (
                        <div className="drop-hint">Перетащите сюда</div>
                      ) : (
                        roleResonatorIds.map((id, index) => {
                          const res = getResonatorById(id)
                          if (!res) return null

                          const settings = row.resonatorSettings?.[id]
                          const showInsertBefore =
                            dragOverIndex?.rowIndex === rowIndex &&
                            dragOverIndex?.role === role &&
                            dragOverIndex?.index === index

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
                                  draggedItem?.sourceRole === role &&
                                  draggedItem?.sourceIndex === index
                                    ? "is-dragging"
                                    : ""
                                }`}
                                draggable={true}
                                onDragStart={e =>
                                  handleDragStart(
                                    e,
                                    id,
                                    "row",
                                    rowIndex,
                                    role,
                                    index,
                                  )
                                }
                                onDragEnd={handleDragEnd}
                                style={
                                  {
                                    "--rarity-color": getRarityColor(
                                      res.rarity,
                                    ),
                                  } as React.CSSProperties
                                }
                              >
                                <img
                                  src={res.resonatorImgMini || res.resonatorImg}
                                  alt={res.name}
                                  className="resonator-thumb"
                                  onError={e => {
                                    ;(e.target as HTMLImageElement).src =
                                      "/placeholder-character.png"
                                  }}
                                />

                                {settings?.status &&
                                  settings.status !== "neutral" && (
                                    <span
                                      className={`status-indicator status-${settings.status}`}
                                      title={
                                        settings.status === "up"
                                          ? "Перспективный"
                                          : "Снижается"
                                      }
                                    >
                                      {settings.status === "up" ? "↑" : "↓"}
                                    </span>
                                  )}

                                <button
                                  type="button"
                                  className="btn-remove"
                                  onClick={() =>
                                    handleRemoveFromRow(rowIndex, id, role)
                                  }
                                  aria-label={`Удалить ${res.name}`}
                                >
                                  ×
                                </button>

                                <button
                                  type="button"
                                  className="btn-settings-resonator"
                                  onClick={() =>
                                    openSettingsModal(id, rowIndex)
                                  }
                                  aria-label={`Настройки ${res.name}`}
                                  title="Настройки персонажа"
                                >
                                  ⚙️
                                </button>

                                {settings?.tags && settings.tags.length > 0 && (
                                  <div className="resonator-tags">
                                    {settings.tags.map(tag => (
                                      <span
                                        key={tag.id}
                                        className="tag-chip"
                                        style={{
                                          color: tag.color,
                                        }}
                                        title={tag.text}
                                      >
                                        {tag.text}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {showInsertBefore === false &&
                                dragOverIndex?.rowIndex === rowIndex &&
                                dragOverIndex?.role === role &&
                                dragOverIndex?.index === index + 1 && (
                                  <div className="drop-indicator" />
                                )}
                            </React.Fragment>
                          )
                        })
                      )}

                      {dragOverIndex?.rowIndex === rowIndex &&
                        dragOverIndex?.role === role &&
                        dragOverIndex?.index === roleResonatorIds.length && (
                          <div className="drop-indicator" />
                        )}
                    </div>
                  </div>
                )
              })}
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
        ))}

        <button type="button" onClick={handleAddRow} className="btn-add-row">
          + Добавить ряд
        </button>
      </div>

      <div className="resonator-pool">
        <h4>Доступные персонажи</h4>
        <div className="resonator-grid">
          {allResonators.map(res => (
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
                  ;(e.target as HTMLImageElement).src =
                    "/placeholder-character.png"
                }}
              />
              <span className="resonator-name">{res.name}</span>
            </div>
          ))}
        </div>
      </div>

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
                    <span className="status-label status-up">↑ UP</span>
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
                      — Нейтрально
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
                    <span className="status-label status-down">↓ DOWN</span>
                  </label>
                </div>
              </div>

              <div className="modal-section">
                <label className="modal-label">Теги</label>

                <div className="tag-select-wrapper">
                  {/* Убрали <select>, теперь здесь правильный div-контейнер */}
                  <div className="global-tags-list">
                    {globalTagPool.length === 0 && (
                      <span
                        style={{
                          color: "#666",
                          fontSize: "0.9rem",
                          padding: "4px",
                        }}
                      >
                        Теги загружаются или отсутствуют...
                      </span>
                    )}

                    {globalTagPool.map(tag => {
                      const exists = [
                        ...(modalSettings.tags || []),
                        ...editableTags,
                      ].some(t => t.id === tag.id)

                      return (
                        <div
                          key={tag.id}
                          className={`global-tag-item ${exists ? "exists" : ""} ${selectedTagId === tag.id ? "selected" : ""}`}
                          onClick={() => {
                            // Разрешаем выбирать только неиспользуемые теги
                            if (!exists) {
                              // Если кликнули на уже выбранный - снимаем выделение, иначе выбираем
                              setSelectedTagId(
                                selectedTagId === tag.id ? "" : tag.id,
                              )
                            }
                          }}
                        >
                          <span style={{ color: tag.color }}>{tag.name}</span>
                          <button
                            type="button"
                            className="btn-remove-tag"
                            onClick={e => {
                              e.stopPropagation() // Чтобы не срабатывал onClick родителя (выбор тега)
                              handleDeleteGlobalTag(tag.id)
                            }}
                            title="Удалить тег из глобального пула"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    className="btn-add-tag-select"
                    onClick={handleAddTagFromSelect}
                    disabled={!selectedTagId}
                    title="Добавить выбранный тег"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-add-tag-inline"
                  onClick={handleAddEditableTag}
                >
                  + Создать новый тег
                </button>

                {modalSettings.tags && modalSettings.tags.length > 0 && (
                  <div className="tags-subsection">
                    <span className="tags-subtitle">Сохранённые:</span>
                    <div className="tags-list">
                      {modalSettings.tags.map(tag => (
                        <div key={tag.id} className="tag-item">
                          <input
                            type="text"
                            placeholder="Название..."
                            value={tag.text}
                            onChange={e =>
                              updateSavedTag(tag.id, "text", e.target.value)
                            }
                            className="tag-input"
                            maxLength={20}
                          />
                          <input
                            type="color"
                            value={tag.color}
                            onChange={e =>
                              updateSavedTag(tag.id, "color", e.target.value)
                            }
                            className="tag-color"
                            title="Цвет тега"
                          />
                          <button
                            type="button"
                            className="btn-remove-tag"
                            onClick={() => removeSavedTag(tag.id)}
                            aria-label="Удалить тег"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editableTags.length > 0 && (
                  <div className="tags-subsection">
                    <span className="tags-subtitle">Новые:</span>
                    <div className="tags-list">
                      {editableTags.map(tag => (
                        <div key={tag.id} className="tag-item new-tag">
                          <input
                            type="text"
                            placeholder="Название тега..."
                            value={tag.text}
                            onChange={e =>
                              updateEditableTag(tag.id, "text", e.target.value)
                            }
                            className="tag-input"
                            maxLength={20}
                            autoFocus
                          />
                          <input
                            type="color"
                            value={tag.color}
                            onChange={e =>
                              updateEditableTag(tag.id, "color", e.target.value)
                            }
                            className="tag-color"
                            title="Цвет тега"
                          />
                          <button
                            type="button"
                            className="btn-remove-tag"
                            onClick={() => removeEditableTag(tag.id)}
                            aria-label="Удалить тег"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {modalSettings.tags?.length === 0 &&
                  editableTags.length === 0 && (
                    <p className="tags-empty">Нет добавленных тегов</p>
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
