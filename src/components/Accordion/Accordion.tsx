import type { ReactNode } from "react"
import type React from "react"
import { useState } from "react"
import './Accordion.scss'

interface AccordionProps {
  children: ReactNode // Контент внутри аккордеона
  isOpenByDefault?: boolean // Начальное состояние (по умолчанию — закрыт)
  className?: string // Дополнительный класс для обёртки
}
export const Accordion: React.FC<AccordionProps> = ({
  children,
  isOpenByDefault = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault)

  const toggle = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <div className={`accordion ${className}`}>
      <button
        type="button"
        className="accordion__button"
        onClick={toggle}
        aria-expanded={isOpen}
      >
       Ротация
      </button>
      <div
        className={`accordion__content ${
          isOpen ? "accordion__content--open" : ""
        }`}
        aria-hidden={!isOpen}
      >
        <div className="accordion__inner">{children}</div>
      </div>
    </div>
  )
}
