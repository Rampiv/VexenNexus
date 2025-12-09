import "./Header.scss"
import headerlogo from "../../assets/image/headerlogo.webp"
import headergame from "../../assets/image/header-game.webp"
import { Link, useLocation } from "react-router"

export const Header = () => {
  const location = useLocation()
  const isResonatorPage = /^\/resonator\/[^/]+$/.test(location.pathname)
  return (
    <div className="header">
      <div className="container">
        <nav className="header__nav">
          {!isResonatorPage && (
            <Link to={"/"} className="header__link-img">
              <h1 className="h1">VEXEN HUB</h1>
              <img src={headerlogo} alt="VEXEN HUB" className="header__logo" />
              <img src={headergame} alt="WUWA" className="header__game" />
            </Link>
          )}
          <ul className="header__list">
            <li className="header__item">
              <Link to="/" className="header__link">
                Домой
              </Link>
            </li>
            <li className="header__item">
              <Link to="/resonators" className="header__link">
                Персонажи
              </Link>
            </li>
            {/* <li className="header__item">
              <Link to="/" className="header__link">
                Тир-лист
              </Link>
            </li> */}

            <li className="header__item">
              <Link to="/banners" className="header__link">
                Баннеры
              </Link>
            </li>
            {/* <li className="header__item">
              <Link to="/glossary" className="header__link">
                Глоссарий
              </Link>
            </li>
            <li className="header__item">
              <Link to="/changelog" className="header__link">
                Изменения
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </div>
  )
}
