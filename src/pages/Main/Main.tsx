import { Link } from "react-router"
import "./Main.scss"
import { DataLinks } from "../../data"
import Chibi from "../../assets/image/main_chibi.webp"
import Cloud from "../../assets/image/cloud.webp"
import { useState } from "react"

export const Main = () => {
  const [visible, setVisible] = useState(false)

  const handleChibiClick = () => {
    setVisible(true)
  }

  return (
    <>
      <main className="main">
        <div className="container">
          <div className="main__content">
            <section className="pasta">
              <div className="container">
                <div className="pasta__container">
                  <div className="pasta__content">
                    <p className="pasta__text">
                      Здесь ты&nbsp;сможешь найти актуальные билды и&nbsp;общую
                      информацию по&nbsp;персонажам в&nbsp;wuthering waves!{" "}
                      <br /> эхо, оружие, отряды и&nbsp;подсчеты цифер урона
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="links">
              <div className="container">
                <ul className="links__list">
                  <li className="links__item">
                    <Link to="">ПОДДЕРЖАТЬ</Link>
                  </li>
                  <li className="links__item">
                    <Link to={DataLinks[1].link}>YT VEXEN</Link>
                  </li>
                  <li className="links__item">
                    <Link to={DataLinks[0].link}>TG КАНАЛ</Link>
                  </li>
                </ul>
              </div>
            </section>
            <section className="chibi">
              <div className="container">
                <div className="chibi__content">
                  <button className="chibi__btn" onClick={handleChibiClick}>
                    <img src={Chibi} alt="Чиби" className="chibi__chibi" />
                  </button>
                  <div
                    className={`chibi__cloud-container ${visible ? "visible" : ""}`.trim()}
                  >
                    <p className="chibi__cloud-text">
                      Привет! я помогу тебе разобраться куда тут жмать <br />
                      кликни на меня еще раз!
                    </p>
                    <img
                      src={Cloud}
                      alt="Облачко с надписью"
                      className="chibi__cloud-img"
                    />
                  </div>
                  <div
                    className={`chibi__hint ${visible ? "hide-chibi" : ""}`.trim()}
                  >
                    <p className="chibi__hint-text">Тык</p>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.66411 6.8359L3.414 0.585785L0.585571 3.41421L6.83568 9.66432L4.00002 12.5L5.50002 14H14V5.49999L12.5 3.99999L9.66411 6.8359Z"
                        fill="#212121"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
