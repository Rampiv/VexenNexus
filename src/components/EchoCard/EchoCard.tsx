import type { EchoSet } from "../../types/echoSet"
import "./EchoCard.scss"

interface Props {
  EchoSet: EchoSet
  index?: number
}

export const EchoCard = ({ EchoSet: item, index }: Props) => {
  if (!item) return null
  return (
    <li className="echo-sets__item" key={`эхо сеты ${index} ${item.id}`}>
      <div className="echo-sets__title-block">
        <img src={item.img} alt="Картинка сета" className="echo-sets__img" />
        <h2 className="echo-sets__h2">{item.name}</h2>
      </div>
      <div className="echo-sets__descr-block">
        {item.twoPartsDescr && item.twoPartsDescr.length > 0 && (
          <>
            <h3 className="echo-sets__h3">2 - части</h3>
            {item.twoPartsDescr.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text"
                  key={`ключ текста эхо сетов 2 частей ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {item.fivePartsDescr && item.fivePartsDescr.length > 0 && (
          <>
            <h3 className="echo-sets__h3">5 - частей</h3>
            {item.fivePartsDescr.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text"
                  key={`ключ текста эхо сетов 5 частей ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {item.threePartsDescr && item.threePartsDescr.length > 0 && (
          <>
            <h3 className="echo-sets__h3">3 - части</h3>
            {item.threePartsDescr.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text"
                  key={`ключ текста эхо сетов 3 части ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
        {item.important && item.important.length > 0 && (
          <>
            <h4 className="echo-sets__h4">Важно:</h4>
            {item.important.map((text, indexText) => {
              return (
                <p
                  className="echo-sets__text-2"
                  key={`ключ текста ваажно ${indexText}`}
                >
                  {text}
                </p>
              )
            })}
          </>
        )}
      </div>
    </li>
  )
}
