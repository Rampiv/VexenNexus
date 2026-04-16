import { Link } from "react-router"
import "./Greeting.scss"
import { DataLinks } from "../../data"
import { Loader, RealiseTimer } from "../../components"
import { Resonators } from "../../components/Resonators"
import { useEffect, useState, useMemo } from "react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore"
import { db } from "../../firebase/config"
import type { SiteSettings } from "../../types/siteSettings"

interface UpdateItem {
  id: string
  title: string
  link: string
  date: string
  type: "Добавлено" | "Изменено"
}

const links = [
  { link: "/weapons/", title: "Оружия" },
  { link: "/echoSets/", title: "Сеты" },
  // { link: "/", title: "Тир-листы" },
  // { link: "/", title: "Механики" },
]

export const Greeting = () => {
  const [patchDate, setPatchDate] = useState<number>(0)
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [futureResonatorIds, setFutureResonatorIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [previewImg, setPreviewImg] = useState<string>("")
  const [filterImg, setFilterImg] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Загрузка настроек (Дата патча и ID будущих персонажей)
        const settingsRef = doc(db, "settings", "site_settings")
        const settingsSnap = await getDoc(settingsRef)

        if (settingsSnap.exists()) {
          const data = settingsSnap.data() as SiteSettings

          // Дата патча
          if (data.nextBannerDate) {
            setPatchDate(new Date(data.nextBannerDate).getTime())
          }

          // ID будущих персонажей
          if (data.futureResonatorIds) {
            setFutureResonatorIds(data.futureResonatorIds)
          }

          // preview картинка
          if (data.preview_img) {
            setPreviewImg(data.preview_img)
          }
          if (data.filter_img) {
            setFilterImg(data.filter_img)
          }
        }

        // 2. Загрузка последних изменений (Changelog)
        // Увеличим лимит, чтобы при фильтрации дублей осталось хотя бы 5 уникальных записей
        const updatesQuery = query(
          collection(db, "updates"),
          orderBy("date", "desc"),
          limit(20), 
        )
        const updatesSnap = await getDocs(updatesQuery)

        const updatesList = updatesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as UpdateItem[]
        
        setUpdates(updatesList)
      } catch (error) {
        console.error("Ошибка загрузки данных приветствия:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Мемоизируем очищенный список обновлений
  const uniqueUpdates = useMemo(() => {
    const map = new Map<string, UpdateItem>()

    updates.forEach(item => {
      // Ключ для группировки: "Тип: Название"
      const key = `${item.type}: ${item.title}`
      
      // Если такой записи еще нет или текущая запись новее уже сохраненной
      if (!map.has(key)) {
        map.set(key, item)
      } else {
        const existingItem = map.get(key)!
        const currentDate = new Date(item.date).getTime()
        const existingDate = new Date(existingItem.date).getTime()

        if (currentDate > existingDate) {
          map.set(key, item)
        }
      }
    })

    // Преобразуем Map обратно в массив и сортируем по дате (сначала новые)
    return Array.from(map.values()).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [updates])

  const formatDate = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  if (loading) {
    return <Loader width="200px" height="300px" />
  }

  return (
    <>
      <section className="greeting">
        <div className="greeting__block preview-block">
          <div className="preview-block__img-block">
            <img
              src={previewImg}
              alt="previewHub"
              className="preview-block__img"
            />
            <ul className="preview-block__list">
              {DataLinks &&
                DataLinks.map((item, index) => {
                  return (
                    <li
                      className="preview-block__item"
                      key={`preview-block__item ${index}`}
                    >
                      <Link
                        to={item.link}
                        className="preview-block__link"
                        title={`Перейти в ${item.text}`}
                      >
                        <item.img />
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>
          <p className="preview-block__descr">
            VEXEN HUB - В этом месте ты найдешь все что нужно игроку Wuthering
            Waves. Гайды на персонажей, руководства по ротациям и подсчеты цифр
            урона!
          </p>
        </div>
        <div className="greeting__block nav-block">
          <h2 className="nav-block__h2">Навигация</h2>
          <ul className="nav-block__list">
            {links.map((item, index) => {
              return (
                <li
                  className="nav-block__item"
                  key={`${index}список ссылок greeting`}
                >
                  <Link to={item.link} className="nav-block__link">
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        {/* Последние изменения (из Firebase) */}
        <div className="greeting__block changes-block">
          <h2 className="nav-block__h2">Последние изменения</h2>
          <ul className="changes-block__list">
            {uniqueUpdates.length > 0 ? (
              // Показываем только первые 5 уникальных записей
              uniqueUpdates.slice(0, 5).map(item => (
                <li className="changes-block__item" key={item.id}>
                  <p className="changes-block__descr">{`${item.type}: ${item.title}`}</p>
                  <p className="changes-block__data">
                    {item.date ? `- ${formatDate(item.date)} -` : ""}
                  </p>
                </li>
              ))
            ) : (
              <li className="changes-block__item">Нет новых изменений</li>
            )}
          </ul>
        </div>
        <Resonators
          customClassname={"greeting__resonators"}
          filterBackImg={filterImg}
        />
        {/* Баннеры и Таймер */}
        <div className="greeting__block banners-block">
          <div className="banners-block__timer-container">
            <div className="banners-block__timer">
              <h3 className="banners-block__h3">Европа</h3>
              <RealiseTimer newDateProp={patchDate} region={"europe"} />
            </div>
            <div className="banners-block__timer">
              <h3 className="banners-block__h3">АЗИЯ</h3>
              <RealiseTimer newDateProp={patchDate} region={"asia"} />
            </div>
            <div className="banners-block__timer">
              <h3 className="banners-block__h3">АМЕРИКА</h3>
              <RealiseTimer newDateProp={patchDate} region={"america"} />
            </div>
          </div>

          <p className="banners-block__descr">
            Дата релиза:{" "}
            <span className="banners-block__descr-date">
              {patchDate
                ? new Date(patchDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })
                : "Скоро"}
            </span>
          </p>

          {/* Отображение будущих персонажей на баннере */}
          <ul className="banners-block__banners">
            {futureResonatorIds.map(id => (
              <FutureResonatorBanner key={id} resonatorId={id} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

const FutureResonatorBanner = ({ resonatorId }: { resonatorId: string }) => {
  const [resonator, setResonator] = useState<any>(null)

  useEffect(() => {
    const fetchResonator = async () => {
      try {
        const docRef = doc(db, "resonators", resonatorId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setResonator({ id: docSnap.id, ...docSnap.data() })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchResonator()
  }, [resonatorId])

  if (!resonator) return null

  return (
    <li className="banners-block__item">
      <img
        src={resonator.resonatorImgBanner || resonator.resonatorImg}
        alt={resonator.name}
      />
    </li>
  )
}