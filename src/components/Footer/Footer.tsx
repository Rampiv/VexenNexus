import { Link } from "react-router"
import "./Footer.scss"

const links = [
  { name: "Обратная связь", link: "/feedback" },
  { name: "Privacy Policy", link: "/privacy" },
]

export const Footer = () => {
  return (
    <footer className="footer">
      <nav className="navigation">
        <div className="navigation__container">
          <ul className="contacts-footer">
            {links.map((item, index) => {
              return (
                <li key={`${index} контакты`} className="contacts-footer__item">
                  <Link to={item.link}>{item.name}</Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="navigation__container">
          <ul className="navigation__list">
            <li className="navigation__item">
              <span className="navigation__text">ТЕОРИКРАФТЕР - CODY</span>
            </li>
            <li className="navigation__item">
              <span className="navigation__text">
                РАЗРАБОТЧИК: <Link to={"https://t.me/Vanpinvan"}>RAMPIV</Link>
              </span>
            </li>
          </ul>
        </div>
      </nav>
      <div className="footer__privacy">
        <span className="footer__copyright">
          Copyright © 2025 rvexen.github.io
        </span>
      </div>
    </footer>
  )
}
