// src/pages/EchoApp/components/EchoSetAggregator/EchoSetAggregator.tsx
import type React from "react"
import "./EchoSetAggregator.scss"
import type { EchoRecommendation } from "../../types/echoApp"

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

  // Helper для рендера чипсов стат с прогрессом
  const renderStatChips = (
    stats: Record<string, number>,
    totalResonators: number,
    type: "lock" | "discard",
  ) => {
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1]) // сортируем по популярности
      .map(([stat, count]) => {
        const percentage = Math.round((count / totalResonators) * 100)
        return (
          <div key={stat} className={`stat-chip ${type}`}>
            <span className="stat-chip__name">{stat}</span>
            <span className="stat-chip__count">{count}x</span>
            <div className="stat-chip__progress">
              <div
                className="stat-chip__progress-bar"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })
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
        {filtered.map(rec => (
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
              {/* Lock секция */}
              {Object.keys(rec.lock).length > 0 && (
                <div className="stat-group">
                  <div className="stat-group__title lock">Залочить</div>
                  <div className="stat-group__list">
                    {renderStatChips(rec.lock, rec.resonatorCount, "lock")}
                  </div>
                </div>
              )}

              {/* Discard секция */}
              {Object.keys(rec.discard).length > 0 && (
                <div className="stat-group">
                  <div className="stat-group__title discard">Удалять</div>
                  <div className="stat-group__list">
                    {renderStatChips(
                      rec.discard,
                      rec.resonatorCount,
                      "discard",
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
