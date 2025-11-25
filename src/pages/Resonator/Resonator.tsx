import { useParams } from "react-router"
import { DataResonators } from "../../data"
import "./Resonator.scss"
import { Accordion, TitleBackground, YouTubePlayer } from "../../components"

const contentsList = [
  { title: "Ролик по базе", href: "YTGuide" },
  { title: "мини-гайд", href: "miniGuide" },
  { title: "База", href: "base" },
  { title: "какое утилити есть у чисы?", href: "utility" },
  { title: "порядок прокачки", href: "pumping" },
  { title: "распределение урона чисы", href: "damage" },
  { title: "оружие", href: "weapon" },
  { title: "созвездия", href: "constellation" },
  { title: "отряды", href: "team" },
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
        {/* Содержание */}
        <div className="resonator__container">
          <h1 className="resonator__name" id="up">
            {resonator.name}
          </h1>
          <p className="resonator__role">Роль: {resonator.role}</p>
          <div className="resonator__common-container resonator__contents-container">
            <img
              src={resonator.previewImg}
              alt="Превью резонатора"
              className="resonator__preview-img"
            />
            <div className="resonator__contents-listcontainer">
              <h2 className="resonator__contents-h2">
                быстрое перемещение по главам:
              </h2>
              <ul className="resonator__contents-list">
                {contentsList.map(item => {
                  return (
                    <li
                      className="resonator__contents-item"
                      key={`${item.title}+${item.href}`}
                    >
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10.5" cy="10.5" r="10.5" fill="#D9D9D9" />
                      </svg>
                      <a href={`#${item.href}`}>{item.title}</a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          {/* ютуб ролик */}
          <div
            className="resonator__common-container resonator__ytguide"
            id={contentsList[0].href}
          >
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[0].title}</h2>
            </div>
            {resonator.youtubeVideoId ? (
              <YouTubePlayer
                videoId={resonator.youtubeVideoId}
                title="Ролик по базе Чисы"
                YT={resonator.youtubeVideoPreview}
              />
            ) : (
              <span className="resonator__error-YT">Ролик не найден</span>
            )}
          </div>
          {/* мини гайд */}
          <div
            className="resonator__common-container resonator__miniguide"
            id={contentsList[1].href}
          >
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[1].title}</h2>
            </div>
            <img src={resonator.MiniGuideImg} alt="Изображение мини гайда" />
          </div>
          {/* база */}
          <div
            className="resonator__common-container resonator__base"
            id={contentsList[2].href}
          >
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[2].title}</h2>
            </div>
            <p className="resonator__base-descr">{resonator.BaseDescr}</p>
            <p className="resonator__base-descr">
              выделим <span className="green">плюсы</span> и{" "}
              <span className="red">минусы</span>
            </p>
            <div className="resonator__plusminus-container">
              <div className="resonator__plus">
                <h3 className="resonator__h3">
                  <span className="green">Плюсы</span>
                </h3>
                <ul className="resonator__plusminus-list resonator__plus-list">
                  {resonator.BasePlus &&
                    resonator.BasePlus.map(item => {
                      return (
                        <li className="resonator__plus-item" key={item}>
                          {item}
                        </li>
                      )
                    })}
                </ul>
              </div>
              <div className="resonator__minus">
                <h3 className="resonator__h3">
                  <span className="red">Минусы</span>
                </h3>
                <ul className="resonator__plusminus-list resonator__minus-list">
                  {resonator.BaseMinus &&
                    resonator.BaseMinus.map(item => {
                      return (
                        <li className="resonator__minus-item" key={item}>
                          {item}
                        </li>
                      )
                    })}
                </ul>
              </div>
            </div>
          </div>
          {/* утилити */}
          <div
            className="resonator__common-container resonator__utility"
            id={contentsList[3].href}
          >
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[3].title}</h2>
            </div>
            <img
              src={resonator.Utility}
              alt="Утилити резонатора"
              className="resonator__utility-img"
            />
          </div>
          {/* прокачка */}
          <div
            className="resonator__common-container resonator__pumping"
            id={contentsList[4].href}
          >
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[4].title}</h2>
            </div>
            <img
              src={resonator.PumpingImg}
              alt="Прокачка резонатора"
              className="resonator__pumping-img"
            />
          </div>
          {/* распределение урона */}
          <div
            className="resonator__common-container resonator__pumping"
            id={contentsList[5].href}
          >
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[5].title}</h2>
            </div>
            <img
              src={resonator.DamageImg}
              alt="Прокачка резонатора"
              className="resonator__pumping-img"
            />
          </div>
          {/* оружие */}
          <div
            className="resonator__common-container resonator__weapon"
            id={contentsList[6].href}
          >
            <img
              src={resonator.WeaponPreview}
              alt="Превью оружия"
              className="resonator__common-preview"
            />
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[6].title}</h2>
            </div>
            <img
              src={resonator.Glossary}
              alt="глоссарий"
              className="resonator__glossary"
            />
            <ul className="resonator__weapon-list">
              {resonator.Weapon &&
                resonator.Weapon.map((item, index) => {
                  return (
                    <li
                      className="resonato__weapon-item"
                      key={`weapon - ${index}`}
                    >
                      <img src={item} alt="Оружие" />
                    </li>
                  )
                })}
            </ul>
            <div className="resonator__weapon-descr-container">
              {resonator.WeaponDescr?.map((item, index) => {
                return <p key={index}>{item}</p>
              })}
            </div>
          </div>
          {/* созвездия */}
          <div
            className="resonator__common-container resonator__constellation"
            id={contentsList[7].href}
          >
            <img
              src={resonator.СonstellationPreview}
              alt="Превью созвездий"
              className="resonator__common-preview"
            />
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[7].title}</h2>
            </div>

            <div className="resonator__constellation-descr">
              {resonator.ConstellarionDescr?.map((item, index) => {
                return <p key={`${item} ${index}`}>{item}</p>
              })}
              <img src={resonator.ConstellarionTeamDamage} alt="Урон Team" />
              <p>Персональный урон ${resonator.name} за 3 ротации</p>
              <img src={resonator.ConstellarionSoloDamage} alt="Урон Solo" />
              <p>
                Табличка с инвестицией в разных персонажей на примере лучшего
                отряда
              </p>
              <img
                src={resonator.InvestmentsDamage}
                alt="Урон при инвестициях"
              />
              <p>{resonator.InvestmentsReview}</p>
            </div>
          </div>
          {/* отряды */}
          <div
            className="resonator__common-container resonator__team"
            id={contentsList[8].href}
          >
            <img
              src={resonator.TeamPreview}
              alt="Превью команды"
              className="resonator__common-preview"
            />
            <div className="resonator__h2-container">
              <TitleBackground />
              <h2 className="resonator__h2">{contentsList[8].title}</h2>
            </div>
            <ul className="resonator__team-list">
              {resonator.Team &&
                resonator.Team.map((item, index) => {
                  return (
                    <li className="resonator__team-item" key={`team ${index}`}>
                      <img
                        src={item.img}
                        alt="Команда"
                        className="resonator__team-img"
                      />
                      <Accordion>
                        {item.descr.map((item, index) => {
                          return (
                            <div key={`accordion item ${index}`}>
                              {item.text.map((element, index) => {
                                return (
                                  <p key={`accordion ${index}`}>{element}</p>
                                )
                              })}
                              <img src={item.img} alt="Ротация" />
                            </div>
                          )
                        })}
                      </Accordion>
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
