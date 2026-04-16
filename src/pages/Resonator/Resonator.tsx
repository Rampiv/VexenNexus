import { Link, useParams } from "react-router"
import "./Resonator.scss"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/config"
import type { Resonator } from "../../types/resonator"
import { Loader, YouTubePlayer } from "../../components"
import { useResonators } from "../../hook/useResonators"
import { useEchoSets } from "../../hook/useEchoSets"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

const getResonatorByEngName = async (
  engName: string,
): Promise<Resonator | null> => {
  try {
    const q = query(
      collection(db, "resonators"),
      where("engName", "==", engName),
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log("Персонаж не найден")
      return null
    }

    const doc = querySnapshot.docs[0]

    return {
      id: doc.id,
      ...doc.data(),
    } as Resonator
  } catch (error) {
    console.error("Ошибка при поиске персонажа:", error)
    return null
  }
}

export const ResonatorPage = () => {
  const { engName } = useParams<{ engName: string }>()
  const [loadingCommon, setLoading] = useState(true)
  const [resonator, setResonator] = useState<Resonator>()
  const { resonators: allResonators, loading: loadingResonators } =
    useResonators()
  const { echoSets: allEchoSets, loading: loadingEchoSets } = useEchoSets()
  // Состояние для лайтбокса
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isLightboxSrc, setIsLightboxSrc] = useState<string | undefined>()

  useEffect(() => {
    if (!engName) {
      setLoading(false)
      return
    }

    const loadCharacter = async () => {
      setLoading(true)
      const character = await getResonatorByEngName(engName)

      if (character) {
        setResonator(character)
      } else {
        setResonator(undefined)
      }
      setLoading(false)
    }
    loadCharacter()
  }, [engName])

  if (loadingCommon || loadingResonators || loadingEchoSets) {
    return <Loader width={"300px"} height={"300px"} />
  }

  if (!resonator) {
    return (
      <div className="resonator-not-found">
        Резонатор не найден или не указан
      </div>
    )
  }

  return (
    <section className="resonator">
      <div className="resonator__name-block">
        <img
          src={resonator.resonatorImg}
          alt={resonator.name}
          className="resonator__name-img"
        />
        <h2 className="resonator__h2">{resonator.name}</h2>
        <ul className="resonator__name-list">
          {resonator.descr &&
            resonator.descr.map((item, index) => {
              return (
                <li
                  className="resonator__name-item"
                  key={`резонатор описание ${index}`}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              )
            })}
        </ul>
      </div>
      <div className="resonator__YT-block">
        <h2 className="resonator__h2">Ролик по базе</h2>
        {resonator.resonatorYTLink ? (
          <YouTubePlayer
            videoUrl={resonator.resonatorYTLink}
            title={""}
            YT={resonator.resonatorPreview}
          />
        ) : (
          <img src={resonator.resonatorImgGuide} alt="Превью видео" />
        )}
      </div>
      <div className="resonator__guide-block">
        <h2 className="resonator__h2">Мини-гайд</h2>
        {resonator.resonatorImgGuide ? (
          <img
            src={resonator.resonatorImgGuide}
            alt="Гайд"
            className="resonator__guide-img"
            onClick={() => {
              setIsLightboxSrc(resonator.resonatorImgGuide)
              setIsLightboxOpen(true)
            }}
            style={{ cursor: "zoom-in" }}
          />
        ) : (
          "Гайд в процессе написания"
        )}
      </div>
      <div className="resonator__teams-block">
        <h2 className="resonator__h2">Отряды</h2>
        <div className="resonator__teams-lists">
          <ul className="teams-header">
            <li className="teams-header__item">1 слот</li>
            <li className="teams-header__item">2 слот</li>
            <li className="teams-header__item">3 слот</li>
          </ul>
          <ul className="teams">
            {resonator.teams &&
              resonator.teams.map((team, teamIndex) => (
                <li
                  className="teams__item"
                  key={`team-${team.name}-${teamIndex}`}
                >
                  <h3 className="resonator__h3">{team.name}</h3>

                  {team.rows.map((row, rowIndex) => (
                    <ul
                      className="teams__row-slots"
                      key={`row-${teamIndex}-${rowIndex}`}
                    >
                      {row.slots.map((slot, slotIndex) => {
                        // Находим персонажа по ID
                        const character = slot?.resonatorId
                          ? allResonators.find(r => r.id === slot.resonatorId)
                          : null

                        return (
                          <li
                            className="teams__slot"
                            key={`slot-${teamIndex}-${rowIndex}-${slotIndex}`}
                          >
                            {/* Отображение персонажа */}
                            {character ? (
                              <Link
                                to={`/resonator/${character.engName}`}
                                className="teams__character"
                              >
                                <img
                                  src={
                                    character.resonatorImgMini ||
                                    character.resonatorImg
                                  }
                                  alt={character.name}
                                  className="teams__char-img"
                                />
                                <span className="teams__char-name">
                                  {character.name}
                                </span>
                              </Link>
                            ) : (
                              <div className="teams__empty-slot">Пусто</div>
                            )}

                            {/* Отображение эхо-сетов */}
                            {slot?.echoSetIcons &&
                              slot.echoSetIcons.length > 0 && (
                                <div className="teams__echo-sets">
                                  {slot.echoSetIcons.map(
                                    (echoSetId, iconIdx) => {
                                      const echoSetObj = allEchoSets.find(
                                        es => es.id === echoSetId,
                                      )

                                      let echoLink = ""
                                      if (echoSetObj) {
                                        echoLink = echoSetObj.engName
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")
                                      }

                                      return (
                                        <Link
                                          to={`/echoSets/${echoLink}`}
                                          key={`ссылки на сеты ${iconIdx + echoSetId}`}
                                        >
                                          <img
                                            key={iconIdx}
                                            src={echoSetObj?.img || ""}
                                            alt={echoSetObj?.name || "Echo Set"}
                                            className="teams__echo-icon"
                                            title={
                                              echoSetObj?.name || "Эхо сет"
                                            }
                                          />
                                        </Link>
                                      )
                                    },
                                  )}
                                </div>
                              )}
                          </li>
                        )
                      })}
                    </ul>
                  ))}
                </li>
              ))}
          </ul>
        </div>
      </div>
      {resonator.resonatorImgDetails && (
        <div className="resonator__details-block">
          <h2 className="resonator__h2">Детальный подсчет</h2>
          <img
            src={resonator.resonatorImgDetails}
            alt="картинка деталей"
            className="resonator__details-img"
            onClick={() => {
              setIsLightboxSrc(resonator.resonatorImgDetails)
              setIsLightboxOpen(true)
            }}
            style={{ cursor: "zoom-in" }}
          />
        </div>
      )}

      <div className="resonator__result">
        <h2 className="resonator__h2">Заключение</h2>
        <ul className="result">
          {resonator.result
            ? resonator.result.map((item, index) => {
                return (
                  <li className="result__item" key={`Результат ${index}`}>
                    {item}
                  </li>
                )
              })
            : "Заключение в процессе написания"}
        </ul>
      </div>
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={[{ src: isLightboxSrc || "" }]}
      />
    </section>
  )
}
