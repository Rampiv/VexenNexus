import type React from "react"
import { useMemo } from "react"
import type { EchoSetSelection } from "../../types/resonator"
import type { EchoSet } from "../../types/echoSet"
import type { SelectOption } from "../CustomSelect/CustomSelect"
import { CustomSelect } from "../CustomSelect/CustomSelect"
import "./EchoSetSelector.scss"

// Доступные статы в Wuthering Waves
export const AVAILABLE_STATS = [
  "HP%",
  "ATK%",
  "DEF%",
  "Electro DMG%",
  "Fusion DMG%",
  "Glacio DMG%",
  "Havoc DMG%",
  "Aero DMG%",
  "Spectro DMG%",
  "CRIT Rate",
  "CRIT DMG",
  "Healing Bonus",
  "Energy Regen",
  "ATK",
  "HP",
  "DEF",
] as const

export type StatType = (typeof AVAILABLE_STATS)[number]

interface EchoSetSelectorProps {
  selections: EchoSetSelection[]
  setSelections: React.Dispatch<React.SetStateAction<EchoSetSelection[]>>
  allEchoSets: EchoSet[]
}

const emptySelection: EchoSetSelection = {
  id: "",
  lock: [],
  discard: [],
}

export const EchoSetSelector: React.FC<EchoSetSelectorProps> = ({
  selections,
  setSelections,
  allEchoSets,
}) => {
  // Подготовка опций для селекта эхо-сетов
  const echoSetOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Выберите эхо-сет..." },
      ...allEchoSets
        .filter(set => set.id)
        .map(set => ({
          value: set.id!,
          label: set.name || "Без названия",
          imgSrc: set.img,
        })),
    ],
    [allEchoSets],
  )

  // Подготовка опций для стат
  const statOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Выберите стат..." },
      ...AVAILABLE_STATS.map(stat => ({ value: stat, label: stat })),
    ],
    [],
  )

  // Добавление нового блока эхо-сета
  const addSelection = () => {
    setSelections(prev => [...prev, { ...emptySelection }])
  }

  // Удаление блока
  const removeSelection = (index: number) => {
    setSelections(prev => prev.filter((_, i) => i !== index))
  }

  // Изменение выбранного эхо-сета
  const handleEchoSetChange = (index: number, echoSetId: string) => {
    setSelections(prev =>
      prev.map((sel, i) => (i === index ? { ...sel, id: echoSetId } : sel)),
    )
  }

  // Переключение стата в массиве (lock/discard)
  const toggleStat = (
    index: number,
    field: "lock" | "discard",
    stat: string,
  ) => {
    setSelections(prev =>
      prev.map((sel, i) => {
        if (i !== index) return sel

        const current = sel[field]
        const exists = current.includes(stat)

        // Если стат уже в этом массиве — убираем
        // Если в другом массиве — сначала убираем оттуда
        let newLock = [...sel.lock]
        let newDiscard = [...sel.discard]

        if (field === "lock") {
          if (exists) {
            newLock = newLock.filter(s => s !== stat)
          } else {
            newLock = [...newLock, stat]
            newDiscard = newDiscard.filter(s => s !== stat)
          }
        } else {
          if (exists) {
            newDiscard = newDiscard.filter(s => s !== stat)
          } else {
            newDiscard = [...newDiscard, stat]
            newLock = newLock.filter(s => s !== stat)
          }
        }

        return { ...sel, lock: newLock, discard: newDiscard }
      }),
    )
  }

  // Удаление конкретного стата из массива
  const removeStat = (
    index: number,
    field: "lock" | "discard",
    stat: string,
  ) => {
    setSelections(prev =>
      prev.map((sel, i) => {
        if (i !== index) return sel
        return {
          ...sel,
          [field]: sel[field].filter(s => s !== stat),
        }
      }),
    )
  }

  return (
    <div className="echo-set-selector">
      <div className="echo-set-selector__header">
        <h3>Рекомендуемые эхо-сеты</h3>
        <button
          type="button"
          onClick={addSelection}
          className="btn-add-echo-block"
        >
          + Добавить сет
        </button>
      </div>

      {selections.length === 0 && (
        <p className="echo-set-selector__empty">
          Нажмите "+ Добавить сет", чтобы добавить рекомендации
        </p>
      )}

      {selections.map((selection, index) => {
        return (
          <div key={index} className="echo-set-block">
            {/* Хедер блока: выбор сета + кнопка удаления */}
            <div className="echo-set-block__header">
              <div className="echo-set-block__select-wrapper">
                <CustomSelect
                  options={echoSetOptions}
                  value={selection.id}
                  onChange={val => handleEchoSetChange(index, val)}
                  placeholder="Выберите эхо-сет"
                  className="echo-set-select"
                />
              </div>

              <button
                type="button"
                onClick={() => removeSelection(index)}
                className="btn-remove-block"
                title="Удалить этот блок"
              >
                ✕
              </button>
            </div>

            {/* Контент блока: только если выбран сет */}
            {selection.id && (
              <div className="echo-set-block__content">
                {/* Секция Lock */}
                <div className="stat-section">
                  <div className="stat-section__header">
                    <span className="stat-section__title lock">Залочить</span>
                    <span className="stat-section__hint">
                      Статы, которые должны быть на эхо
                    </span>
                  </div>

                  <div className="stat-selection">
                    <CustomSelect
                      options={statOptions}
                      value=""
                      onChange={val => val && toggleStat(index, "lock", val)}
                      placeholder="+ Добавить стат"
                      className="stat-select"
                    />

                    <div className="selected-stats">
                      {selection.lock.map(stat => (
                        <span key={stat} className="stat-chip lock">
                          {stat}
                          <button
                            type="button"
                            onClick={() => removeStat(index, "lock", stat)}
                            className="stat-chip__remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Секция Discard */}
                <div className="stat-section">
                  <div className="stat-section__header">
                    <span className="stat-section__title discard">Дискард</span>
                    <span className="stat-section__hint">
                      Статы, которых следует избегать
                    </span>
                  </div>

                  <div className="stat-selection">
                    <CustomSelect
                      options={statOptions}
                      value=""
                      onChange={val => val && toggleStat(index, "discard", val)}
                      placeholder="+ Добавить стат"
                      className="stat-select"
                    />

                    <div className="selected-stats">
                      {selection.discard.map(stat => (
                        <span key={stat} className="stat-chip discard">
                          {stat}
                          <button
                            type="button"
                            onClick={() => removeStat(index, "discard", stat)}
                            className="stat-chip__remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
