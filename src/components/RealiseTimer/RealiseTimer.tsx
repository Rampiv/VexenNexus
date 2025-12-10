import { useState, useEffect } from "react"
import "./RealiseTimer.scss"

type Region = "europe" | "america" | "asia"

interface Prop {
  newDateProp: number // базовая дата в миллисекундах (UTC или локальная — неважно, главное единообразие)
  region: Region
}

// Смещение в часах относительно базы (europe = 0)
const offsets: Record<Region, number> = {
  europe: 0, // база
  asia: -3,
  america: +5,
}

export const RealiseTimer = ({ newDateProp, region }: Prop) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const offsetMs = offsets[region] * 60 * 60 * 1000
    const adjustedTarget = newDateProp + offsetMs // сдвигаем целевую дату

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = adjustedTarget - now

      if (diff <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [newDateProp, region])

  return (
    <div className="countdown">
      <div className="countdown__item">
        <span className="countdown__value">{timeLeft.days}</span>
        <span className="countdown__label">DAY</span>
      </div>
      <span className="countdown__span">:</span>
      <div className="countdown__item">
        <span className="countdown__value">{timeLeft.hours}</span>
        <span className="countdown__label">HOUR</span>
      </div>
      <span className="countdown__span">:</span>
      <div className="countdown__item">
        <span className="countdown__value">{timeLeft.minutes}</span>
        <span className="countdown__label">MINUTE</span>
      </div>
      <span className="countdown__span">:</span>
      <div className="countdown__item">
        <span className="countdown__value">{timeLeft.seconds}</span>
        <span className="countdown__label">SECOND</span>
      </div>
    </div>
  )
}
