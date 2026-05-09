import type React from "react"
import type { Resonator } from "../../types/resonator"
import type { TierListRow } from "../../types/TierList"
import { CustomSelect, type SelectOption } from "../CustomSelect/CustomSelect"
import "./TierListEditor.scss"

interface TierListEditorProps {
  rows: TierListRow[]
  setRows: (
    rows: TierListRow[] | ((prev: TierListRow[]) => TierListRow[]),
  ) => void
  allResonators: Resonator[]
}

export const TierListEditor: React.FC<TierListEditorProps> = ({
  rows,
  setRows,
  allResonators,
}) => {
  // Собираем все ID персонажей, которые уже добавлены в любой ряд тир-листа
  const usedResonatorIds = rows.flatMap(row => row.resonatorIds)

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      { id: crypto.randomUUID(), rating: "A", ratingImg: "", resonatorIds: [] },
    ])
  }

  const handleRemoveRow = (rowIndex: number) => {
    setRows(prev => prev.filter((_, idx) => idx !== rowIndex))
  }

  const handleRowChange = (
    rowIndex: number,
    field: keyof TierListRow,
    value: any,
  ) => {
    setRows(prev =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [field]: value } : row,
      ),
    )
  }

  const handleResonatorSelect = (rowIndex: number, resonatorId: string) => {
    setRows(prev =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? { ...row, resonatorIds: [...row.resonatorIds, resonatorId] }
          : row,
      ),
    )
  }

  const handleResonatorRemove = (rowIndex: number, resonatorId: string) => {
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

  // Формируем опции для селекта, исключая уже использованных персонажей
  const getResonatorOptions = (currentRowIds: string[]): SelectOption[] => {
    return allResonators
      .filter(r => {
        const resonatorId = r.id || ""
        // Исключаем, если персонаж уже в любом ряду ИЛИ в текущем ряду (для безопасности)
        return !usedResonatorIds.includes(resonatorId) && !currentRowIds.includes(resonatorId)
      })
      .map(r => ({
        value: r.id || "",
        label: `${r.name} (${r.engName})`,
        imgSrc: r.resonatorImgMini || r.resonatorImg,
      }))
  }

  return (
    <div className="tierlist-editor">
      {rows.map((row, rowIndex) => (
        <div key={row.id} className="tierlist-row">
          <div className="tierlist-row-header">
            <h4>Ряд #{rowIndex + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemoveRow(rowIndex)}
              className="btn-delete-row"
              aria-label="Удалить ряд"
            >
              🗑️
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`rating-${row.id}`}>Рейтинг (текст)</label>
              <input
                id={`rating-${row.id}`}
                type="text"
                value={row.rating}
                onChange={e =>
                  handleRowChange(rowIndex, "rating", e.target.value)
                }
                placeholder="S, A, B, C..."
              />
            </div>
            <div className="form-group">
              <label htmlFor={`ratingImg-${row.id}`}>ИЛИ ссылка на изображение</label>
              <input
                id={`ratingImg-${row.id}`}
                type="text"
                value={row.ratingImg || ""}
                onChange={e =>
                  handleRowChange(rowIndex, "ratingImg", e.target.value)
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Персонажи в этом тире:</label>
            
            {/* Кастомный селектор с превью через CustomSelect */}
            <CustomSelect
              options={getResonatorOptions(row.resonatorIds)}
              value=""
              onChange={resonatorId => handleResonatorSelect(rowIndex, resonatorId)}
              placeholder="+ Добавить персонажа..."
              className="resonator-custom-select"
            />

            {/* Список выбранных персонажей с превью */}
            <ul className="selected-resonators">
              {row.resonatorIds.map(id => {
                const res = allResonators.find(r => r.id === id)
                return res ? (
                  <li key={id} className="selected-resonator-item">
                    <img
                      src={res.resonatorImgMini || res.resonatorImg}
                      alt={res.name}
                      className="resonator-thumb"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder-character.png"
                      }}
                    />
                    <div className="resonator-info">
                      <span className="resonator-name">{res.name}</span>
                      {res.engName && (
                        <span className="resonator-eng">{res.engName}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleResonatorRemove(rowIndex, id)}
                      className="btn-remove-resonator"
                      aria-label={`Удалить ${res.name}`}
                    >
                      ×
                    </button>
                  </li>
                ) : null
              })}
            </ul>
            
            {row.resonatorIds.length === 0 && (
              <p className="empty-resonators-hint">
                Персонажи ещё не добавлены. Выберите из списка выше.
              </p>
            )}
          </div>
        </div>
      ))}

      <button type="button" onClick={handleAddRow} className="btn-add-tier-row">
        + Добавить ряд
      </button>
    </div>
  )
}