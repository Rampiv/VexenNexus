import React from "react"
import { Card, RealiseTimer } from "../../components"
import { Link } from "react-router"
import "./Main.scss"
import { DataFutureResonators } from "../../data"

const CardMemo = React.memo(Card)

export const Main = () => {
  return (
    <>
      <main className="main">
        <div className="container">
          <div className="main__content">
            <section className="main__pasta">
              <div className="container">
                <div className="main__pasta-container">
                  <p className="main__pasta-text">место для пасты</p>
                </div>
              </div>
            </section>
            <section className="main__pasta">
              {/* временно */}
              <div className="container">
                <div className="main__pasta-container">
                  <p className="main__pasta-text">место для чиби чиби чапа чапа руби руби даба даба</p>
                </div>
              </div>
            </section>
            <section className="main__future">
              {" "}
              {/* Секция будущих персонажей */}
              <h2 className="main__h2">Персонажи следующего патча 2.7</h2>
              <RealiseTimer />
              <ul className="main__list">
                {DataFutureResonators.map(item => (
                  <li className="main__item" key={`${item.id}future`}>
                    <Link to={item.link}>
                      <CardMemo
                        name={item.name}
                        role={item.role}
                        resonator={item.resonator}
                        element={item.elementIMG}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
