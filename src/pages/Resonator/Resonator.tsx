import { useParams } from "react-router"
import { DataResonators } from "../../data"
import "./Resonator.scss"
import { Accordion, Table, YouTubePlayer } from "../../components"
import marker from "@assets/icons/marker.webp"
import { useEffect, useMemo, useState } from "react"
// Импортируем глобальный провайдер
import { GlossaryProvider } from "../../context/GlossaryContext"

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
  const [showUpButton, setShowUpButton] = useState(false)
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined)
  const [isGlossaryExpanded, setIsGlossaryExpanded] = useState(false)
  const [userManuallyClosed, setUserManuallyClosed] = useState(false)

  const resonator = DataResonators.find(
    res => res.engName.toLowerCase() === id?.toLowerCase(),
  )

  const glossaryData = useMemo(() => {
    return [...glossaryDataStandart, ...(resonator?.GlossaryTerm || [])]
  }, [resonator?.GlossaryTerm])

  // Скролл-контроль кнопки "Наверх"
  useEffect(() => {
    const handleScroll = () => {
      setShowUpButton(window.scrollY > window.innerHeight)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // =============== ФУНКЦИЯ ПЕРЕХОДА К ТЕРМИНУ В ГЛОССАРИИ ===============
  const scrollToGlossaryTerm = (termId: string) => {
    const isValidTerm = glossaryData.some(item => item.id === termId)
    if (!isValidTerm) return

    // Раскрываем глоссарий и выделяем термин
    setHighlightId(termId)
    setIsGlossaryExpanded(true)
    setUserManuallyClosed(false)

    // Ждём ререндер, затем скроллим к элементу
    setTimeout(() => {
      const el = document.getElementById(termId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 50)
  }

  const handleGlossaryToggle = (newState: boolean) => {
    setIsGlossaryExpanded(newState)
    if (!newState) {
      setUserManuallyClosed(true)
    } else if (userManuallyClosed) {
      setUserManuallyClosed(false)
    }
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (!id || !resonator) {
    return <div>Резонатор не указан</div>
  }

  return (
    <GlossaryProvider value={{ scrollToGlossaryTerm }}>
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

            {/* СОДЕРЖАНИЕ */}
            <div className="contents">
              <h2 className="contents__h2">Быстрое перемещение по главам:</h2>
              <ul className="contents__list">
                {contentsList.map(item => (
                  <li className="contents__item" key={item.href}>
                    <img src={marker} alt="маркер" />
                    <button
                      className="contents__link"
                      onClick={e => {
                        e.preventDefault()
                        scrollToSection(item.href)
                      }}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ГЛОССАРИЙ */}
            <div
              className="resonator__common-container glossary"
              id="glossaryContainer"
            >
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
                />
              </Accordion>
            </div>

            {/* ЮТУБ РОЛИК */}
            <div className="resonator__common-container ytguide" id="YTGuide">
              <h2 className="resonator__h2">РОЛИК ПО БАЗЕ</h2>
              {resonator.youtubeVideoId ? (
                <YouTubePlayer
                  videoId={resonator.youtubeVideoId}
                  title={`Ролик по базе ${resonator.name}`}
                  YT={resonator.youtubeVideoPreview}
                />
              ) : (
                <span className="ytguide__error-YT">Ролик не найден</span>
              )}
            </div>

            {/* МИНИ-ГАЙД */}
            <div
              className="resonator__common-container miniguide"
              id="miniGuide"
            >
              <h2 className="resonator__h2">МИНИ-ГАЙД</h2>
              <img src={resonator.MiniGuideImg} alt="Изображение мини гайда" />
            </div>

            {/* ПЛЮСЫ И МИНУСЫ */}
            <div
              className="resonator__common-container plusminus"
              id="plusminus"
            >
              <h2 className="resonator__h2">ПЛЮСЫ И МИНУСЫ</h2>
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
                    {resonator.BasePlus?.map((item, index) => (
                      <li
                        className="plusminus__plus-item"
                        key={`plus-${index}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="plusminus__minus">
                  <h3 className="plusminus__h3">
                    <span className="red">Минусы</span>
                  </h3>
                  <ul className="plusminus__list plusminus__minus-list">
                    {resonator.BaseMinus?.map((item, index) => (
                      <li
                        className="plusminus__minus-item"
                        key={`minus-${index}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ПОЛЬЗА */}
            <div className="resonator__common-container utility" id="utility">
              <h2 className="resonator__h2">ПОЛЬЗА ПЕРСОНАЖА</h2>
              <img
                src={resonator.Utility}
                alt="Утилити резонатора"
                className="utility__img"
              />
            </div>

            {/* ПРОКАЧКА */}
            <div className="resonator__common-container pumping" id="pumping">
              <h2 className="resonator__h2">ПОРЯДОК ПРОКАЧКИ</h2>
              <img
                src={resonator.PumpingImg}
                alt="Прокачка резонатора"
                className="pumping__img"
              />
            </div>

            {/* УРОН */}
            <div className="resonator__common-container damage" id="damage">
              <h2 className="resonator__h2">РАСПРЕДЕЛЕНИЕ УРОНА</h2>
              <img
                src={resonator.DamageImg}
                alt="Распределение урона"
                className="damage__img"
              />
            </div>

            {/* ОРУЖИЕ */}
            <div className="resonator__common-container weapon" id="weapon">
              <img
                src={resonator.WeaponPreview}
                alt="Превью оружия"
                className="resonator__common-preview"
              />
              <h2 className="resonator__h2">ОРУЖИЕ</h2>
              {resonator.GlossaryImg && (
                <img
                  src={resonator.GlossaryImg}
                  alt="глоссарий"
                  className="weapon__glossary"
                />
              )}
              <ul className="weapon__list">
                {resonator.Weapon?.map((item, index) => (
                  <li className="weapon__item" key={`weapon-${index}`}>
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
                ))}
              </ul>
              <div className="weapon__descr-container">
                {resonator.WeaponDescr?.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </div>

            {/* СОЗВЕЗДИЯ */}
            <div
              className="resonator__common-container constellation"
              id="constellation"
            >
              <img
                src={resonator.ConstellationPreview}
                alt="Превью созвездий"
                className="resonator__common-preview"
              />
              <h2 className="resonator__h2">СОЗВЕЗДИЯ</h2>
              <div className="constellation__descr">
                {resonator.ConstellationDescr?.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
                {resonator.ConstellationTeamDamage && (
                  <>
                    <h3 className="constellation__h3">
                      Персональный урон за 1 ротацию
                    </h3>
                    <img
                      src={resonator.ConstellationTeamDamage}
                      alt="Урон Team"
                    />
                  </>
                )}
                {resonator.ConstellationSoloDamage && (
                  <>
                    <h3 className="constellation__h3">
                      Персональный урон за 3 ротации
                    </h3>
                    <img
                      src={resonator.ConstellationSoloDamage}
                      alt="Урон Solo"
                    />
                  </>
                )}
                {resonator.InvestmentsDamage && (
                  <>
                    <h3 className="constellation__h3">
                      Табличка с инвестицией в разных персонажей на примере
                      лучшего отряда
                    </h3>
                    <img
                      src={resonator.InvestmentsDamage}
                      alt="Урон при инвестициях"
                    />
                  </>
                )}

                <p>{resonator.InvestmentsReview}</p>
              </div>
            </div>

            {/* ОТРЯДЫ */}
            <div className="resonator__common-container team" id="team">
              <img
                src={resonator.TeamPreview}
                alt="Превью команды"
                className="resonator__common-preview"
              />
              <h2 className="resonator__h2">ОТРЯДЫ</h2>
              <ul className="team__list">
                {resonator.Team?.map((teamItem, teamIndex) => (
                  <li className="team__item" key={`team-${teamIndex}`}>
                    <img
                      src={teamItem.img}
                      alt="Команда"
                      className="team__img"
                    />
                    <Accordion buttonName="Ротация">
                      {teamItem.descr.map((descrItem, descrIndex) => (
                        <ul
                          key={`rotation-${teamIndex}-${descrIndex}`}
                          className="team__accordion-list"
                        >
                          {descrItem.text.map((text, textIndex) => (
                            <li
                              key={`text-${textIndex}`}
                              className="team__accordion-item"
                            >
                              {text}
                            </li>
                          ))}
                          <img src={descrItem.img} alt="Ротация" />
                        </ul>
                      ))}
                    </Accordion>
                  </li>
                ))}
              </ul>
            </div>

            {/* ФИНАЛЬНЫЙ ОБЗОР */}
            <div className="resonator__common-container review" id="final">
              <h2 className="resonator__h2">ФИНАЛЬНЫЙ ОБЗОР</h2>
              <p className="review__descr">{resonator.FinalReview?.descr}</p>
              <ul className="review__list">
                {resonator.FinalReview?.img?.map((img, index) => (
                  <li className="review__item" key={`review-img-${index}`}>
                    <img
                      src={img}
                      alt="Финальная таблица"
                      className="review__img"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {showUpButton && (
            <button
              className="resonator__up"
              onClick={() => scrollToSection("up")}
            >
              Наверх
            </button>
          )}
        </div>
      </section>
    </GlossaryProvider>
  )
}
