import "./Header.scss"
import headerlogo from "../../assets/image/headerlogo.webp"
import { Link } from "react-router"

export const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <nav className="header__nav" id="up">
          <Link to={"/"} className="header__link-img">
            <h1 className="h1">VEXEN HUB</h1>
            <img src={headerlogo} alt="VEXEN HUB" className="header__logo" />
          </Link>
          <ul className="header__list">
            <li className="header__item">
              <Link to="/" className="header__link">
                Домой
              </Link>
            </li>
            <li className="header__item">
              <Link to="/resonators" className="header__link">
                Гайды
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
