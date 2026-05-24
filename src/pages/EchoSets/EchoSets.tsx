import { useEffect, useMemo, useState } from "react"
import { EchoCard, Loader } from "../../components"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../firebase/config"
import type { EchoSet } from "../../types/echoSet"
import "./EchoSets.scss"
import { useParams } from "react-router"
import type { Resonator } from "../../types/resonator"

export const EchoSets = () => {
  const { engName: urlEngName } = useParams<{ engName: string }>()

  const [loading, setLoading] = useState(true)
  const [echoSetsAll, setEchoSetsAll] = useState<EchoSet[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatch, setSelectedPatch] = useState<string>("all")

  const [resonators, setResonators] = useState<Resonator[]>([])

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

        const resSnap = await getDocs(
        query(collection(db, "resonators"), orderBy("name")),
      )
      const resList = resSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Resonator[]
      setResonators(resList)

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

  // 1. Получаем уникальные patchNumber и сортируем их (опционально)
  const uniquePatches = useMemo(() => {
    const patches = new Set<string>()
    echoSetsAll.forEach(set => {
      if (set.patchNumber) {
        patches.add(set.patchNumber)
      }
    })
    // Преобразуем в массив и сортируем.
    // Если патчи имеют формат "1.1", "1.2", "2.0", простая строковая сортировка может работать некорректно для мажорных версий.
    // Для простоты используем localeCompare с numeric: true, если версии числовые.
    return Array.from(patches)
      .sort((a, b) => {
        // Попытка сортировки как версий (1.1 < 1.2 < 2.0)
        return a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      })
      .reverse() // Новые сверху
  }, [echoSetsAll])

  // 2. Фильтрация и сортировка
  const filteredAndSortedSets = useMemo(() => {
    let result = echoSetsAll

    // Фильтр по поиску
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.engName.toLowerCase().includes(term),
      )
    }

    // Фильтр по патчу
    if (selectedPatch && selectedPatch !== "all") {
      result = result.filter(item => item.patchNumber === selectedPatch)
    }

    // Сортировка по index (если index не задан, считаем его 9999, чтобы такие элементы были в конце)
    return result.sort((a, b) => {
      const indexA = a.index ?? 9999
      const indexB = b.index ?? 9999
      return indexA - indexB
    })
  }, [searchTerm, selectedPatch, echoSetsAll])

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

      {/* Фильтр по патчам */}
      {uniquePatches.length > 0 && (
        <div className="echo-sets__filters">
          <select
            value={selectedPatch}
            onChange={e => setSelectedPatch(e.target.value)}
            className="echo-sets__patch-select"
          >
            <option value="all">Все версии</option>
            {uniquePatches.map(patch => (
              <option key={patch} value={patch}>
                Версия {patch}
              </option>
            ))}
          </select>
        </div>
      )}

      <ul className="echo-sets__list">
        {filteredAndSortedSets.length > 0 ? (
          filteredAndSortedSets.map(item => {
            return <EchoCard key={item.id} EchoSet={item} allResonators={resonators}/>
          })
        ) : (
          <li className="echo-sets__empty">Ничего не найдено</li>
        )}
      </ul>
    </section>
  )
}
