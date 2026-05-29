import { useState } from "react"
import { useEchoSets } from "../../hook/useEchoSets"
import { useResonators } from "../../hook/useResonators"
import {
  EchoResonatorPicker,
  EchoSetAggregator,
  Loader,
} from "../../components"
import { useEchoAggregation } from "../../hook/useEchoAggregation"
import "./EchoApp.scss"

export const EchoApp = () => {
  const { resonators: allResonators, loading: loadingResonators } =
    useResonators()
  const { echoSets: allEchoSets, loading: loadingEchoSets } = useEchoSets()

  const [selectedResonatorIds, setSelectedResonatorIds] = useState<string[]>([])

  const aggregatedEchoes = useEchoAggregation(
    selectedResonatorIds,
    allResonators,
    allEchoSets,
  )

  if (loadingResonators || loadingEchoSets) {
    return <Loader width={"300px"} height={"300px"} />
  }

  return (
    <section className="echo-app">
      <h1 className="echo-app__title">Echo Set Builder</h1>
      <p className="echo-app__subtitle">
        Выберите персонажей и получите сводные рекомендации по эхо-сетам
      </p>

      <EchoResonatorPicker
        allResonators={allResonators}
        selectedIds={selectedResonatorIds}
        onSelectionChange={setSelectedResonatorIds}
      />

      <EchoSetAggregator
        recommendations={aggregatedEchoes}
        minResonatorCount={1}
      />
    </section>
  )
}
