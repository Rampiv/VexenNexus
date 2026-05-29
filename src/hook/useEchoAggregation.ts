// src/hooks/useEchoAggregation.ts
import { useMemo } from "react"
import type {
  Resonator,
  EchoSetSelection,
  CostSelection,
  EchoCost,
} from "../types/resonator"
import type { EchoSet } from "../types/echoSet"
import type { EchoRecommendation } from "../types/echoApp"

const COSTS: readonly EchoCost[] = [1, 3, 4] as const

// Хелпер для безопасного получения CostSelection
const getCostSelection = (
  selection: EchoSetSelection,
  cost: EchoCost,
): CostSelection => {
  const key = `cost${cost}` as const
  return selection[key]
}

export const useEchoAggregation = (
  selectedResonatorIds: string[],
  allResonators: Resonator[],
  allEchoSets: EchoSet[],
): EchoRecommendation[] => {
  return useMemo(() => {
    if (!selectedResonatorIds.length || !allResonators.length) return []

    const selectedResonators = allResonators.filter(r =>
      r.id && selectedResonatorIds.includes(r.id),
    )

    const aggregated = new Map<string, EchoRecommendation>()

    selectedResonators.forEach(resonator => {
      resonator.echoSets?.forEach(selection => {
        if (!selection.id) return

        const echoSet = allEchoSets.find(set => set.id === selection.id)
        if (!echoSet) return

        if (!aggregated.has(selection.id)) {
          aggregated.set(selection.id, {
            setId: selection.id,
            setName: echoSet.name || "Без названия",
            setImg: echoSet.img,
            resonatorCount: 0,
            lock: {},
            discard: {},
            costStats: {
              1: { lock: {}, discard: {} },
              3: { lock: {}, discard: {} },
              4: { lock: {}, discard: {} },
            },
          })
        }

        const rec = aggregated.get(selection.id)!
        rec.resonatorCount += 1

        // Агрегация по стоимости
        COSTS.forEach(cost => {
          const costSelection = getCostSelection(selection, cost)

          const costStats = rec.costStats?.[cost]
          if (costStats) {
            costSelection.lock.forEach((stat: string) => {
              costStats.lock[stat] = (costStats.lock[stat] || 0) + 1
            })
            costSelection.discard.forEach((stat: string) => {
              costStats.discard[stat] = (costStats.discard[stat] || 0) + 1
            })
          }
        })

        // Обратная совместимость: суммируем все статы
        COSTS.forEach(cost => {
          const costSelection = getCostSelection(selection, cost)
          costSelection.lock.forEach((stat: string) => {
            rec.lock[stat] = (rec.lock[stat] || 0) + 1
          })
          costSelection.discard.forEach((stat: string) => {
            rec.discard[stat] = (rec.discard[stat] || 0) + 1
          })
        })
      })
    })

    return Array.from(aggregated.values()).sort(
      (a, b) => b.resonatorCount - a.resonatorCount,
    )
  }, [selectedResonatorIds, allResonators, allEchoSets])
}
