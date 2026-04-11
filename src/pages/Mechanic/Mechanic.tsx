import { useLocation } from "react-router"
import "./Mechanic.scss"
import { DataMechanics } from "../../data"

export const Mechanic = () => {
  const location = useLocation()
  const mechanicName = location.pathname.split("/").filter(Boolean).pop() || ""

  const mechanic = DataMechanics.find(
    item => item.name.toLowerCase() === mechanicName.toLowerCase(),
  )

  if (!mechanic) {
    return (
      <div className="mechanic">
        <div className="error red">Механика "{mechanicName}" не найдена.</div>
      </div>
    )
  }

  return <div className="mechanic">{mechanic.text}</div>
}
