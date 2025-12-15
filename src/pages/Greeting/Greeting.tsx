import { Link } from "react-router"
import "./Greeting.scss"
import { DataFutureResonators, DataLinks } from "../../data"
import habImg from "@assets/image/habImg.webp"
import { RealiseTimer } from "../../components"

const PATCH_2_7_RELEASE = new Date("2025-12-24T11:00:00Z").getTime()
const links = [
  { link: "/resonators", title: "Гайд на персонажей" },
  { link: "/", title: "Гайды на механики" },
  { link: "/", title: "Глоссарий" },
  { link: "/", title: "Гайды на механики" },
]

export const Greeting = () => {
  return (
    <>
      <section className="greeting">
        <div className="greeting__block preview-block">
          <img src={habImg} alt="previewHub" className="preview-block__img" />
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
                <li className="nav-block__item">
                  <Link
                    to={item.link}
                    className="nav-block__link"
                    key={`${index}список ссылок greeting`}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="greeting__block banners-block">
          <div className="banners-block__timer-container">
            <div className="banners-block__timer">
              <h3 className="banners-block__h3">Европа</h3>
              <RealiseTimer newDateProp={PATCH_2_7_RELEASE} region={"europe"} />
            </div>
            <div className="banners-block__timer">
              <h3 className="banners-block__h3">АЗИЯ</h3>
              <RealiseTimer newDateProp={PATCH_2_7_RELEASE} region={"asia"} />
            </div>
            <div className="banners-block__timer">
              <h3 className="banners-block__h3">АМЕРИКА</h3>
              <RealiseTimer
                newDateProp={PATCH_2_7_RELEASE}
                region={"america"}
              />
            </div>
          </div>

          <p className="banners-block__descr">
            Дата релиза:{" "}
            <span className="banners-block__descr-date">25 декабря</span>
          </p>
          <ul className="banners-block__banners">
            {DataFutureResonators.map(item =>
              item.bannerImg ? (
                item.bannerImg.map(itemnew => {
                  return (
                    <li
                      className="banners-block__item"
                      key={`${itemnew}banners-block`}
                    >
                      <img src={itemnew} alt="Картинка баннера" />
                    </li>
                  )
                })
              ) : (
                <></>
              ),
            )}
          </ul>
        </div>
      </section>
    </>
  )
}
