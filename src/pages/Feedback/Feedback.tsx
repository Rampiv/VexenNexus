import { Link } from "react-router"
import "./Feedback.scss"

export const Feedback = () => {
  return (
    <section className="feedback">
      <div className="container">
        <div className="feedback__content">
          <h2 className="feedback__h2">Обратная связь</h2>
          <div className="feedback__descr">
            <p>
              Если вы заметили визуальные или функциональные недочёты в
              оформлении сайта — например, смещение элементов, некорректное
              отображение на определённых устройствах или другие аномалии
              верстки — мы будем признательны за ваш фидбэк.
            </p>
            <p className="feedback__descr-underline">
              Пожалуйста, при обнаружении ошибок:
            </p>
            <ol className="feedback__ol">
              <li>Сделайте скриншот (или запишите короткое видео);</li>
              <li>
                Кратко опишите, что пошло не так и при каких условиях это
                произошло (устройство, браузер, действия перед ошибкой).
              </li>
            </ol>
            <p>
              Вы можете отправить информацию напрямую разработчику — это поможет
              оперативно внести исправления или реализовать улучшения.
            </p>
            <Link to={"https://t.me/Vanpinvan"} className="feedback__link">
              Написать в телеграм
            </Link>
            <Link to={"/egg"} className="feedback__egg">
              Пасхалка
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
