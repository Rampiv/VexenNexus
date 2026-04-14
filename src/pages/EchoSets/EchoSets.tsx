import { useEffect, useMemo, useState } from "react"
import { Loader } from "../../components"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../firebase/config"
import type { EchoSet } from "../../types/echoSet" // Убедитесь, что тип экспортирован
import "./EchoSets.scss"
import { useParams } from "react-router"

export const EchoSets = () => {
  const { engName: urlEngName } = useParams<{ engName: string }>()

  const [loading, setLoading] = useState(true)
  const [echoSetsAll, setEchoSetsAll] = useState<EchoSet[]>([])

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const echoSnap = await getDocs(
          query(collection(db, "echo_sets"), orderBy("name")),
        )
        const echoList = echoSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as EchoSet[]
        setEchoSetsAll(echoList)
        setLoading(false)
      } catch (err) {
        console.error("Ошибка загрузки эхо-сетов:", err)
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

    const foundSet = echoSetsAll.find(
      s => s.engName?.toLowerCase() === urlEngName.toLowerCase(),
    )

    if (foundSet) {
      setSearchTerm(foundSet.name)
    }
  }, [urlEngName, echoSetsAll])

  const filteredAndSortedSets = useMemo(() => {
    let result = echoSetsAll

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.engName.toLowerCase().includes(term),
      )
    }

    return result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
  }, [searchTerm, echoSetsAll])

  if (loading) {
    return <Loader width="100px" height="100px" />
  }

  return (
    <section className="echo-sets">
      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск эхо-сета..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="echo-sets__search"
        maxLength={30}
      />

      <ul className="echo-sets__list">
        {filteredAndSortedSets.length > 0 ? (
          filteredAndSortedSets.map((item, index) => {
            return (
              <li className="echo-sets__item" key={`эхо сеты ${index}`}>
                <div className="echo-sets__title-block">
                  <img
                    src={item.img}
                    alt="Картинка сета"
                    className="echo-sets__img"
                  />
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
                </div>
              </li>
            )
          })
        ) : (
          <></>
        )}
      </ul>
    </section>
  )
}
