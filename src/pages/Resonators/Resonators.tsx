import { useMemo, useState } from "react"
import "./Resonators.scss"
import { DataResonators } from "../../data"
import { Link } from "react-router"
import Electro from "@assets/image/Element/Electro.webp"
import Havoc from "@assets/image/Element/Havoc.webp"
import Aero from "@assets/image/Element/Aero.webp"
import Fusion from "@assets/image/Element/Fusion.webp"
import Spectro from "@assets/image/Element/Spectro.webp"
import Glacio from "@assets/image/Element/Glacio.webp"
import reset from "@assets/image/Element/reset.webp"


// Массив элементов для фильтрации
const ELEMENTS = [
  { key: "Havoc", img: Havoc },
  { key: "Aero", img: Aero },
  { key: "Fusion", img: Fusion },
  { key: "Spectro", img: Spectro },
  { key: "Glacio", img: Glacio },
  { key: "Electro", img: Electro },
]

export const Resonators = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElement, setSelectedElement] = useState("all")
  const [selectedGuide, setSelectedGuide] = useState("resonators")

  const filteredAndSortedResonators = useMemo(() => {
    let result = DataResonators

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.engName.toLowerCase().includes(term),
      )
    }

    if (selectedElement !== "all") {
      result = result.filter(item => item.element === selectedElement)
    }

    return result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
  }, [searchTerm, selectedElement])

  const handleSelectElement = (element: string) => {
    setSelectedElement(element)
  }

  return (
    <section className="resonators">
      <div className="resonators__elements-listContainer">
        <ul className="resonators__elements-list">
          {ELEMENTS.map(({ key, img }) => (
            <li className="resonators__elements-item" key={key}>
              <button
                className="resonators__elements-btn"
                onClick={() => handleSelectElement(key)}
              >
                <img
                  src={img}
                  alt={`Element ${key}`}
                  className="resonators__elements-img"
                />
              </button>
            </li>
          ))}
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={() => handleSelectElement("all")}
            >
              <img
                src={reset}
                alt="reset"
                className="resonators__elements-img resonators__elements-img_reset"
              />
            </button>
          </li>
        </ul>
        <span className="resonators__elements-background"></span>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="поиск"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="filter__search"
          maxLength={18}
        />
        <div className="filter__choose">
          <h2 className="filter__h2">ВЫБЕРИ ГАЙД</h2>
          <div className="filter__btn-block">
            <button
              className={`filter__btn ${selectedGuide === "resonators" && "filter__btn-borderbottom"}`.trim()}
              onClick={() => setSelectedGuide("resonators")}
            >
              ПЕРСОНАЖИ
            </button>
            <button
              className={`filter__btn ${selectedGuide === "mechanics" && "filter__btn-borderbottom"}`.trim()}
              onClick={() => setSelectedGuide("mechanics ")}
            >
              МЕХАНИКИ
            </button>
          </div>
        </div>
      </div>

      {selectedGuide === "resonators" ? (
        <ul className="resonators-list__list">
          {filteredAndSortedResonators.map(item => (
            <li className="resonators-list__item" key={`${item.id}resonator`}>
              <img
                src={item.resonator}
                alt="Изображение резонатора"
                className="resonators-list__img"
              />
              <div className="resonators-list__links">
                <h3 className="resonators-list__h3">{item.name}</h3>
                <Link to={item.link} className="resonators-list__link">
                  Базовый гайд
                </Link>
                {item.isPro && (
                  <Link to={item.link} className="resonators-list__link">
                    Продвинутый гайд
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </section>
  )
}
