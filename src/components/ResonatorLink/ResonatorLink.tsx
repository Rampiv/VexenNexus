import { Link } from "react-router"
import type { Resonator } from "../../types/resonator"
import type { ElementData, WeaponsTypeData } from "../Resonators/Resonators"
import "./ResonatorLink.scss"
import { useEffect, useState } from "react"

interface Props {
  item: Resonator
  elements: ElementData[]
  weaponsTypes: WeaponsTypeData[]
}

// export const ResonatorLink = ({ item, elements }: Props) => {
//   if (!item) return
//   return (
//     <Link to={`/resonator/${item.engName}`} className="resonator-link">
//       <img
//         src={item.resonatorImgMini}
//         alt={item.name}
//         className="resonator-link__img"
//       />
//       <span className="resonator-link__background-element"></span>
//       <img
//         src={elements.find(itemEl => itemEl.id === item.element)?.iconUrl}
//         alt={item.element}
//         className="resonator-link__element"
//       />

//       <h3 className="resonator-link__h3">{item.name}</h3>
//     </Link>
//   )
// }
export const ResonatorLink = ({ item, elements, weaponsTypes }: Props) => {
  const weaponTypeLink =
    weaponsTypes.find(w => w.id.toLowerCase() === item.weaponType.toLowerCase())
      ?.link || ""

  if (!item) return

  return (
    <Link to={`/resonator/${item.engName}`} className="resonator-link">
      <img
        src={item.resonatorImg}
        alt={item.name}
        className="resonator-link__img"
      />
      <div className="resonator-link__content">
        <h3 className="resonator-link__h3">{item.name}</h3>
        <div className="resonator-link__content-container">
          <img
            src={elements.find(itemEl => itemEl.id === item.element)?.iconUrl}
            alt={item.element}
            className="resonator-link__element-new"
          />
          {weaponTypeLink && (
            <img
              src={weaponTypeLink}
              alt={item.weaponType}
              className="resonator-link__weapon-type"
            />
          )}
        </div>
      </div>
    </Link>
  )
}
