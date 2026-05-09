import { useParams, Link } from "react-router"
import "./TierLists.scss"
import { useEffect, useMemo, useState } from "react"
import { Loader } from "../../components"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../firebase/config"
import type { TierList } from "../../types/TierList"
import { useResonators } from "../../hook/useResonators"

interface ElementData {
  id: string
  name: string
  iconUrl: string
}

export const TierLists = () => {
  const { engName: urlEngName } = useParams<{ engName: string }>()
  const [loading, setLoading] = useState(true)
  const [tierListsAll, setTierListsAll] = useState<TierList[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { resonators: allResonators, loading: loadingResonators } =
    useResonators()
  const [elements, setElements] = useState<ElementData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const tierListsSnap = await getDocs(
          query(collection(db, "tier_lists"), orderBy("name")),
        )
        const tierLists = tierListsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TierList[]
        setTierListsAll(tierLists)

        const elementsSnap = await getDocs(collection(db, "elements"))
        const elementsList = elementsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ElementData[]
        setElements(elementsList)

        setLoading(false)
      } catch (err) {
        console.error("Ошибка загрузки тир-листов:", err)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!urlEngName) {
      setSearchTerm("")
      return
    }

    const foundTierList = tierListsAll.find(
      s => s.engName?.toLowerCase() === urlEngName.toLowerCase(),
    )

    if (foundTierList) {
      setSearchTerm(foundTierList.name)
    }
  }, [urlEngName, tierListsAll])

  const filteredAndSorted = useMemo(() => {
    let result = tierListsAll

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name?.toLowerCase().includes(term) ||
          item.engName?.toLowerCase().includes(term),
      )
    }
    return result
  }, [searchTerm, tierListsAll])

  // Хелпер для получения данных резонатора по ID
  const getResonatorById = (id: string) => {
    return allResonators.find(r => r.id === id)
  }

  if (loading || loadingResonators) {
    return <Loader width="100px" height="100px" />
  }

  return (
    <section className="tier-lists">
      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск тир-листа..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="tier-lists__search"
        maxLength={30}
        aria-label="Поиск тир-листа по названию"
      />

      {filteredAndSorted.length === 0 ? (
        <p className="tier-lists__empty">Ничего не найдено</p>
      ) : (
        <ul className="tier-lists__list">
          {filteredAndSorted.map(tierList => (
            <li className="tier-lists__item" key={tierList.id}>
              <h2 className="tier-lists__title">
                {tierList.name}
                {tierList.engName && (
                  <span className="tier-lists__eng-name">
                    ({tierList.engName})
                  </span>
                )}
              </h2>

              <ul className="tier-lists__rows">
                {tierList.rows?.map((row, rowIndex) => {
                  const resonatorsInRow = row.resonatorIds
                    .map(id => getResonatorById(id))
                    .filter((r): r is NonNullable<typeof r> => r !== undefined)

                  return (
                    <li className="tier-lists__row" key={row.id || rowIndex}>
                      {/* Рейтинг / Изображение тира */}
                      <div className="tier-lists__tier-badge">
                        {row.ratingImg ? (
                          <img
                            src={row.ratingImg}
                            alt={`Тир ${row.rating}`}
                            className="tier-lists__tier-img"
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove(
                                "visually-hidden",
                              )
                            }}
                          />
                        ) : null}
                        <span
                          className={`tier-lists__tier-text ${row.ratingImg ? "visually-hidden" : ""}`}
                        >
                          {row.rating}
                        </span>
                      </div>

                      {/* Список персонажей в тире */}
                      <div className="tier-lists__resonators-grid">
                        {resonatorsInRow.length > 0 ? (
                          resonatorsInRow.map(resonator => (
                            <Link
                              key={resonator.id}
                              to={`/resonator/${resonator.engName}`}
                              className="tier-lists__resonator-card"
                            >
                              <div className={`resonator-card__image-wrapper ${resonator.rarity == 4 && "resonator-card__image-wrapper_4"}`.trim()}>
                                <img
                                  src={
                                    resonator.resonatorImgMini ||
                                    resonator.resonatorImg
                                  }
                                  alt={resonator.name}
                                  className={`resonator-card__image`}
                                  loading="lazy"
                                  onError={e => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder-character.png"
                                  }}
                                />
                                <img
                                  className="resonator-card__element-img"
                                  src={
                                    elements.find(
                                      itemEl =>
                                        itemEl.id.toLocaleLowerCase() ===
                                        resonator.element.toLocaleLowerCase(),
                                    )?.iconUrl
                                  }
                                  alt={resonator.element}
                                />
                              </div>
                              <div className="resonator-card__info">
                                <span className="resonator-card__name">
                                  {resonator.name}
                                </span>
                                {resonator.engName && (
                                  <span className="resonator-card__eng-name">
                                    {resonator.engName}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <span className="tier-lists__empty-row">
                            В этом тире пока нет персонажей
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
