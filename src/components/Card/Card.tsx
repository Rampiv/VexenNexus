import "./Card.scss"

interface Props {
  resonator: string
  rarity: number
}

export const Card = ({ resonator, rarity }: Props) => {
  return (
    <div className={`card ${rarity === 5 ? "card_yellow" : "card_purple"}`}>
      <div
        className="card__image-container"
      >
        <img
          src={resonator}
          alt="Изображение резонатора"
          className="card__resonator"
        />
      </div>
    </div>
  )
}
