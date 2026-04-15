import { useMemo, useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import "./Resonators.scss"
import { Link } from "react-router"
import { db } from "../../firebase/config" // Убедитесь, что путь верный
import type { Resonator } from "../../types/resonator"

// Типы данных
interface ElementData {
  id: string
  name: string
  iconUrl: string
}

interface MechanicData {
  id: string
  title: string
  img: string
  link: string
}

interface WeaponsTypeData {
  id: string
  type: string
  link: string
}

interface Prop {
  customClassname?: string
  filterBackImg?: string
}

export const Resonators = ({ customClassname, filterBackImg }: Prop) => {
  // Состояния для данных из Firebase
  const [elements, setElements] = useState<ElementData[]>([])
  const [resonators, setResonators] = useState<Resonator[]>([])
  const [weaponsType, setWeaponsType] = useState<WeaponsTypeData[]>([])

  const [mechanics, setMechanics] = useState<MechanicData[]>([])
  const [loading, setLoading] = useState(true)

  // Состояния для фильтрации
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElement, setSelectedElement] = useState("all")
  const [selectedWeaponType, setSelectedWeaponType] = useState("all")
  const [selectedGuide, setSelectedGuide] = useState("filterBtnResonators")

  // Загрузка данных из Firebase при монтировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 1. Загрузка стихий
        const elementsSnap = await getDocs(collection(db, "elements"))
        const elementsList = elementsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ElementData[]
        setElements(elementsList)

        // загрузка типов оружий
        const weaponTypeSnap = await getDocs(collection(db, "weapons_icon"))
        const weaponTypesList = weaponTypeSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as WeaponsTypeData[]
        setWeaponsType(weaponTypesList)

        // 2. Загрузка персонажей
        const resonatorsSnap = await getDocs(
          query(collection(db, "resonators"), orderBy("name")),
        )
        const resonatorsList = resonatorsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Resonator[]
        setResonators(resonatorsList)

        // 3. Загрузка механик
        const mechanicsSnap = await getDocs(
          query(collection(db, "mechanics"), orderBy("title")),
        )
        const mechanicsList = mechanicsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MechanicData[]
        setMechanics(mechanicsList)
      } catch (error) {
        console.error("Ошибка загрузки данных Resonators:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Фильтрация и сортировка персонажей
  const filteredAndSortedResonators = useMemo(() => {
    let result = resonators

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

    if (selectedWeaponType !== "all") {
      result = result.filter(
        item =>
          item.weaponType.toLocaleLowerCase() ===
          selectedWeaponType.toLocaleLowerCase(),
      )
    }

    return result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
  }, [resonators, searchTerm, selectedElement, selectedWeaponType])

  const handleSelectElement = (elementId: string) => {
    if (selectedElement === elementId) {
      setSelectedElement("all")
    } else {
      setSelectedElement(elementId)
    }
  }

  const handleSelectWeaponType = (typeId: string) => {
    if (selectedWeaponType.toLocaleLowerCase() === typeId.toLocaleLowerCase()) {
      setSelectedWeaponType("all")
    } else {
      setSelectedWeaponType(typeId)
    }
  }

  const handleFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedGuide(e.currentTarget.id)
  }

  return (
    <div className={`resonators ${customClassname}`.trim()}>
      {/* Поиск и фильтры */}
      <div className="filter">
        <input
          type="text"
          placeholder="поиск"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="filter__search"
          maxLength={18}
        />
        {/* <div className="filter__choose">
          <h2 className="filter__h2">ВЫБЕРИ ГАЙД</h2>
          <div className="filter__btn-block">
            <button
              className={`filter__btn ${selectedGuide === "filterBtnResonators" && "filter__btn-borderbottom"}`.trim()}
              id="filterBtnResonators"
              onClick={handleFilter}
            >
              ПЕРСОНАЖИ
            </button>
            <button
              className={`filter__btn ${selectedGuide === "filterBtnMechanics" && "filter__btn-borderbottom"}`.trim()}
              id="filterBtnMechanics"
              onClick={handleFilter}
            >
              МЕХАНИКИ
            </button>
          </div>
        </div> */}
        <div className="resonators__elements-listContainer">
          <ul className="resonators__elements-list">
            {elements.map(({ id, iconUrl }) => (
              <li className="resonators__elements-item" key={id}>
                <button
                  className="resonators__elements-btn"
                  onClick={() => handleSelectElement(id)}
                >
                  <img
                    src={iconUrl}
                    alt={`Element ${id}`}
                    className={`resonators__elements-img ${selectedElement === id && "resonators__elements-img_zoom"}`.trim()}
                  />
                </button>
              </li>
            ))}
          </ul>
          <span className="resonators__elements-background"></span>
        </div>

        <div className="resonators__elements-listContainer">
          <ul className="resonators__elements-list">
            {weaponsType.map(({ id, link }) => (
              <li className="resonators__elements-item" key={id}>
                <button
                  className="resonators__elements-btn"
                  onClick={() => handleSelectWeaponType(id)}
                >
                  <img
                    src={link}
                    alt={`WeaponType ${id}`}
                    className={`resonators__elements-img ${selectedWeaponType === id && "resonators__elements-img_zoom"}`.trim()}
                  />
                </button>
              </li>
            ))}
          </ul>
          <span className="resonators__elements-background"></span>
        </div>
        <img
          src={filterBackImg}
          alt="Фоновая картинка фильтрацаа"
          className="filter__background"
        />
      </div>

      {/* ПЕРСОНАЖИ */}
      {selectedGuide === "filterBtnResonators" ? (
        <ul className="resonators-list__list">
          {filteredAndSortedResonators.map(item => (
            <li
              className={`resonators-list__item ${item.rarity == 4 ? "resonators-list__item-4" : "resonators-list__item-5"}`.trim()}
              key={item.id}
            >
              <Link
                to={`/resonator/${item.engName}`}
                className="resonators-list__link"
              >
                <img
                  src={item.resonatorImgMini}
                  alt={item.name}
                  className="resonators-list__img"
                />
                <img
                  src={
                    elements.find(itemEl => itemEl.id === item.element)?.iconUrl
                  }
                  alt={item.element}
                  className="resonators-list__element"
                />

                <h3 className="resonators-list__h3">{item.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {/* МЕХАНИКИ */}
      {/* {selectedGuide === "filterBtnMechanics" ? (
        <ul className="resonators-list__list">
          {mechanics.map(item => (
            <li className="resonators-list__item" key={item.id}>
              <Link
                to={item.link}
                className="resonators-list__link"
                key={item.id}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="resonators-list__img"
                />
                <h3 className="resonators-list__h3">{item.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : null} */}
    </div>
  )
}
