import type React from "react"
import { useMemo, useState } from "react"
import type { EchoSet } from "../../types/echoSet"
import type {
  CostSelection,
  EchoSetSelection,
  EchoCost,
} from "../../types/resonator"
import type { SelectOption } from "../CustomSelect/CustomSelect"
import { CustomSelect } from "../CustomSelect/CustomSelect"
import "./EchoSetSelector.scss"

const STATS_BY_COST = {
  1: ["HP%", "ATK%", "DEF%", "HP"] as const,
  3: [
    "HP%",
    "ATK%",
    "DEF%",
    "Electro DMG%",
    "Fusion DMG%",
    "Glacio DMG%",
    "Havoc DMG%",
    "Aero DMG%",
    "Spectro DMG%",
    "Energy Regen",
  ] as const,
  4: [
    "HP%",
    "ATK%",
    "DEF%",
    "CRIT Rate",
    "CRIT DMG",
    "Healing Bonus",
  ] as const,
} as const

const COSTS: EchoCost[] = [1, 3, 4]

const emptySelection: EchoSetSelection = {
  id: "",
  cost1: { lock: [], discard: [] },
  cost3: { lock: [], discard: [] },
  cost4: { lock: [], discard: [] },
}

interface EchoSetSelectorProps {
  selections: EchoSetSelection[]
  setSelections: React.Dispatch<React.SetStateAction<EchoSetSelection[]>>
  allEchoSets: EchoSet[]
}

// Тип для старых данных (до миграции)
interface LegacyEchoSetSelection {
  id?: string
  lock?: string[]
  discard?: string[]
  cost1?: CostSelection
  cost3?: CostSelection
  cost4?: CostSelection
}

const getCostSelection = (
  selection: EchoSetSelection,
  cost: EchoCost,
): CostSelection => {
  const key = `cost${cost}` as const
  return selection[key] || { lock: [], discard: [] }
}

const migrateEchoSetSelection = (
  oldSelection: LegacyEchoSetSelection,
): EchoSetSelection => {
  // Если уже в новом формате
  if (oldSelection.cost1 || oldSelection.cost3 || oldSelection.cost4) {
    return {
      id: oldSelection.id || "",
      cost1: oldSelection.cost1 || { lock: [], discard: [] },
      cost3: oldSelection.cost3 || { lock: [], discard: [] },
      cost4: oldSelection.cost4 || { lock: [], discard: [] },
    }
  }
  // Старый формат: мигрируем lock/discard в cost4
  return {
    id: oldSelection.id || "",
    cost1: { lock: [], discard: [] },
    cost3: { lock: [], discard: [] },
    cost4: {
      lock: oldSelection.lock || [],
      discard: oldSelection.discard || [],
    },
  }
}

export const EchoSetSelector: React.FC<EchoSetSelectorProps> = ({
  selections,
  setSelections,
  allEchoSets,
}) => {
  const [activeCosts, setActiveCosts] = useState<Record<string, boolean>>({})

  const migratedSelections = useMemo(
    () => selections.map(migrateEchoSetSelection),
    [selections],
  )

  const echoSetOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Выберите эхо-сет..." },
      ...allEchoSets
        .filter((set) => set.id)
        .map((set) => ({
          value: set.id!,
          label: set.name || "Без названия",
          imgSrc: set.img,
        })),
    ],
    [allEchoSets],
  )

  const getAvailableStats = (
    cost: EchoCost,
    selection: EchoSetSelection,
  ): SelectOption[] => {
    const costSelection = getCostSelection(selection, cost)
    const availableStatsForCost = STATS_BY_COST[cost]
    const usedStats = new Set([...costSelection.lock, ...costSelection.discard])

    return [
      { value: "", label: "Выберите стат..." },
      ...availableStatsForCost
        .filter((stat) => !usedStats.has(stat))
        .map((stat) => ({ value: stat, label: stat })),
    ]
  }

  const addSelection = () => {
    setSelections((prev) => [...prev, { ...emptySelection }])
  }

  const removeSelection = (index: number) => {
    setSelections((prev) => prev.filter((_, i) => i !== index))
    setActiveCosts((prev) => {
      const next = { ...prev }
      COSTS.forEach((cost) => {
        delete next[`${index}-${cost}`]
      })
      return next
    })
  }

  const handleEchoSetChange = (index: number, echoSetId: string) => {
    setSelections((prev) =>
      prev.map((sel, i) => (i === index ? { ...sel, id: echoSetId } : sel)),
    )
  }

  const toggleCostSection = (index: number, cost: EchoCost) => {
    const key = `${index}-${cost}`
    setActiveCosts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleStat = (
    index: number,
    cost: EchoCost,
    field: "lock" | "discard",
    stat: string,
  ) => {
    setSelections((prev) =>
      prev.map((sel, i) => {
        if (i !== index) return sel

        const costKey = `cost${cost}` as const
        const costSelection = getCostSelection(sel, cost)
        const current = costSelection[field]
        const exists = current.includes(stat)

        const newLock = [...costSelection.lock]
        const newDiscard = [...costSelection.discard]

        if (field === "lock") {
          if (exists) {
            const idx = newLock.indexOf(stat)
            if (idx > -1) newLock.splice(idx, 1)
          } else {
            newLock.push(stat)
            const discardIdx = newDiscard.indexOf(stat)
            if (discardIdx > -1) newDiscard.splice(discardIdx, 1)
          }
        } else {
          if (exists) {
            const idx = newDiscard.indexOf(stat)
            if (idx > -1) newDiscard.splice(idx, 1)
          } else {
            newDiscard.push(stat)
            const lockIdx = newLock.indexOf(stat)
            if (lockIdx > -1) newLock.splice(lockIdx, 1)
          }
        }

        return {
          ...sel,
          [costKey]: { lock: newLock, discard: newDiscard },
        }
      }),
    )
  }

  const removeStat = (
    index: number,
    cost: EchoCost,
    field: "lock" | "discard",
    stat: string,
  ) => {
    setSelections((prev) =>
      prev.map((sel, i) => {
        if (i !== index) return sel

        const costKey = `cost${cost}` as const
        const costSelection = getCostSelection(sel, cost)

        return {
          ...sel,
          [costKey]: {
            ...costSelection,
            [field]: costSelection[field].filter((s) => s !== stat),
          },
        }
      }),
    )
  }

  const hasCostSelections = (
    selection: EchoSetSelection,
    cost: EchoCost,
  ): boolean => {
    const costSelection = getCostSelection(selection, cost)
    return costSelection.lock.length > 0 || costSelection.discard.length > 0
  }

  const renderStatSection = (
    index: number,
    cost: EchoCost,
    field: "lock" | "discard",
    selection: EchoSetSelection,
  ) => {
    const costSelection = getCostSelection(selection, cost)
    const title = field === "lock" ? "Залочить" : "Дискард"
    const hint =
      field === "lock"
        ? "Статы, которые должны быть"
        : "Статы, которых избегать"

    return (
      <div className="stat-section" key={field}>
        <div className="stat-section__header">
          <span className={`stat-section__title ${field}`}>{title}</span>
          <span className="stat-section__hint">{hint}</span>
        </div>
        <div className="stat-selection">
          <CustomSelect
            options={getAvailableStats(cost, selection)}
            value=""
            onChange={(val) => val && toggleStat(index, cost, field, val)}
            placeholder="+ Добавить стат"
            className="stat-select"
          />
          <div className="selected-stats">
            {costSelection[field].map((stat) => (
              <span key={stat} className={`stat-chip ${field}`}>
                {stat}
                <button
                  type="button"
                  onClick={() => removeStat(index, cost, field, stat)}
                  className="stat-chip__remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderCostSection = (index: number, cost: EchoCost) => {
    const selection = migratedSelections[index]
    const costSelection = getCostSelection(selection, cost)
    const key = `${index}-${cost}`
    const isActive = activeCosts[key]
    const hasSelections = hasCostSelections(selection, cost)

    return (
      <div className="cost-section" key={cost}>
        <button
          type="button"
          onClick={() => toggleCostSection(index, cost)}
          className={`cost-section__header ${hasSelections ? "has-selections" : ""} ${isActive ? "active" : ""}`}
        >
          <span className="cost-section__title">{cost}-Cost Echo</span>
          <span className="cost-section__stats">
            {costSelection.lock.length > 0 && (
              <span className="stat-count lock">
                Lock: {costSelection.lock.length}
              </span>
            )}
            {costSelection.discard.length > 0 && (
              <span className="stat-count discard">
                Discard: {costSelection.discard.length}
              </span>
            )}
          </span>
          <span className="cost-section__arrow">{isActive ? "▼" : "▶"}</span>
        </button>

        {isActive && (
          <div className="cost-section__content">
            {renderStatSection(index, cost, "lock", selection)}
            {renderStatSection(index, cost, "discard", selection)}
          </div>
        )}
      </div>
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

      {migratedSelections.length === 0 && (
        <p className="echo-set-selector__empty">
          Нажмите "+ Добавить сет", чтобы добавить рекомендации
        </p>
      )}

      {migratedSelections.map((selection, index) => (
        <div key={index} className="echo-set-block">
          <div className="echo-set-block__header">
            <div className="echo-set-block__select-wrapper">
              <CustomSelect
                options={echoSetOptions}
                value={selection.id}
                onChange={(val) => handleEchoSetChange(index, val)}
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

          {selection.id && (
            <div className="echo-set-block__content">
              {COSTS.map((cost) => renderCostSection(index, cost))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}