import type { ReactNode } from "react";
import { useState } from "react";
import "./Accordion.scss";

interface AccordionProps {
  children: ReactNode;
  className?: string;
  buttonName: string;
  // Управляемый режим: если передан `expanded`, компонент контролируется извне
  expanded?: boolean;
  // Обратный вызов для управляемого режима
  onToggle?: (isOpen: boolean) => void;
  // Начальное состояние для неконтролируемого режима
  defaultExpanded?: boolean;
}

export const Accordion = ({
  children,
  className = "",
  buttonName,
  expanded,
  onToggle,
  defaultExpanded = false,
}: AccordionProps) => {
  // Неконтролируемый режим: используем локальный state
  const [internalOpen, setInternalOpen] = useState(defaultExpanded);

  // Определяем, в каком режиме работает компонент
  const isControlled = expanded !== undefined;
  const isOpen = isControlled ? expanded : internalOpen;

  const toggle = () => {
    if (isControlled) {
      onToggle?.(!expanded);
    } else {
      setInternalOpen(prev => !prev);
    }
  };

  return (
    <div className={`accordion ${className}`}>
      <button
        type="button"
        className="accordion__button"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        {buttonName}
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
  );
};