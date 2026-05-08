import type React from "react"
import { useMemo, useState } from "react"
import "./EchoResonatorPicker.scss"
import type { Resonator } from "../../types/resonator"

interface EchoResonatorPickerProps {
  allResonators: Resonator[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export const EchoResonatorPicker: React.FC<EchoResonatorPickerProps> = ({
  allResonators,
  selectedIds,
  onSelectionChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredResonators = useMemo(() => {
    if (!searchTerm) return allResonators
    const term = searchTerm.toLowerCase()
    return allResonators.filter(
      r =>
        r.name?.toLowerCase().includes(term) ||
        r.engName?.toLowerCase().includes(term),
    )
  }, [allResonators, searchTerm])

  const toggleResonator = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const clearSelection = () => onSelectionChange([])

  return (
    <div className="echo-resonator-picker">
      <div className="echo-resonator-picker__header">
        <h3>Выберите персонажей</h3>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="btn-clear-selection"
          >
            Очистить ({selectedIds.length})
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Поиск персонажа..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="echo-resonator-picker__search"
      />

      <div className="echo-resonator-picker__grid">
        {filteredResonators.map(resonator => {
          const isSelected = selectedIds.includes(resonator.id || "")
          return (
            <button
              key={resonator.id}
              type="button"
              onClick={() => resonator.id && toggleResonator(resonator.id)}
              className={`echo-resonator-card ${isSelected ? "selected" : ""}`}
            >
              <div className="echo-resonator-card__image-wrapper">
                <img
                  src={resonator.resonatorImgMini || resonator.resonatorImg}
                  alt={resonator.name}
                  className="echo-resonator-card__img"
                />
                {isSelected && (
                  <span className="echo-resonator-card__checkmark">✓</span>
                )}
              </div>
              <span className="echo-resonator-card__name">
                {resonator.name}
              </span>
              <span className="echo-resonator-card__element">
                {resonator.element}
              </span>
            </button>
          )
        })}
      </div>

      {filteredResonators.length === 0 && (
        <p className="echo-resonator-picker__empty">Персонажи не найдены</p>
      )}
    </div>
  )
}
