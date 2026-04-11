import { useParams } from "react-router"
import "./Resonator.scss"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/config"
import type { Resonator } from "../../types/resonator"
import { YouTubePlayer } from "../../components"

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
  const [loading, setLoading] = useState(true)
  const [resonator, setResonator] = useState<Resonator>()

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

  if (loading) {
    return <>ЗАГРУЗКА</>
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
                >
                  {item}
                </li>
              )
            })}
        </ul>
      </div>
      <div className="resonator__YT-block">
        <h2 className="resonator__h2">Ролик по базе</h2>
        {resonator.resonatorYTLink ? (
          <YouTubePlayer
            videoId={resonator.resonatorYTLink}
            title={""}
            YT={resonator.resonatorPreview}
          />
        ) : (
          <img src={resonator.resonatorImgGuide} alt="Превью видео" />
        )}
      </div>
      <div className="resonator__guide-block">
        <h2 className="resonator__h2">Мини-гайд</h2>
        <img
          src={resonator.resonatorImgGuide}
          alt="Гайд"
          className="resonator__guide-img"
        />
      </div>
      <div className="resonator__teams-block">
        <h2 className="resonator__h2">Отряды</h2>
        <ul className="team"></ul>
        <ul className="teams">
          
        </ul>
      </div>
    </section>
  )
}
