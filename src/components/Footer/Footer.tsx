import { Link } from "react-router"
import "./Footer.scss"
import { DataLinks } from "../../data"

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="navigation">
          <div className="navigation__container">
            <h2 className="navigation__h2">ССЫЛОЧКИ:</h2>
            <ul className="navigation__list">
              {DataLinks.map(item => {
                return (
                  <li className="navigation__item" key={item.id}>
                    <Link to={item.link} className="navigation__link">
                      {typeof item.img == "string" ? (
                        <img src={item.img} alt="Иконка" />
                      ) : (
                        item.img()
                      )}
                      <span className="navigation__text">{item.text}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="navigation__container">
            <h2 className="navigation__h2">СО-АВТОРЫ:</h2>
            <ul className="navigation__list">
              <li className="navigation__item">
                <span className="navigation__text">CODY - ТЕОРИКРАФТЕР</span>
              </li>
              <li className="navigation__item opacityHide">
                <span className="navigation__text">На будущее</span>
              </li>
              <li className="navigation__item opacityHide">
                <span className="navigation__text">На будущее</span>
              </li>
              <li className="navigation__item opacityHide">
                <span className="navigation__text">На будущее</span>
              </li>
              <li className="navigation__item">
                <span className="navigation__text">
                  РАЗРАБОТЧИК: <Link to={"https://t.me/Vanpinvan"}>RAMPIV</Link>
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  )
}
