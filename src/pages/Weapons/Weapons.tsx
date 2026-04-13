import { useEffect, useMemo, useState } from "react"
import { Loader } from "../../components"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../firebase/config"
import type { Weapon } from "../../types/weapon"
import "./Weapons.scss"
import { useParams } from "react-router"

interface WeaponTypeData {
  id: string
  type: string
  link: string
}

interface TypeDesrElementProps {
  selectedType: string
  weaponTypes: { id: string; type: string; link: string }[]
}

export const Weapons = () => {
  const { engName: urlEngName } = useParams<{ engName: string }>()

  const [loading, setLoading] = useState(true)
  const [weaponTypes, setWeaponTypes] = useState<WeaponTypeData[]>([])
  const [weaponsAll, setWeaponsAll] = useState<Weapon[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const weaponTypesSnap = await getDocs(collection(db, "weapons_icon"))
        const weaponTypesList = weaponTypesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as WeaponTypeData[]
        setWeaponTypes(weaponTypesList)

        const weaponsSnap = await getDocs(
          query(collection(db, "weapons"), orderBy("name")),
        )
        const weaponsList = weaponsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Weapon[]
        setWeaponsAll(weaponsList)

        setLoading(false)
      } catch (err) {
        console.error("Ошибка загрузки оружия:", err)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!urlEngName) {
      setSelectedWeapon(null)
      setSearchTerm("")
      return
    }

    const foundWeapon = weaponsAll.find(
      w => w.engName?.toLowerCase() === urlEngName.toLowerCase(),
    )

    if (foundWeapon) {
      setSelectedWeapon(foundWeapon)
      setSearchTerm(foundWeapon.name)
      setSelectedType(foundWeapon.type || "all")
    } else {
      setSelectedWeapon(null)
    }
  }, [urlEngName, weaponsAll])

  const handleSelectType = (type: string) => {
    setSelectedType(prev => (prev === type ? "all" : type))
  }

  const handleWeaponClick = (weapon: Weapon) => {
    setSelectedWeapon(weapon)

    window.history.pushState({}, "", `/weapons/${weapon.engName}`)
  }

  const filteredAndSortedWeapons = useMemo(() => {
    let result = weaponsAll

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.engName.toLowerCase().includes(term),
      )
    }

    if (selectedType !== "all") {
      result = result.filter(
        item => item.type?.toLowerCase() === selectedType.toLowerCase(),
      )
    }

    return result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
  }, [searchTerm, selectedType, weaponsAll])

  if (loading) {
    return <Loader width="100px" height="100px" />
  }

  return (
    <section className="weapons">
      {/* Поиск */}

      <input
        type="text"
        placeholder="Поиск оружия..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="weapons-filter__search"
        maxLength={30}
      />

      {/* Фильтры по типам */}
      <div className="weapons-filter__listContainer">
        <ul className="weapons-filter__list">
          {weaponTypes.map(({ type, link }) => (
            <li className="weapons-filter__item" key={type}>
              <button
                className="weapons-filter__btn"
                onClick={() => handleSelectType(type)}
                title={type}
              >
                <img
                  src={link}
                  alt={type}
                  className={`weapons-filter__img ${
                    selectedType === type ? "weapons-filter__img_zoom" : ""
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <span className="weapons-filter__background"></span>
      </div>

      <TypeDesrElement selectedType={selectedType} weaponTypes={weaponTypes} />
      {/* Список оружия */}
      <ul className="weapons__list">
        {filteredAndSortedWeapons.length > 0 ? (
          filteredAndSortedWeapons.map(item => {
            if (item.rarity == 5) {
              return (
                <li className={`weapons__item`} key={item.id}>
                  <h3 className="weapons__h3">{item.name}</h3>
                  <button
                    className={`weapons__btn weapons__btn-5`}
                    onClick={() => handleWeaponClick(item)}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="weapons__img"
                    />
                  </button>
                </li>
              )
            }
          })
        ) : (
          <li className="weapons__empty">Оружие не найдено</li>
        )}
      </ul>
      <ul className="weapons__list">
        {filteredAndSortedWeapons.length > 0 ? (
          filteredAndSortedWeapons.map(item => {
            if (item.rarity == 4) {
              return (
                <li className={`weapons__item`} key={item.id}>
                  <h3 className="weapons__h3">{item.name}</h3>
                  <button
                    className={`weapons__btn weapons__btn-4`}
                    onClick={() => handleWeaponClick(item)}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="weapons__img"
                    />
                  </button>
                </li>
              )
            }
          })
        ) : (
          <li className="weapons__empty">Оружие не найдено</li>
        )}
      </ul>

      {/* Блок с подробной информацией об оружии */}
      {selectedWeapon && (
        <div className="weapons__content">
          <img
            src={selectedWeapon.img}
            alt="Картинка оружия"
            className={`weapons__content-img ${selectedWeapon.rarity == 4 ? "weapons__btn-4" : "weapons__btn-5"}`}
          />
          <div className="weapons__description-container">
            <h2 className="weapons__h2">{selectedWeapon.name}</h2>
            <h4 className="weapons__h4">Пассивка</h4>
            <ul className="weapons__description-list">
              {selectedWeapon.description.length > 0 ? (
                selectedWeapon.description.map((item, index) => {
                  return (
                    <li
                      className="weapons__description-item"
                      key={`weapons__description-item ${index}`}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  )
                })
              ) : (
                <li className="weapons__description">
                  Описание оружия не найдено
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

const TypeDesrElement = ({
  selectedType,
  weaponTypes,
}: TypeDesrElementProps) => {
  const getTypeLabel = (type: string): string => {
    switch (type.toLowerCase()) {
      case "broadblade":
        return "Тяжелые мечи"
      case "sword":
        return "Мечи"
      case "pistols":
        return "Пистолеты"
      case "rectifier":
        return "Преобразователи"
      case "gauntlets":
        return "Боевые наручи"
      default:
        return "Всё оружие"
    }
  }

  const currentTypeData = weaponTypes.find(
    item => item.type.toLowerCase() === selectedType.toLowerCase(),
  )

  const label = getTypeLabel(selectedType)

  return (
    <div className="weapons__typedescr">
      {currentTypeData && (
        <img
          src={currentTypeData.link}
          alt={label}
          className="weapons__typedescr-icon"
        />
      )}
      <p className="weapons__typedescr-text">{label}</p>
      {currentTypeData && (
        <img
          src={currentTypeData.link}
          alt={label}
          className="weapons__typedescr-icon"
        />
      )}
    </div>
  )
}
