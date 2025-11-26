import { useParams } from "react-router"
import { DataResonators } from "../../data"
import "./Resonator.scss"
import { Accordion, YouTubePlayer } from "../../components"
import marker from '@assets/icons/marker.webp'

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

export const Resonator = () => {
  const { id } = useParams<{ id: string }>()

  const resonator = DataResonators.find(
    res => res.engName.toLocaleLowerCase() === id?.toLocaleLowerCase(),
  )

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
                    resonator.BasePlus.map(item => {
                      return (
                        <li className="plusminus__plus-item" key={item}>
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
                    resonator.BaseMinus.map(item => {
                      return (
                        <li className="plusminus__minus-item" key={item}>
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
              src={resonator.Glossary}
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
                      <Accordion>
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
        <a className="resonator__up" href="#up">
          Наверх
        </a>
      </div>
    </section>
  )
}
