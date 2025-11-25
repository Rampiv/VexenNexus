import { useState, useRef, useEffect } from "react"
import "./Burger.scss"
import { Link, useLocation } from "react-router"
import { Arrow } from "@assets/icons"

export const Burger = () => {
  const [menuExpanded, setMenuExpanded] = useState(false)

  const blobPathRef = useRef<SVGPathElement>(null)
  const hamburgerRef = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const animationRef = useRef<number>(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const isHomePage = location.pathname === "/"

  const toggleMenu = () => {
    setMenuExpanded(prev => !prev)
  }

  // Закрытие при клике ВНЕ меню (но не на SVG и не на меню)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Если клик НЕ внутри menuRef → закрыть
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuExpanded(false)
      }
    }

    if (menuExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuExpanded])

  // Анимация blob (без изменений)
  useEffect(() => {
    const height = window.innerHeight

    let x = 0
    let y = height / 2
    let curveX = 0
    let curveY = height / 2
    let targetX = 0
    let xIteration = 0
    let yIteration = 0

    const easeOutExpo = (
      currentIteration: number,
      startValue: number,
      changeInValue: number,
      totalIterations: number,
    ): number => {
      return (
        changeInValue *
          (-Math.pow(2, (-10 * currentIteration) / totalIterations) + 1) +
        startValue
      )
    }

    const updateSvgCurve = () => {
      if (Math.abs(curveX - x) <= 1) {
        xIteration = 0
      } else {
        if (menuExpanded) {
          targetX = 0
        } else {
          xIteration = 0
        }
        xIteration++
      }

      if (Math.abs(curveY - y) <= 1) {
        yIteration = 0
      } else {
        yIteration = 1
      }

      curveX = easeOutExpo(xIteration, curveX, targetX - curveX, 100)
      curveY = easeOutExpo(yIteration, curveY, y - curveY, 100)

      if (hamburgerRef.current) {
        hamburgerRef.current.style.transform = `translate(${curveX}px, ${curveY}px)`
      }
      if (h2Ref.current) {
        h2Ref.current.style.transform = `translateY(${curveY}px)`
      }

      animationRef.current = requestAnimationFrame(updateSvgCurve)
    }

    const handleMouseMove = (e: MouseEvent) => {
      x = e.pageX
      y = e.pageY
    }

    window.addEventListener("mousemove", handleMouseMove)
    animationRef.current = requestAnimationFrame(updateSvgCurve)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [menuExpanded])

  return (
    <div
      ref={menuRef}
      className={`burger-section ${menuExpanded ? "expanded" : ""}`}
      aria-expanded={menuExpanded}
      aria-label="Navigation menu"
    >
      <div
        className={`burger-section__hamburger ${menuExpanded ? "active" : ""}`.trim()}
        ref={hamburgerRef}
        role="img"
        aria-label="Menu icon"
        onClick={() => toggleMenu()}
      >
        <span className="burger-section__span" />
        <span className="burger-section__span">
          {isHomePage && (
            <div className={`arrow ${menuExpanded ? "hide" : ""}`.trim()}>
              <p className="arrow__text">Меню</p>
              <Arrow />
            </div>
          )}
        </span>
        <span className="burger-section__span" />
      </div>

      {/* Меню */}
      <div className="burger-section__inner">
        <ul className="burger-section__list">
          <li className="burger-section__item">
            <Link to="/" onClick={() => toggleMenu()}>
              На главную страницу
            </Link>
          </li>
          <li className="burger-section__item">
            <Link to="/resonators" onClick={() => toggleMenu()}>
              Персонажи
            </Link>
          </li>
          <li className="burger-section__item">
            <Link to="/" onClick={() => toggleMenu()}>
              Тир-лист
            </Link>
          </li>

          <li className="burger-section__item">
            <Link to="/banners" onClick={() => toggleMenu()}>
              Баннеры
            </Link>
          </li>
          <li className="burger-section__item">
            <Link to="/glossary" onClick={() => toggleMenu()}>
              Глоссарий
            </Link>
          </li>
          <li className="burger-section__item">
            <Link to="/changelog" onClick={() => toggleMenu()}>
              Последние изменения
            </Link>
          </li>
        </ul>
      </div>

      {/* 🔘 ВСЁ УПРАВЛЕНИЕ — ЧЕРЕЗ SVG */}
      <svg
        className="burger-section__svg"
        xmlns="http://www.w3.org/2000/svg"
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        onKeyUp={e => {
          if (e.key === "Enter" || e.key === " ") toggleMenu()
        }}
        aria-label={menuExpanded ? "Close menu" : "Open menu"}
        style={{ cursor: "pointer" }}
      >
        <path
          ref={blobPathRef}
          className="burger-section__path"
          d={`M60,${window.innerHeight}H0V0h60c0,0,20,172,20,250S60,900,60,500z`}
        />
      </svg>
    </div>
  )
}
