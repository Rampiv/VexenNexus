import { useEffect, useMemo, useState } from "react"
import type { EchoSet } from "../../types/echoSet"
import type { Resonator } from "../../types/resonator"
import "./EchoCard.scss"
import { Link } from "react-router"
import { ResonatorLink } from "../ResonatorLink"
import type { ElementData } from "../Resonators/Resonators"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/config"

interface Props {
  EchoSet: EchoSet
  index?: number
  allResonators?: Resonator[]
}

export const EchoCard = ({ EchoSet: item, index, allResonators }: Props) => {
  const [elements, setElements] = useState<ElementData[]>([])

  const suitableResonators = useMemo(() => {
    if (!item.suitableResonatorIds?.length) return []
    if (!allResonators) return
    return allResonators.filter(r =>
      item.suitableResonatorIds?.includes(r.id || ""),
    )
  }, [item.suitableResonatorIds, allResonators])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Загрузка стихий
        const elementsSnap = await getDocs(collection(db, "elements"))
        const elementsList = elementsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ElementData[]
        setElements(elementsList)
      } catch (error) {
        console.error("Ошибка загрузки данных Resonators:", error)
      }
    }

    fetchData()
  }, [])

  if (!item) return null

  return (
    <div className="echo-sets__item" key={`эхо сеты ${index} ${item.id}`}>
      <div className="echo-sets__title-block">
        <img src={item.img} alt="Картинка сета" className="echo-sets__img" />
        <h2 className="echo-sets__h2">{item.name}</h2>
      </div>
      <div className="echo-sets__descr-block">
        {item.twoPartsDescr && item.twoPartsDescr.length > 0 && (
          <>
            <h3 className="echo-sets__h3">2 - части</h3>
            {item.twoPartsDescr.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text"
                  key={`ключ текста эхо сетов 2 частей ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {item.fivePartsDescr && item.fivePartsDescr.length > 0 && (
          <>
            <span className="echo-sets__line"></span>
            <h3 className="echo-sets__h3">5 - частей</h3>
            {item.fivePartsDescr.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text"
                  key={`ключ текста эхо сетов 5 частей ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {item.threePartsDescr && item.threePartsDescr.length > 0 && (
          <>
            <h3 className="echo-sets__h3">3 - части</h3>
            {item.threePartsDescr.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text"
                  key={`ключ текста эхо сетов 3 части ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {item.important && item.important.length > 0 && (
          <>
            <h4 className="echo-sets__h4">Важно:</h4>
            {item.important.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text-2"
                  key={`ключ текста ваажно ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {suitableResonators && suitableResonators.length > 0 && (
          <div className="echo-sets__resonators">
            <h4 className="echo-sets__h4">Подходит персонажам:</h4>
            <ul className="echo-sets__resonators-list">
              {suitableResonators.map((res, index) => (
                <li
                  className="echo-sets__resonators-item"
                  key={`карточки резонатора в эхо карточке ${index} ${res.id}`}
                >
                  <ResonatorLink item={res} elements={elements} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
