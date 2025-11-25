import { useMemo, useState } from "react"
import "./Resonators.scss"
import { DataResonators } from "../../data"
import { Link } from "react-router"
import React from "react"
import { Card } from "../../components"
import Electro from "@assets/image/Element/Electro.webp"
import Havoc from "@assets/image/Element/Havoc.webp"
import Aero from "@assets/image/Element/Aero.webp"
import Fusion from "@assets/image/Element/Fusion.webp"
import Spectro from "@assets/image/Element/Spectro.webp"
import Glacio from "@assets/image/Element/Glacio.webp"
import Lupa from "@assets/icons/Lupa.webp"

const CardMemo = React.memo(Card)

export const Resonators = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole] = useState("all")
  const [selectedElement, setSelectedElement] = useState("all")

  // Обработка фильтрации и сортировки
  const filteredAndSortedResonators = useMemo(() => {
    let result = DataResonators

    // Поиск по имени (регистронезависимый)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.engName.toLowerCase().includes(term),
      )
    }

    // Фильтр по роли
    if (selectedRole !== "all") {
      result = result.filter(item => item.role === selectedRole)
    }

    // Фильтр по элементу
    if (selectedElement !== "all") {
      result = result.filter(item => item.element === selectedElement)
    }

    // Сортировка по имени
    return result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
  }, [searchTerm, selectedRole, selectedElement])

  // Выбор элемента для фильтра
  const handleSelectElement = (element: string) => {
    setSelectedElement(element)
  }

  return (
    <section className="resonators">
      <div className="container">
        <h2 className="resonators__h2">фильтр</h2>
        <ul className="resonators__elements-list">
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={e => handleSelectElement("Havoc")}
            >
              <img
                src={Havoc}
                alt="Elemet Havoc"
                className="resonators__elements-img"
              />
            </button>
          </li>
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={e => handleSelectElement("Aero")}
            >
              <img
                src={Aero}
                alt="Elemet Aero"
                className="resonators__elements-img"
              />
            </button>
          </li>
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={e => handleSelectElement("Fusion")}
            >
              <img
                src={Fusion}
                alt="Elemet Fusion"
                className="resonators__elements-img"
              />
            </button>
          </li>
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={e => handleSelectElement("Spectro")}
            >
              <img
                src={Spectro}
                alt="Elemet Spectro"
                className="resonators__elements-img"
              />
            </button>
          </li>
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={e => handleSelectElement("Glacio")}
            >
              <img
                src={Glacio}
                alt="Elemet Glacio"
                className="resonators__elements-img"
              />
            </button>
          </li>
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn"
              onClick={e => handleSelectElement("Electro")}
            >
              <img
                src={Electro}
                alt="Elemet Electro"
                className="resonators__elements-img"
              />
            </button>
          </li>
          <li className="resonators__elements-item">
            <button
              className="resonators__elements-btn_reset"
              onClick={e => handleSelectElement("all")}
            >
              Сброс
            </button>
          </li>
        </ul>

        <div className="resonators__search-container">
          <input
            type="text"
            placeholder="поиск"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="resonators__search"
            maxLength={18}
          />
          <img src={Lupa} alt="лупа" className="resonators__search-lupa" />

          {/* <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="resonators__select resonators__role"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === "all" ? "Все роли" : role}
              </option>
            ))}
          </select> */}

          {/* <select
            value={selectedElement}
            onChange={e => setSelectedElement(e.target.value)}
            className="resonators__select resonators__elements"
          >
            {elements.map(element => (
              <option key={element} value={element}>
                {element === "all" ? "Все элементы" : element}
              </option>
            ))}
          </select> */}
        </div>
        <ul className="resonators__list">
          {filteredAndSortedResonators.map(item => (
            <li className="resonators__item" key={`${item.id}resonator`}>
              <Link to={item.link}>
                <CardMemo resonator={item.resonator} rarity={item.rarity} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
