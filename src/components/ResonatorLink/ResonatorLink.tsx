import { Link } from "react-router"
import type { Resonator } from "../../types/resonator"
import type { ElementData } from "../Resonators/Resonators"
import './ResonatorLink.scss'

interface Props {
  item: Resonator
  elements: ElementData[]
}

export const ResonatorLink = ({ item, elements }: Props) => {
  if (!item) return
  return (
    <Link to={`/resonator/${item.engName}`} className="resonator-link">
      <img
        src={item.resonatorImgMini}
        alt={item.name}
        className="resonator-link__img"
      />
      <span className="resonator-link__background-element"></span>
      <img
        src={elements.find(itemEl => itemEl.id === item.element)?.iconUrl}
        alt={item.element}
        className="resonator-link__element"
      />

      <h3 className="resonator-link__h3">{item.name}</h3>
    </Link>
  )
}
