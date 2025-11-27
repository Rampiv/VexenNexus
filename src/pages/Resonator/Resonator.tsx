import { useParams } from "react-router"
import { DataResonators } from "../../data"
import "./Resonator.scss"
import { Accordion, Table, YouTubePlayer } from "../../components"
import marker from "@assets/icons/marker.webp"
import { useEffect, useMemo, useState } from "react"

const contentsList = [
  { title: "РОЛИК ПО БАЗЕ", href: "YTGuide" },
  { title: "МИНИ-ГАЙД", href: "miniGuide" },
  { title: "ПЛЮСЫ И МИНУСЫ", href: "plusminus" },
  { title: "ПОЛЬЗА ПЕРСОНАЖА", href: "utility" },
  { title: "ПОРЯДОК ПРОКАЧКИ", href: "pumping" },
  { title: "РАСПРЕДЕЛЕНИЕ УРОНА", href: "damage" },
  { title: "ОРУЖИЕ", href: "weapon" },
  { title: "СОЗВЕЗДИЯ", href: "constellation" },
  { title: "ОТРЯДЫ", href: "team" },
  { title: "ФИНАЛЬНЫЙ ОБЗОР", href: "final" },
]

const glossaryDataStandart = [
  {
    Термин: "Квик свап (Quick-swap)",
    Определение:
      "Быстрое переключение на других персонажей в команде для активации умений или эффектов с последующим возвращением обратно.",
    id: "QuickSwap",
  },
  {
    Термин: "Бафф",
    Определение:
      "Положительный эффект, усиливающий союзников (например, увеличение урона или скорости атаки)",
    id: "Buff",
  },
  {
    Термин: "Негативные статусы",
    Определение:
      "Дебаффы, накладываемые на врагов и вызывающие периодический урон, снижение характеристик (например, защиты или скорости передвижения) или особые состояния (например, заморозку). ",
    id: "Debuff",
  },
  {
    Термин: "МДД",
    Определение: "Главный наносящий урон персонаж (Main DPS)",
    id: "MainDPS",
  },
  {
    Термин: "Пассивное умение",
    Определение:
      "Навык который встроен в персонажа и работает всегда или требуют активации некоторыми действиями",
    id: "Passive",
  },
  {
    Термин: "Интро",
    Определение:
      "Навык 'вступления в бой', когда с помощью разряда концерта мы переключаемся на дургого персонажа, то этот 'другой' персонаж активирует интро умение",
    id: "Intro",
  },
  {
    Термин: "Аутро",
    Определение:
      "Навык 'выход из боя', когда с помощью разряда концерта мы переключаемся на дургого персонажа, то наш нынешний персонаж во время переключения активирует аутро умение",
    id: "Autro",
  },
  {
    Термин: "Энергия концерта",
    Определение:
      "Энергия, необходимая для выполнения навыков Интро (вступления в бой) и Аутро (выход из боя) при смене персонажей",
    id: "Concert",
  },
]

export const Resonator = () => {
  const { id } = useParams<{ id: string }>()
  // Состояние для отображения кнопки "Наверх"
  const [showUpButton, setShowUpButton] = useState(false)
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined)
  const [isGlossaryExpanded, setIsGlossaryExpanded] = useState(false)
  const [userManuallyClosed, setUserManuallyClosed] = useState(false)

  const resonator = DataResonators.find(
    res => res.engName.toLocaleLowerCase() === id?.toLocaleLowerCase(),
  )
  const glossaryData = useMemo(() => {
    return [...glossaryDataStandart, ...(resonator?.GlossaryTerm || [])]
  }, [resonator?.GlossaryTerm])

  useEffect(() => {
    const handleScroll = () => {
      // Показываем кнопку, если прокрутили больше 100vh
      setShowUpButton(window.scrollY > window.innerHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const isKnownTerm = glossaryData.some(item => item.id === hash)

      if (isKnownTerm) {
        setHighlightId(hash)
        // Раскрываем ТОЛЬКО если пользователь не закрывал вручную
        if (!userManuallyClosed) {
          setIsGlossaryExpanded(true)
        }
      } else {
        setHighlightId(undefined)
      }

      // Прокрутка к элементу (если нужно) — но только если он существует
      if (isKnownTerm && (isGlossaryExpanded || !userManuallyClosed)) {
        // Мы отложим прокрутку немного, чтобы убедиться, что DOM обновился
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 100)
      }
    }

    // Запускаем при монтировании
    handleHashChange()

    // Слушаем изменения хеша
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [userManuallyClosed, isGlossaryExpanded, glossaryData])

  // Обработчик переключения аккордиона
  const handleGlossaryToggle = (newState: boolean) => {
    setIsGlossaryExpanded(newState)
    // Если пользователь закрыл — запоминаем это
    if (!newState) {
      setUserManuallyClosed(true)
    }
    // Если пользователь снова открыл вручную — сбрасываем флаг
    if (newState && userManuallyClosed) {
      setUserManuallyClosed(false)
    }
  }

  if (!id || !resonator) {
    return <div>Резонатор не указан</div>
  }

  return (
    <section className="resonator">
      <div className="container">
        <div className="resonator__container">
          {/* ИМЯ */}
          <div className="name">
            <img
              src={resonator.previewImg}
              alt="Превью резонатора"
              className="name__preview-img"
            />
            <div className="name__content">
              <h2 className="name__h2" id="up">
                {resonator.name}
              </h2>
              <p className="name__role">Роль: {resonator.role}</p>
            </div>
          </div>
          {/* содержание */}
          <div className="contents">
            <h2 className="contents__h2">Быстрое перемещение по главам:</h2>
            <ul className="contents__list">
              {contentsList.map(item => {
                return (
                  <li
                    className="contents__item"
                    key={`${item.title}+${item.href}`}
                  >
                    <img src={marker} alt="маркер" />
                    <a href={`#${item.href}`}>{item.title}</a>
                  </li>
                )
              })}
            </ul>
          </div>
          {/* глоссарий */}
          <div className="resonator__common-container glossary">
            <h2 className="resonator__h2">ГЛОССАРИЙ</h2>
            <Accordion
              buttonName={isGlossaryExpanded ? "Свернуть" : "Развернуть"}
              expanded={isGlossaryExpanded}
              onToggle={handleGlossaryToggle}
              className="glossary__accordion"
            >
              <Table
                columns={["Термин", "Определение"]}
                rows={glossaryData}
                highlightId={highlightId}
              ></Table>
            </Accordion>
          </div>
          {/* ютуб ролик */}
          <div
            className="resonator__common-container ytguide"
            id={contentsList[0].href}
          >
            <h2 className="resonator__h2">{contentsList[0].title}</h2>
            {resonator.youtubeVideoId ? (
              <YouTubePlayer
                videoId={resonator.youtubeVideoId}
                title="Ролик по базе Чисы"
                YT={resonator.youtubeVideoPreview}
              />
            ) : (
              <span className="ytguide__error-YT">Ролик не найден</span>
            )}
          </div>
          {/* мини гайд */}
          <div
            className="resonator__common-container miniguide"
            id={contentsList[1].href}
          >
            <h2 className="resonator__h2">{contentsList[1].title}</h2>
            <img src={resonator.MiniGuideImg} alt="Изображение мини гайда" />
          </div>
          {/* Плюсы и минусы */}
          <div
            className="resonator__common-container plusminus"
            id={contentsList[2].href}
          >
            <h2 className="resonator__h2">{contentsList[2].title}</h2>
            <p className="plusminus__descr">{resonator.BaseDescr}</p>
            <p className="plusminus__descr">
              выделим <span className="green">плюсы</span> и{" "}
              <span className="red">минусы</span>
            </p>
            <div className="plusminus__container">
              <div className="plusminus__plus">
                <h3 className="plusminus__h3">
                  <span className="green">Плюсы</span>
                </h3>
                <ul className="plusminus__list plusminus__plus-list">
                  {resonator.BasePlus &&
                    resonator.BasePlus.map((item, index) => {
                      return (
                        <li
                          className="plusminus__plus-item"
                          key={`plus ${index}`}
                        >
                          {item}
                        </li>
                      )
                    })}
                </ul>
              </div>
              <div className="plusminus__minus">
                <h3 className="plusminus__h3">
                  <span className="red">Минусы</span>
                </h3>
                <ul className="plusminus__list plusminus__minus-list">
                  {resonator.BaseMinus &&
                    resonator.BaseMinus.map((item, index) => {
                      return (
                        <li
                          className="plusminus__minus-item"
                          key={`minus ${index}`}
                        >
                          {item}
                        </li>
                      )
                    })}
                </ul>
              </div>
            </div>
          </div>
          {/* польза персонажа */}
          <div
            className="resonator__common-container utility"
            id={contentsList[3].href}
          >
            <h2 className="resonator__h2">{contentsList[3].title}</h2>
            <img
              src={resonator.Utility}
              alt="Утилити резонатора"
              className="utility__img"
            />
          </div>
          {/* прокачка */}
          <div
            className="resonator__common-container pumping"
            id={contentsList[4].href}
          >
            <h2 className="resonator__h2">{contentsList[4].title}</h2>
            <img
              src={resonator.PumpingImg}
              alt="Прокачка резонатора"
              className="pumping__img"
            />
          </div>
          {/* распределение урона */}
          <div
            className="resonator__common-container damage"
            id={contentsList[5].href}
          >
            <h2 className="resonator__h2">{contentsList[5].title}</h2>
            <img
              src={resonator.DamageImg}
              alt="Прокачка резонатора"
              className="damage__img"
            />
          </div>
          {/* оружие */}
          <div
            className="resonator__common-container weapon"
            id={contentsList[6].href}
          >
            <img
              src={resonator.WeaponPreview}
              alt="Превью оружия"
              className="resonator__common-preview"
            />
            <h2 className="resonator__h2">{contentsList[6].title}</h2>
            <img
              src={resonator.GlossaryImg}
              alt="глоссарий"
              className="weapon__glossary"
            />
            <ul className="weapon__list">
              {resonator.Weapon &&
                resonator.Weapon.map((item, index) => {
                  return (
                    <li className="weapon__item" key={`weapon - ${index}`}>
                      <img
                        src={item.weapon}
                        alt="Оружие"
                        className="weapon__item-weapon"
                      />
                      <img
                        src={item.damage}
                        alt="Дамаг оружия"
                        className="weapon__item-damage"
                      />
                    </li>
                  )
                })}
            </ul>
            <div className="weapon__descr-container">
              {resonator.WeaponDescr?.map((item, index) => {
                return <p key={index}>{item}</p>
              })}
            </div>
          </div>
          {/* созвездия */}
          <div
            className="resonator__common-container constellation"
            id={contentsList[7].href}
          >
            <img
              src={resonator.СonstellationPreview}
              alt="Превью созвездий"
              className="resonator__common-preview"
            />
            <h2 className="resonator__h2">{contentsList[7].title}</h2>
            <div className="constellation__descr">
              {resonator.ConstellarionDescr?.map((item, index) => {
                return <p key={`${item} ${index}`}>{item}</p>
              })}
              <h3 className="constellation__h3">
                Персональный урон за 1 ротацию
              </h3>
              <img src={resonator.ConstellarionTeamDamage} alt="Урон Team" />
              <h3 className="constellation__h3">
                Персональный урон за 3 ротации
              </h3>
              <img src={resonator.ConstellarionSoloDamage} alt="Урон Solo" />
              <h3 className="constellation__h3">
                Табличка с инвестицией в разных персонажей на примере лучшего
                отряда
              </h3>
              <img
                src={resonator.InvestmentsDamage}
                alt="Урон при инвестициях"
              />
              <p>{resonator.InvestmentsReview}</p>
            </div>
          </div>
          {/* отряды */}
          <div
            className="resonator__common-container team"
            id={contentsList[8].href}
          >
            <img
              src={resonator.TeamPreview}
              alt="Превью команды"
              className="resonator__common-preview"
            />
            <h2 className="resonator__h2">{contentsList[8].title}</h2>
            <ul className="team__list">
              {resonator.Team &&
                resonator.Team.map((item, index) => {
                  return (
                    <li className="team__item" key={`team ${index}`}>
                      <img src={item.img} alt="Команда" className="team__img" />
                      <Accordion buttonName={"Ротация"}>
                        {item.descr.map((item, index) => {
                          return (
                            <ul
                              key={`accordion item ${index}`}
                              className="team__accordion-list"
                            >
                              {item.text.map((element, index) => {
                                return (
                                  <li
                                    className="team__accordion-item"
                                    key={`accordion item ${index}`}
                                  >
                                    {element}
                                  </li>
                                )
                              })}
                              <img src={item.img} alt="Ротация" />
                            </ul>
                          )
                        })}
                      </Accordion>
                    </li>
                  )
                })}
            </ul>
          </div>
          {/* финальный обзор */}
          <div
            className="resonator__common-container review"
            id={contentsList[9].href}
          >
            <h2 className="resonator__h2">{contentsList[9].title}</h2>
            <p className="review__descr">{resonator.FinalReview?.descr}</p>
            <ul className="review__list">
              {resonator.FinalReview?.img &&
                resonator.FinalReview.img.map((item, index) => {
                  return (
                    <li className="review__item" key={`review ${index}`}>
                      <img
                        src={item}
                        alt="Финальная таблица"
                        className="review__img"
                      />
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
        {showUpButton && (
          <a className="resonator__up" href="#up">
            Наверх
          </a>
        )}
      </div>
    </section>
  )
}
