import Chibi1 from "../../assets/image/Chibi/chibi1.webp"
import Chibi2 from "../../assets/image/Chibi/chibi2.webp"
import Chibi3 from "../../assets/image/Chibi/chibi3.webp"
import Chibi4 from "../../assets/image/Chibi/chibi4.webp"
import Chibi5 from "../../assets/image/Chibi/chibi5.webp"
import { Arrow } from "@assets/icons"
import Cloud from "../../assets/image/cloud.webp"
import { useEffect, useState } from "react"
import "./Egg.scss"

const chibiImages = [Chibi1, Chibi2, Chibi3, Chibi4, Chibi5]
const chibiText = [
  "",
  "Привет! Сверху навигация, она всегда будет там",
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
export const Egg = () => {
  const [visible, setVisible] = useState(false)
  const [currentChibiIndex, setCurrentChibiIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [cloudOffset, setCloudOffset] = useState(0)
  const [textStep, setTextStep] = useState(0) // сколько раз уже кликнули

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
      const randomTextIndex =
        Math.floor(Math.random() * (chibiText.length - FIXED_TEXT_COUNT)) +
        FIXED_TEXT_COUNT
      setCurrentTextIndex(randomTextIndex)
    }
  }
  return (
    <>
      <section className="chibi">
        <div className="container">
          <div className="chibi__content">
            <button className="chibi__btn" onClick={handleChibiClick}>
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
            <div className={`chibi__hint ${visible ? "hide" : ""}`.trim()}>
              <p className="chibi__hint-text">Тык</p>
              <Arrow />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
