import "./Header.scss"
import headerlogo from "../../assets/image/headerlogo.webp"
import headergame from "../../assets/image/header-game.webp"
import { Link } from "react-router"

export const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <Link to={"/"} className="header__content">
          <h1 className="h1">VEXEN HUB</h1>
          <img src={headerlogo} alt="VEXEN HUB" className="header__logo" />
          <img src={headergame} alt="WUWA" className="header__game" />
        </Link>
      </div>
    </div>
  )
}
