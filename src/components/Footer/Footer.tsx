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
          <ul className="contacts-footer">
            <li className="contacts-footer__item contacts-footer__item_custom">
              <span>ТЕОРИКРАФТЕР - CODY</span>
            </li>
            <li className="contacts-footer__item contacts-footer__item_custom">
              <span>
                РАЗРАБОТЧИК: <Link to={"https://t.me/Vanpinvan"} className="contacts-footer__link">RAMPIV</Link>
              </span>
            </li>
          </ul>
        </div>
      </nav>
      <div className="footer__privacy">
        <span className="footer__copyright">
          Copyright © 2026 ww-hub.vercel.app
        </span>
      </div>
    </footer>
  )
}
