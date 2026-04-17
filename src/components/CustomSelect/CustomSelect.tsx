import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./CustomSelect.scss"

// Тип для опции селекта
export interface SelectOption {
  value: string
  label: string
  imgSrc?: string // Опционально: картинка для опции
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Выберите...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  // Находим текущую выбранную опцию для отображения в триггере
  const selectedOption = options.find(opt => opt.value === value)

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className={`custom-select ${className}`}>
      {/* Триггер (кнопка открытия) */}
      <div
        className={`custom-select-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <div className="trigger-content">
            {selectedOption.imgSrc && (
              <img src={selectedOption.imgSrc} alt="" className="trigger-img" />
            )}
            <span className="trigger-text">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <ul className="custom-select-options">
          {options.map(option => (
            <li
              key={option.value}
              className={`custom-option ${value === option.value ? "selected" : ""}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.imgSrc && (
                <img src={option.imgSrc} alt="" className="option-img" />
              )}
              <span className="option-text">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}