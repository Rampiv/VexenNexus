import { useMemo } from "react"
import type { Resonator } from "../types/resonator"
import type { EchoSet } from "../types/echoSet"
import type { AggregatedEchoData } from "../types/echoApp"

export const useEchoAggregation = (
  selectedResonatorIds: string[],
  allResonators: Resonator[],
  allEchoSets: EchoSet[],
) => {
  return useMemo(() => {
    const aggregated: AggregatedEchoData = {}

    // Фильтруем выбранных персонажей
    const selectedResonators = allResonators.filter(r =>
      selectedResonatorIds.includes(r.id || ""),
    )

    // Проходим по каждому персонажу и его эхо-рекомендациям
    selectedResonators.forEach(resonator => {
      const echoSelections = resonator.echoSets || []

      echoSelections.forEach(selection => {
        const echoSet = allEchoSets.find(es => es.id === selection.id)
        if (!echoSet || !echoSet.id) return

        if (!aggregated[echoSet.id]) {
          aggregated[echoSet.id] = {
            setId: echoSet.id,
            setName: echoSet.name || "",
            setImg: echoSet.img || "",
            lock: {},
            discard: {},
            resonatorCount: 0,
          }
        }

        const rec = aggregated[echoSet.id]
        rec.resonatorCount += 1

        // Агрегируем lock статы
        selection.lock.forEach(stat => {
          rec.lock[stat] = (rec.lock[stat] || 0) + 1
        })

        // Агрегируем discard статы
        selection.discard.forEach(stat => {
          rec.discard[stat] = (rec.discard[stat] || 0) + 1
        })
      })
    })

    // Конвертируем в массив и сортируем по популярности
    return Object.values(aggregated).sort(
      (a, b) => b.resonatorCount - a.resonatorCount,
    )
  }, [selectedResonatorIds, allResonators, allEchoSets])
}
