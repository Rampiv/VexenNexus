import { useParams, Link, useNavigate } from "react-router"
import "./TierLists.scss"
import { useEffect, useMemo, useState } from "react"
import { Loader } from "../../components"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore"
import { db } from "../../firebase/config"
import type {
  TierList,
  TierListDescription,
  TierListRow,
} from "../../types/TierList"
import { useResonators } from "../../hook/useResonators"
import DOMPurify from "dompurify"
import type {
  SettingsDescription,
  SiteSettings,
} from "../../types/siteSettings"

interface ElementData {
  id: string
  name: string
  iconUrl: string
}

type Role = "dps" | "hybrid" | "support"

export const TierLists = () => {
  const { name: urlName } = useParams<{ name: string }>()
  const [loading, setLoading] = useState(true)
  const [tierListsAll, setTierListsAll] = useState<TierList[]>([])
  const { resonators: allResonators, loading: loadingResonators } =
    useResonators()
  const [elements, setElements] = useState<ElementData[]>([])
  const [selectedTierList, setSelectedTierList] = useState("")
  const navigate = useNavigate()
  const [openDescriptions, setOpenDescriptions] = useState<Set<number>>(
    new Set(),
  )
  const [tierListsDescr, setTierListsDescr] = useState<SettingsDescription[]>(
    [],
  )

  const toggleDescription = (index: number) => {
    setOpenDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

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
    const fetchData = async () => {
      try {
        const settingsRef = doc(db, "settings", "site_settings")
        const settingsSnap = await getDoc(settingsRef)

        if (settingsSnap.exists()) {
          const data = settingsSnap.data() as SiteSettings

          if (data.tierListDescriptions) {
            setTierListsDescr(data.tierListDescriptions)
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки данных приветствия:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const foundTierList = tierListsAll.find(s => s.name === urlName)

    if (foundTierList) {
      setSelectedTierList(foundTierList.name)
    }
  }, [urlName, tierListsAll])

  const filteredAndSorted = useMemo(() => {
    let result: any[] = []

    if (selectedTierList) {
      const term = selectedTierList.toLowerCase()
      result = tierListsAll.filter(item =>
        item.name?.toLowerCase().includes(term),
      )
    }
    return result
  }, [selectedTierList, tierListsAll])

  const getResonatorById = (id: string) => {
    return allResonators.find(r => r.id === id)
  }

  const getResonatorsByRole = (row: TierListRow, role: Role) => {
    const ids =
      role === "dps"
        ? row.dpsResonatorIds
        : role === "hybrid"
          ? row.hybridResonatorIds
          : row.supportResonatorIds

    return (ids || [])
      .map(id => getResonatorById(id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined)
  }

  const handleFilterClick = (id: string) => {
    navigate(`/tierlists/${id}`)
  }

  if (loading || loadingResonators) {
    return <Loader width="100px" height="100px" />
  }

  return (
    <section className="tier-lists">
      {/* === Блок с описаниями (аккордеон) === */}
      <ul className="tier-lists-descr">
        {tierListsDescr?.map(
          (descrItem: TierListDescription, descrIndex: number) => {
            const isOpen = openDescriptions.has(descrIndex)

            return (
              <li
                className={`tier-lists-descr__item ${isOpen ? "tier-lists-descr__item--open" : ""}`}
                key={`tier-lists-descr-${descrIndex}`}
              >
                <button
                  type="button"
                  className="tier-lists-descr__header"
                  onClick={() => toggleDescription(descrIndex)}
                  aria-expanded={isOpen}
                  aria-controls={`descr-content-${descrIndex}`}
                >
                  <h3 className="tier-lists-descr__h3">{descrItem.title}</h3>
                  <p className="tier-lists-descr__toggle">
                    {isOpen ? "<" : ">"}
                  </p>
                </button>

                <div
                  id={`descr-content-${descrIndex}`}
                  className={`tier-lists-descr__content ${isOpen ? "tier-lists-descr__content--open" : ""}`}
                >
                  <article
                    className="tier-lists-descr__article"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(descrItem.content),
                    }}
                  />
                </div>
              </li>
            )
          },
        )}
      </ul>

      {/* === Заголовок и фильтры === */}
      <h1 className="tier-lists__h1">Выберете тирлист</h1>
      <div className="tier-lists__filters">
        {tierListsAll.map(tierList => (
          <button
            key={tierList.id}
            className={`tier-lists__filter-btn ${urlName === tierList.name ? "tier-lists__filter-btn--active" : ""}`}
            onClick={() => handleFilterClick(tierList.name)}
            title={tierList.name}
          >
            {tierList.nameImg ? (
              <img
                src={tierList.nameImg}
                alt={tierList.name}
                className="tier-lists__filter-img"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            ) : (
              <span className="tier-lists__filter-name">{tierList.name}</span>
            )}
          </button>
        ))}
      </div>

      {/* === Список тир-листов === */}
      {filteredAndSorted && (
        <ul className="tier-lists__list">
          {filteredAndSorted.map(tierList => (
            <li className="tier-lists__item" key={tierList.id}>
              <h2 className="tier-lists__title">
                <span>{tierList.name}</span>
              </h2>

              <ul className="tier-lists__rows">
                {tierList.rows?.map((row: TierListRow, rowIndex: number) => {
                  const dpsResonators = getResonatorsByRole(row, "dps")
                  const hybridResonators = getResonatorsByRole(row, "hybrid")
                  const supportResonators = getResonatorsByRole(row, "support")

                  return (
                    <li className="tier-lists__row" key={row.id || rowIndex}>
                      {/* Бейдж тира */}

                      <div
                        className="tier-lists__tier-badge"
                        style={
                          {
                            "--rarity-color-badge": row.ratingColor,
                          } as React.CSSProperties
                        }
                      >
                        {rowIndex === 0 && (
                          <div className="tier-lists__role-column-title opacityHide">
                            ТИР
                          </div>
                        )}
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

                      {/* Колонки с ролями */}
                      <div className="tier-lists__role-columns">
                        {/* DPS Column */}
                        <div className="tier-lists__role-column column-dps">
                          {rowIndex === 0 && (
                            <div className="tier-lists__role-column-title column-dps">
                              МДД
                            </div>
                          )}
                          <div className="tier-lists__resonators-grid">
                            {dpsResonators.length > 0 ? (
                              dpsResonators.map(resonator => {
                                if (!resonator.id) return null
                                const settings =
                                  row.resonatorSettings?.[resonator.id]
                                const status = settings?.status

                                return (
                                  <Link
                                    key={resonator.id}
                                    to={`/resonator/${resonator.engName}`}
                                    className="tier-lists__resonator-card"
                                  >
                                    <div
                                      className={`resonator-card__image-wrapper ${resonator.rarity == 4 ? "resonator-card__image-wrapper_4" : ""}`}
                                    >
                                      {status && (
                                        <svg
                                          width="25"
                                          height="25"
                                          viewBox="0 0 25 25"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className={`resonator-card__status-img ${status === "up" ? "resonator-card__status-img_green" : "resonator-card__status-img_red"}`}
                                        >
                                          <g
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M 7 9 L 12.5 4 L 18 9" />
                                            <path d="M 7 14 L 12.5 9 L 18 14" />
                                            <path d="M 7 19 L 12.5 14 L 18 19" />
                                          </g>
                                        </svg>
                                      )}
                                      <img
                                        src={
                                          resonator.resonatorImgMini ||
                                          resonator.resonatorImg
                                        }
                                        alt={resonator.name}
                                        className="resonator-card__image"
                                        loading="lazy"
                                        onError={e => {
                                          const target =
                                            e.target as HTMLImageElement
                                          target.src =
                                            "/placeholder-character.png"
                                        }}
                                      />
                                      <img
                                        className="resonator-card__element-img"
                                        src={
                                          elements.find(
                                            el =>
                                              el.id?.toLowerCase() ===
                                              resonator.element?.toLowerCase(),
                                          )?.iconUrl
                                        }
                                        alt={resonator.element}
                                      />
                                    </div>
                                    <div className="resonator-card__info">
                                      <span className="resonator-card__name">
                                        {resonator.name}
                                      </span>
                                    </div>
                                    {settings &&
                                      settings?.tags?.filter(
                                        (t: { text: string }) => t.text.trim(),
                                      ).length > 0 && (
                                        <div className="resonator-card__tags-list">
                                          {settings.tags
                                            .filter((t: { text: string }) =>
                                              t.text.trim(),
                                            )
                                            .map(
                                              (tag: {
                                                id: string
                                                text: string
                                                color: string
                                              }) => (
                                                <span
                                                  key={tag.id}
                                                  className="resonator-card__tag"
                                                  style={{ color: tag.color }}
                                                >
                                                  {tag.text}
                                                </span>
                                              ),
                                            )}
                                        </div>
                                      )}
                                  </Link>
                                )
                              })
                            ) : (
                              <span className="tier-lists__empty-role">—</span>
                            )}
                          </div>
                        </div>

                        {/* HYBRID Column */}
                        <div className="tier-lists__role-column column-hybrid">
                          {rowIndex === 0 && (
                            <div className="tier-lists__role-column-title column-hybrid">
                              САП-ДД
                            </div>
                          )}
                          <div className="tier-lists__resonators-grid">
                            {hybridResonators.length > 0 ? (
                              hybridResonators.map(resonator => {
                                if (!resonator.id) return null
                                const settings =
                                  row.resonatorSettings?.[resonator.id]
                                const status = settings?.status

                                return (
                                  <Link
                                    key={resonator.id}
                                    to={`/resonator/${resonator.engName}`}
                                    className="tier-lists__resonator-card"
                                  >
                                    <div
                                      className={`resonator-card__image-wrapper ${resonator.rarity == 4 ? "resonator-card__image-wrapper_4" : ""}`}
                                    >
                                      {status && (
                                        <svg
                                          width="25"
                                          height="25"
                                          viewBox="0 0 25 25"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className={`resonator-card__status-img ${status === "up" ? "resonator-card__status-img_green" : "resonator-card__status-img_red"}`}
                                        >
                                          <g
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M 7 9 L 12.5 4 L 18 9" />
                                            <path d="M 7 14 L 12.5 9 L 18 14" />
                                            <path d="M 7 19 L 12.5 14 L 18 19" />
                                          </g>
                                        </svg>
                                      )}
                                      <img
                                        src={
                                          resonator.resonatorImgMini ||
                                          resonator.resonatorImg
                                        }
                                        alt={resonator.name}
                                        className="resonator-card__image"
                                        loading="lazy"
                                        onError={e => {
                                          const target =
                                            e.target as HTMLImageElement
                                          target.src =
                                            "/placeholder-character.png"
                                        }}
                                      />
                                      <img
                                        className="resonator-card__element-img"
                                        src={
                                          elements.find(
                                            el =>
                                              el.id?.toLowerCase() ===
                                              resonator.element?.toLowerCase(),
                                          )?.iconUrl
                                        }
                                        alt={resonator.element}
                                      />
                                    </div>
                                    <div className="resonator-card__info">
                                      <span className="resonator-card__name">
                                        {resonator.name}
                                      </span>
                                    </div>
                                    {settings &&
                                      settings?.tags?.filter(
                                        (t: { text: string }) => t.text.trim(),
                                      ).length > 0 && (
                                        <div className="resonator-card__tags-list">
                                          {settings.tags
                                            .filter((t: { text: string }) =>
                                              t.text.trim(),
                                            )
                                            .map(
                                              (tag: {
                                                id: string
                                                text: string
                                                color: string
                                              }) => (
                                                <span
                                                  key={tag.id}
                                                  className="resonator-card__tag"
                                                  style={{ color: tag.color }}
                                                >
                                                  {tag.text}
                                                </span>
                                              ),
                                            )}
                                        </div>
                                      )}
                                  </Link>
                                )
                              })
                            ) : (
                              <span className="tier-lists__empty-role">—</span>
                            )}
                          </div>
                        </div>

                        {/* SUPPORT Column */}
                        <div className="tier-lists__role-column column-support">
                          {rowIndex === 0 && (
                            <div className="tier-lists__role-column-title column-support">
                              САППОРТ
                            </div>
                          )}
                          <div className="tier-lists__resonators-grid">
                            {supportResonators.length > 0 ? (
                              supportResonators.map(resonator => {
                                if (!resonator.id) return null
                                const settings =
                                  row.resonatorSettings?.[resonator.id]
                                const status = settings?.status

                                return (
                                  <Link
                                    key={resonator.id}
                                    to={`/resonator/${resonator.engName}`}
                                    className="tier-lists__resonator-card"
                                  >
                                    <div
                                      className={`resonator-card__image-wrapper ${resonator.rarity == 4 ? "resonator-card__image-wrapper_4" : ""}`}
                                    >
                                      {status && (
                                        <svg
                                          width="25"
                                          height="25"
                                          viewBox="0 0 25 25"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className={`resonator-card__status-img ${status === "up" ? "resonator-card__status-img_green" : "resonator-card__status-img_red"}`}
                                        >
                                          <g
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M 7 9 L 12.5 4 L 18 9" />
                                            <path d="M 7 14 L 12.5 9 L 18 14" />
                                            <path d="M 7 19 L 12.5 14 L 18 19" />
                                          </g>
                                        </svg>
                                      )}
                                      <img
                                        src={
                                          resonator.resonatorImgMini ||
                                          resonator.resonatorImg
                                        }
                                        alt={resonator.name}
                                        className="resonator-card__image"
                                        loading="lazy"
                                        onError={e => {
                                          const target =
                                            e.target as HTMLImageElement
                                          target.src =
                                            "/placeholder-character.png"
                                        }}
                                      />
                                      <img
                                        className="resonator-card__element-img"
                                        src={
                                          elements.find(
                                            el =>
                                              el.id?.toLowerCase() ===
                                              resonator.element?.toLowerCase(),
                                          )?.iconUrl
                                        }
                                        alt={resonator.element}
                                      />
                                    </div>
                                    <div className="resonator-card__info">
                                      <span className="resonator-card__name">
                                        {resonator.name}
                                      </span>
                                    </div>
                                    {settings &&
                                      settings?.tags?.filter(
                                        (t: { text: string }) => t.text.trim(),
                                      ).length > 0 && (
                                        <div className="resonator-card__tags-list">
                                          {settings.tags
                                            .filter((t: { text: string }) =>
                                              t.text.trim(),
                                            )
                                            .map(
                                              (tag: {
                                                id: string
                                                text: string
                                                color: string
                                              }) => (
                                                <span
                                                  key={tag.id}
                                                  className="resonator-card__tag"
                                                  style={{ color: tag.color }}
                                                >
                                                  {tag.text}
                                                </span>
                                              ),
                                            )}
                                        </div>
                                      )}
                                  </Link>
                                )
                              })
                            ) : (
                              <span className="tier-lists__empty-role">—</span>
                            )}
                          </div>
                        </div>
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
