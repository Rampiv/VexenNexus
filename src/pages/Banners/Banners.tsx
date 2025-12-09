import React from "react"
import "./Banners.scss"
import { Card, RealiseTimer } from "../../components"
import { DataFutureResonators } from "../../data"
import { Link } from "react-router"

const CardMemo = React.memo(Card)

export const Banners = () => {
  return (
    <section className="main__future">
      <h2 className="main__h2">Персонажи следующего патча 2.7</h2>
      <RealiseTimer />
      <ul className="main__list">
        {DataFutureResonators.map(item => (
          <li className="main__item" key={`${item.resonator}future`}>
            <Link to={item.link}>
              <CardMemo resonator={item.resonator} rarity={item.rarity} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
