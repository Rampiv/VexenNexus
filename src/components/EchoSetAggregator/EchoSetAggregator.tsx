import type React from "react"
import "./EchoSetAggregator.scss"
import type { EchoRecommendation } from "../../types/echoApp"
import type { EchoCost } from "../../types/resonator"

interface EchoSetAggregatorProps {
  recommendations: EchoRecommendation[]
  minResonatorCount?: number
}

export const EchoSetAggregator: React.FC<EchoSetAggregatorProps> = ({
  recommendations,
  minResonatorCount = 1,
}) => {
  const filtered = recommendations.filter(
    rec => rec.resonatorCount >= minResonatorCount,
  )

  const renderStatChips = (
    stats: Record<string, number>,
    totalResonators: number,
    type: "lock" | "discard",
    excludedStats?: Set<string>,
  ) => {
    return Object.entries(stats)
      .filter(([stat]) => !excludedStats?.has(stat))
      .sort((a, b) => b[1] - a[1])
      .map(([stat, count]) => (
        <div key={stat} className={`stat-chip ${type}`}>
          <span className="stat-chip__name">{stat}</span>
          <span className="stat-chip__count">{count}x</span>
        </div>
      ))
  }

  const renderCostStats = (
    costStats: EchoRecommendation["costStats"],
    resonatorCount: number,
  ) => {
    if (!costStats) return null

    return (
      <div className="cost-stats">
        {[1, 3, 4].map(cost => {
          const costData = costStats[cost as EchoCost]
          if (!costData) return null

          const hasLock = Object.keys(costData.lock).length > 0
          const hasDiscard = Object.keys(costData.discard).length > 0
          if (!hasLock && !hasDiscard) return null

          const lockStats = new Set(Object.keys(costData.lock))

          return (
            <div key={cost} className="cost-stats__section">
              <div className="cost-stats__title">{cost}-Cost Echo</div>

              {hasLock && (
                <div className="cost-stats__group">
                  <span className="cost-stats__label lock">Залочить:</span>
                  <div className="cost-stats__chips">
                    {renderStatChips(costData.lock, resonatorCount, "lock")}
                  </div>
                </div>
              )}

              {hasDiscard && (
                <div className="cost-stats__group">
                  <span className="cost-stats__label discard">Удалять:</span>
                  <div className="cost-stats__chips">
                    {renderStatChips(
                      costData.discard,
                      resonatorCount,
                      "discard",
                      lockStats,
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="echo-set-aggregator__empty">
        <p>
          {recommendations.length === 0
            ? "Выберите персонажей для просмотра рекомендаций"
            : "Нет эхо-сетов, соответствующих фильтру"}
        </p>
      </div>
    )
  }

  return (
    <div className="echo-set-aggregator">
      <div className="echo-set-aggregator__header">
        <h3>Рекомендации по эхо-сетам</h3>
        <span className="echo-set-aggregator__count">
          Найдено: {filtered.length}
        </span>
      </div>

      <div className="echo-set-aggregator__list">
        {filtered.map(rec => {
          const hasCostStats =
            rec.costStats && Object.keys(rec.costStats).length > 0

          return (
            <div key={rec.setId} className="echo-set-card">
              <div className="echo-set-card__header">
                <img
                  src={rec.setImg}
                  alt={rec.setName}
                  className="echo-set-card__img"
                />
                <div className="echo-set-card__info">
                  <h4 className="echo-set-card__name">{rec.setName}</h4>
                  <span className="echo-set-card__usage">
                    Используется в {rec.resonatorCount} сборках
                  </span>
                </div>
              </div>

              <div className="echo-set-card__content">
                {hasCostStats ? (
                  renderCostStats(rec.costStats, rec.resonatorCount)
                ) : (
                  <>
                    {Object.keys(rec.lock).length > 0 && (
                      <div className="stat-group">
                        <div className="stat-group__title lock">Залочить</div>
                        <div className="stat-group__list">
                          {renderStatChips(
                            rec.lock,
                            rec.resonatorCount,
                            "lock",
                          )}
                        </div>
                      </div>
                    )}

                    {Object.keys(rec.discard).length > 0 && (
                      <div className="stat-group">
                        <div className="stat-group__title discard">Удалять</div>
                        <div className="stat-group__list">
                          {renderStatChips(
                            rec.discard,
                            rec.resonatorCount,
                            "discard",
                            new Set(Object.keys(rec.lock)),
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
