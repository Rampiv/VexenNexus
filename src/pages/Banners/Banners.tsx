import "./Banners.scss"
import { RealiseTimer } from "../../components"
import { DataFutureResonators } from "../../data"

const PATCH_2_7_RELEASE = new Date("2025-12-24T11:00:00Z").getTime()

export const Banners = () => {
  return (
    <section className="future">
      <h2 className="future__h2">Персонажи следующего патча 3.0</h2>
      <h3 className="future__h3">Европа</h3>
      <RealiseTimer newDateProp={PATCH_2_7_RELEASE} region={"europe"} />
      <h3 className="future__h3">АЗИЯ</h3>
      <RealiseTimer newDateProp={PATCH_2_7_RELEASE} region={"asia"} />
      <h3 className="future__h3">АМЕРИКА</h3>
      <RealiseTimer newDateProp={PATCH_2_7_RELEASE} region={"america"} />
      <p className="future__descr">Дата релиза: <span className="future__descr-date">19 декабря</span></p>
      <ul className="future__banners">
        {DataFutureResonators.map(item =>
          item.bannerImg ? (
            item.bannerImg.map(itemnew => {
              return (
                <li className="future__item" key={`${itemnew}future`}>
                  <img src={itemnew} alt="Картинка баннера" />
                </li>
              )
            })
          ) : (
            <></>
          ),
        )}
      </ul>
    </section>
  )
}
