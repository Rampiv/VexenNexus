import { Link } from "react-router"
import "./Main.scss"
import { DataLinks } from "../../data"
import Chibi1 from "../../assets/image/Chibi/chibi1.webp"
import Chibi2 from "../../assets/image/Chibi/chibi2.webp"
import Chibi3 from "../../assets/image/Chibi/chibi3.webp"
import Chibi4 from "../../assets/image/Chibi/chibi4.webp"
import Chibi5 from "../../assets/image/Chibi/chibi5.webp"

import Cloud from "../../assets/image/cloud.webp"
import { useEffect, useState } from "react"
import { Arrow } from "@assets/icons"

const chibiImages = [Chibi1, Chibi2, Chibi3, Chibi4, Chibi5]

const chibiText = [
  "",
  <>
    Привет! я помогу тебе разобраться куда тут жмать <br /> кликни на меня еще
    раз
  </>,
  "Слева есть менюшка, где ты есть вся информация, которая тебе нужна!",
  "Эй!",
  "Эээй!",
  "Эй, ты, да ты!",
  "Эй...",
  "Ну хватит...",
  "А если на тебя так будут тыкать?!",
  "У тебя точно мышка не сломалась?",
  "Ты безнадежен...",
]

const FIXED_TEXT_COUNT = 3 // первые 3 текста идут строго по порядку

export const Main = () => {
  const [visible, setVisible] = useState(false)
  const [currentChibiIndex, setCurrentChibiIndex] = useState(0)
  const [textStep, setTextStep] = useState(0) // сколько раз уже кликнули
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [cloudOffset, setCloudOffset] = useState(0)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * chibiImages.length)
    setCurrentChibiIndex(randomIndex)
  }, [])

  const handleChibiClick = () => {
    // Меняем чиби на случайную
    const randomIndex = Math.floor(Math.random() * chibiImages.length)
    setCurrentChibiIndex(randomIndex)

    // Генерируем случайный сдвиг облака
    const offset = (Math.random() - 0.5) * 20
    setCloudOffset(offset)

    // Показываем облачко
    setVisible(true)

    // Обновляем счётчик кликов
    const newStep = textStep + 1
    setTextStep(newStep)

    if (newStep <= FIXED_TEXT_COUNT) {
      setCurrentTextIndex(newStep)
    } else {
      const randomTextIndex = Math.floor(
        Math.random() * (chibiText.length - FIXED_TEXT_COUNT)
      ) + FIXED_TEXT_COUNT
      setCurrentTextIndex(randomTextIndex)
    }
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
                    <Link to={"/"}>ПОДДЕРЖАТЬ</Link>
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
                  <button
                    className="chibi__btn"
                    onClick={handleChibiClick}
                  >
                    <img
                      src={chibiImages[currentChibiIndex]}
                      alt="Чиби"
                      className="chibi__chibi"
                    />
                  </button>
                  <div
                    className={`chibi__cloud-container ${visible ? "visible" : ""}`.trim()}
                    style={{ transform: `translateY(${cloudOffset}%)` }}
                  >
                    <p className="chibi__cloud-text">{chibiText[currentTextIndex]}</p>
                    <img
                      src={Cloud}
                      alt="Облачко с надписью"
                      className="chibi__cloud-img"
                    />
                  </div>
                  <div
                    className={`chibi__hint ${visible ? "hide" : ""}`.trim()}
                  >
                    <p className="chibi__hint-text">Тык</p>
                    <Arrow />
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