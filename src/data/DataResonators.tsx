import { GlossaryLink } from "../components/GlossaryLink/GlossaryLink"
import ResonatorChisa from "@assets/image/Resonators/Resonator_Chisa.webp"
import chisaPreview from "@assets/image/Resonators/Chisa/chisaPreview.webp"
import chisaMiniGuide from "@assets/image/Resonators/Chisa/chisaMiniGuide.webp"
import chisaYTPreview from "@assets/image/Resonators/Chisa/chisaYTPreview.webp"
import chisaUtility from "@assets/image/Resonators/Chisa/chisaUtility.webp"
import chisaPumping from "@assets/image/Resonators/Chisa/chisaPumping.webp"
import chisaWeaponPreview from "@assets/image/Resonators/Chisa/chisaWeaponPreview.webp"
import chisaGlossary from "@assets/image/Resonators/Chisa/chisaGlossary.webp"
import chisaConstellation from "@assets/image/Resonators/Chisa/chisaConstellationPreview.webp"
import chisaConstellationTeamDamage from "@assets/image/Resonators/Chisa/chisaConstellationTeamDamage.webp"
import chisaConstellationSoloDamage from "@assets/image/Resonators/Chisa/chisaConstellationSoloDamage.webp"
import chisaInvestmentsDamage from "@assets/image/Resonators/Chisa/chisaInvestmentsDamage.webp"
import chisaTeamPreview from "@assets/image/Resonators/Chisa/chisaTeamPreview.webp"
import chisaTeam1 from "@assets/image/Resonators/Chisa/chisaTeam1.webp"
import chisaTeam2 from "@assets/image/Resonators/Chisa/chisaTeam2.webp"
import chisaTeam3 from "@assets/image/Resonators/Chisa/chisaTeam3.webp"
import chisaTeam1Rotation1 from "@assets/image/Resonators/Chisa/chisaTeam1Rotation1.webp"
import chisaTeam1Rotation2 from "@assets/image/Resonators/Chisa/chisaTeam1Rotation2.webp"
import chisaTeam2Rotation1 from "@assets/image/Resonators/Chisa/chisaTeam2Rotation1.webp"
import chisaTeam2Rotation2 from "@assets/image/Resonators/Chisa/chisaTeam2Rotation2.webp"
import chisaTeam3Rotation1 from "@assets/image/Resonators/Chisa/chisaTeam3Rotation2.webp"
import chisaTeam3Rotation2 from "@assets/image/Resonators/Chisa/chisaTeam3Rotation2.webp"
import chisaDamageImg from "@assets/image/Resonators/Chisa/chisaDamageImg.webp"
import chisaWeapon1 from "@assets/image/Resonators/Chisa/chisaWeapon1.webp"
import chisaWeapon2 from "@assets/image/Resonators/Chisa/chisaWeapon2.webp"
import chisaWeapon3 from "@assets/image/Resonators/Chisa/chisaWeapon3.webp"
import chisaWeapon4 from "@assets/image/Resonators/Chisa/chisaWeapon4.webp"
import chisaFinalReview1 from "@assets/image/Resonators/Chisa/chisaFinalReview1.webp"
import chisaFinalReview2 from "@assets/image/Resonators/Chisa/chisaFinalReview2.webp"

import ResonatorBuling from "@assets/image/Resonators/Resonator_Buling.webp"
import bulingPreview from "@assets/image/Resonators/Buling/bulingPreview.webp"
import bulingYTPreview from "@assets/image/Resonators/Buling/bulingYTPreview.webp"
import bulingMiniGuide from "@assets/image/Resonators/Buling/bulingMiniGuide.webp"
import bulingUtility from "@assets/image/Resonators/Buling/bulingUtility.webp"
import bulingPumping from "@assets/image/Resonators/Buling/bulingPumping.webp"
import bulingDamage from "@assets/image/Resonators/Buling/bulingDamage.webp"
import bulingWeaponPreview from "@assets/image/Resonators/Buling/bulingWeaponPreview.webp"
import bulingConstellation from "@assets/image/Resonators/Buling/bulingConstellation.webp"
import bulingTeamPreview from "@assets/image/Resonators/Buling/bulingTeamPreview.webp"
import bulingTeam1 from "@assets/image/Resonators/Buling/bulingTeam1.webp"
import BulingTeam1Rotation1 from "@assets/image/Resonators/Buling/BulingTeam1Rotation1.webp"
import bulingTeam2Rotation1 from "@assets/image/Resonators/Buling/bulingTeam2Rotation1.webp"
import bulingTeam3Rotation1 from "@assets/image/Resonators/Buling/bulingTeam3Rotation1.webp"
import bulingTeam2 from "@assets/image/Resonators/Buling/bulingTeam2.webp"
import bulingTeam3 from "@assets/image/Resonators/Buling/bulingTeam3.webp"
import bulingFinalReview1 from "@assets/image/Resonators/Buling/bulingFinalReview1.webp"

import kumokiri from "@assets/image/Weapon/kumokiri.webp"
import wildfireMark from "@assets/image/Weapon/wildfireMark.webp"
import agesOfHarvest from "@assets/image/Weapon/agesOfHarvest.webp"
import lustrousRazon from "@assets/image/Weapon/lustrousRazon.webp"
import variation from "@assets/image/Weapon/variation.webp"
import callOfTheAbyss from "@assets/image/Weapon/callOfTheAbyss.webp"

const status = [
  {
    Термин: "🟡Spectro Frazzle",
    Определение:
      "Spectro Frazzle / Спектро-Фразл В активном состоянии заставляет цель периодически получать урон от «Спектро» и уменьшает количество зарядов «Спектро-Фразл» на 1. По мере накопления зарядов урон, наносимый эффектом «Спектро-Фразл», значительно увеличивается.",
    id: "SpectroFrazzle",
  },
  {
    Термин: "🟢Aero Erosion",
    Определение:
      "Aero Erosion / Воздушная Эрозия В активном состоянии заставляет цель периодически получать урон от «Аэро». Чем больше зарядов «Воздушной Эрозии», тем больше наносимый урон.",
    id: "AeroErosion",
  },
  {
    Термин: "❄️Glacio Chafe",
    Определение:
      "Glacio Chafe / Ледяное Изморозь При применении наносит цели урон от «Ледяного» (Glacio). По мере накопления зарядов «Эффекта «Ледяное Изморозь»» скорость передвижения цели постепенно снижается. Когда эффект «Ледяное Изморозь» достигает максимального количества зарядов, цель замораживается, и все заряды «Эффекта «Ледяное Изморозь»» снимаются.",
    id: "GlacioChafe",
  },
  {
    Термин: "🔥Fusion Burst",
    Определение:
      "Fusion Burst / Взрыв слияния При достижении максимального количества зарядов цель взрывается, и все заряды [Эффекта взрыва слияния] снимаются, нанося урон от слияния цели и окружающим противникам.",
    id: "FusionBurst",
  },
  {
    Термин: "💀Void Erosion",
    Определение:
      "Void Erosion / Эрозия пустоты В активном состоянии снижает защиту цели. При 1/2/3 зарядах [Эффекта эрозии пустоты] защита снижается на 2%/4%/6% соответственно. (Перевод с Cn, говоря о новом эффекте.) ",
    id: "VoidErosion",
  },
  {
    Термин: "⚡️Electro Flare",
    Определение:
      "Electro Flare / Электро вспышка В активном состоянии цель электровспышки расходуется каждый раз. После достижения максимального количества зарядов повторное применение эффекта электровспышки преобразует его в суммируемый разряд электровспышки. Разряд электровспышки увеличивает урон следующего срабатывания электровспышки и снимается после активации. Все эффекты перечисленные в списке - являются негативными",
    id: "ElectroFlare",
  },
]

export const DataResonators = [
  {
    name: "ЧИСА",
    engName: "Chisa",
    role: "Саппорт",
    resonator: ResonatorChisa,
    element: "Havoc",
    id: "ResonatorChisa",
    link: "/resonator/Chisa",
    rarity: 5,
    weapon: "Broadblade",
    previewImg: chisaPreview,
    youtubeVideoId: "eTMD3m6xFf4",
    youtubeVideoPreview: chisaYTPreview,
    MiniGuideImg: chisaMiniGuide,
    BaseDescr: "Чиса — чистый саппорт с приличным уроном для своей роли.",
    BasePlus: [
      "приличный урон",
      "быстрая ротация",
      "большой потенциал",
      <>
        удобна в быстрой смене персонажей{" "}
        <GlossaryLink id="QuickSwap">(quick-swap)</GlossaryLink>
      </>,
      <>
        Универсальный <GlossaryLink id="Buff">бафф</GlossaryLink>
      </>,
    ],
    BaseMinus: [
      "мало совместимых отрядов",
      "архетип пока слабо развит",
      <>
        зависит от <GlossaryLink id="Debuff">негативных статусов</GlossaryLink>
      </>,
    ],
    Utility: chisaUtility,
    PumpingImg: chisaPumping,
    DamageImg: chisaDamageImg,
    WeaponPreview: chisaWeaponPreview,
    GlossaryImg: chisaGlossary,
    GlossaryTerm: [
      status[0],
      status[1],
      {
        Термин: "Тоник",
        Определение:
          "Когда Чаконна когда ультует может выбрать какой из эффектов будет накладывать ульта.  Спектро Фразлы или Аэро Эрозии",
        id: "Tonic",
      },
      {
        Термин: "Найтфол",
        Определение: "Последняя атака в серии у Зани",
        id: "NightFall",
      },
    ],
    Weapon: [
      { weapon: kumokiri, damage: chisaWeapon1 },
      { weapon: wildfireMark, damage: chisaWeapon2 },
      { weapon: agesOfHarvest, damage: chisaWeapon3 },
      { weapon: lustrousRazon, damage: chisaWeapon4 },
    ],
    WeaponDescr: [
      "Если говорить чуть подробнее:",
      "1. Стандартное 5★ оружие — хороший выбор, особенно если у вас мало ресурсов. Оно хорошо работает с Чисой, но в типичной ротации 123 вы получите только 2/3 бонуса, то есть +14% бонуски к ульте.",
      "2. Сигна (Wildfire Mark) тоже неплоха, но если у вас уже есть стандартное оружие — её можно отложить. Главный плюс Сигны — высокий потенциал в будущем.",
      "3. Промежуточные варианты (например, Ages of Harvest) стоит брать, только если они не конфликтуют с другими персонажами в отряде. Например, в Башне их можно использовать без проблем, но в Кораблях возможны сложности, если отряд с Чисой и, скажем, Лупой попадёт в один заход.",
      <>
        4. Если у вас нет 5★ оружия — смело ставьте любое 4★ с атакующей{" "}
        <GlossaryLink id="Passive">пассивкой</GlossaryLink> как временную замену
        до получения Сигны или стандартного двуручного меча.
      </>,
    ],
    ConstellationPreview: chisaConstellation,
    ConstellationDescr: [
      <>
        Созвездия Чисы стоит рассматривать в трёх аспектах: <br />{" "}
        <span className="red">1-й</span> — её личный урон за одну ротацию,{" "}
        <br /> <span className="red">2-й</span> — личный урон за три ротации,{" "}
        <br />и <span className="red">3-й</span> — Несколько отрядов с разными
        инвестициями в созвездия для наглядности.. <br />
      </>,
      "Личный урон Чисы в рамках одной ротации — сравнение двух сетов: ToSF и RJV:",
      <>
        ToSF — C0: 260 387 <br />
        RJV — C0: 221 597
      </>,
    ],
    ConstellationTeamDamage: chisaConstellationTeamDamage,
    ConstellationSoloDamage: chisaConstellationSoloDamage,
    InvestmentsDamage: chisaInvestmentsDamage,
    InvestmentsReview: (
      <>
        Небольшое пояснение по С1: этот дубль довольно спорный... <br />
        Например, в <span className="red">Кораблях</span> он проявляет себя
        отлично: благодаря <GlossaryLink id="Passive">пассивки</GlossaryLink>
        вы можете каждый раз использовать умение на новых врагах, и эффект С1
        будет срабатывать регулярно. <br />А вот в{" "}
        <span className="red">Башне</span> польза от С1 значительно ниже: на
        боссе вы сможете активировать её только один раз, и вклад в общий урон
        будет с каждым следующим циклом всё меньше.
      </>
    ),
    TeamPreview: chisaTeamPreview,
    Team: [
      {
        img: chisaTeam1,
        descr: [
          {
            text: [
              <h3>Базовая ротация 123 с Чисой и Чаконной</h3>,
              <p>
                Если это первая ротация (открывающая), просто нанесите один
                базовый удар на <span className="purple">Чисе</span> вместо{" "}
                <GlossaryLink id="Intro">интро</GlossaryLink> — этого достаточно
                для полного набора «концерта».
              </p>,
            ],
            img: chisaTeam1Rotation1,
          },
          {
            text: [
              <h3>Базовая ротация 123 с Чисой и Аровером</h3>,
              <p>
                Если это первая ротация, также дайте один базовый удар на{" "}
                <span className="purple">Чисе</span> вместо{" "}
                <GlossaryLink id="Intro">интро</GlossaryLink> — этого хватит для
                полного набора «концерта».
              </p>,
            ],
            img: chisaTeam1Rotation2,
          },
        ],
      },
      {
        img: chisaTeam2,
        descr: [
          {
            text: [
              <h3>
                Базовая ротация 123 с Чисой и Зани в роли{" "}
                <GlossaryLink id="MainDPS">МДД</GlossaryLink>
              </h3>,
              <p>
                При первой ротации нанесите один базовый удар на{" "}
                <span className="purple">Чисе</span> вместо{" "}
                <GlossaryLink id="Intro">интро</GlossaryLink> — этого достаточно
                для полного набора{" "}
                <GlossaryLink id="Concert">концерта</GlossaryLink>.
              </p>,
              <p>
                Базовая ротация Зани даёт не самый высокий урон, поэтому
                рекомендуется сразу учиться «продвинутой» версии.
              </p>,
            ],
            img: chisaTeam2Rotation1,
          },
          {
            text: [<p>«Продвинутая» ротация</p>],
            img: chisaTeam2Rotation2,
          },
        ],
      },
      {
        img: chisaTeam3,
        descr: [
          {
            text: [
              <h3>
                Базовая ротация 123 с Чисой и Фиби в роли{" "}
                <GlossaryLink id="MainDPS">МДД</GlossaryLink>
              </h3>,
              <p>
                При первой ротации сделайте один базовый удар на{" "}
                <span className="purple">Чисе</span> вместо{" "}
                <GlossaryLink id="Intro">интро</GlossaryLink> — этого достаточно
                для полного набора{" "}
                <GlossaryLink id="Concert">концерта</GlossaryLink>.
              </p>,
              <p>
                На Чаконне выбирайте{" "}
                <span className="yellow">
                  <GlossaryLink id="Tonic">тоник</GlossaryLink> на{" "}
                  <GlossaryLink id="SpectroFrazzle">фразлы</GlossaryLink>
                </span>
                , чтобы обеспечить Фиби запасом{" "}
                <GlossaryLink id="SpectroFrazzle">фразлов</GlossaryLink>.
              </p>,
            ],
            img: chisaTeam3Rotation1,
          },
          {
            text: [<></>],
            img: chisaTeam3Rotation2,
          },
        ],
      },
    ],
    FinalReview: {
      descr: (
        <>
          Расчёты выполнены при 170 критической массе и 3 из 5 полезных статов в
          эхо.
          <br />
          Если ваши проки в эхо будут лучше — урон, соответственно, тоже
          повысится.
        </>
      ),
      img: [chisaFinalReview1, chisaFinalReview2],
    },
  },
  {
    name: "БУЛИНГ",
    engName: "Buling",
    role: "Саппорт",
    resonator: ResonatorBuling,
    element: "Electro",
    id: "ResonatorBuiling",
    link: "/resonator/Buling",
    rarity: 4,
    weapon: "Rectifier",
    previewImg: bulingPreview,
    youtubeVideoId: "eTMD3m6xFf4",
    youtubeVideoPreview: bulingYTPreview,
    MiniGuideImg: bulingMiniGuide,
    BaseDescr:
      "Булинг занимает роль сапорта, так как встает приемущесвенно на 3-й слот",
    BasePlus: [
      "Хорошо хилит",
      "быстрая ротация",
      "Хорошо бафает на с6",
      <>
        накладывает{" "}
        <GlossaryLink id="ElectroFlare">электро вспышки</GlossaryLink>
      </>,
    ],
    BaseMinus: [
      "мало отрядов",
      "без с6 мало полезна",
      "не универсальные бафы",
      "дамага нет - а должен быть?",
    ],
    Utility: bulingUtility,
    PumpingImg: bulingPumping,
    DamageImg: bulingDamage,
    WeaponPreview: bulingWeaponPreview,
    Glossary: "bulingGlossary",
    GlossaryTerm: [status[5]],
    Weapon: [
      { weapon: variation, damage: "" },
      { weapon: callOfTheAbyss, damage: "" },
    ],
    WeaponDescr: [
      "Если говорить чуть более развернуто, то...",
      "1. Булинг самодостаточна во всех аспектах, поэтому ей можно поставить вообще что угодно, если есть лишний Вариатор или Зов бездны - ставьте их",
      <>
        2. Урон вы в любом случае не увидите до тех пор пока нег. статус{" "}
        <GlossaryLink id="ElectroFlare">электро вспышки</GlossaryLink> не
        получит развитие
      </>,
    ],
    ConstellationPreview: bulingConstellation,
    ConstellationDescr: [],
    ConstellationTeamDamage: "",
    ConstellationSoloDamage: "",
    InvestmentsDamage: "",
    InvestmentsReview: (
      <>
        В целом Булинг без созвездий не очень полезна, однако... если вы новичек
        или на вашем аккаунте нет Хранительницы, но есть отряды играющие от
        умения, то Булинг будет полезна, т.к у вас открывается опция второго
        отряда где основным сапортом будет Верина(и др..)
      </>
    ),
    TeamPreview: bulingTeamPreview,
    Team: [
      {
        img: bulingTeam1,
        descr: [
          {
            text: [
              "Это базовая ротация с Булинг и Фроловой",
              <>
                На Фроловой важно прожать умение + базовую атаку + эхо, для
                того что-б получить 2 ноты + отправить в кд кнопку Эхо, это
                позволит в следующий раз когда мы зайдем на Фролю с Интро -
                получится простой комбой набрать все ноты и выйти на хевик +
                ульт
              </>,
            ],
            img: BulingTeam1Rotation1,
          },
        ],
      },
      {
        img: bulingTeam2,
        descr: [
          {
            text: [
              "В отряде с Карлоттой, очень важно прожать умение 1 и умение 2 в самом начале, перед тем как прокручивать ротацию",
              "дальше, таким образом когда мы зайдем на Карлотту с интро следующее прожатие умение 1 и умение 2 - хватит на полное",
              "форте",
            ],
            img: bulingTeam2Rotation1,
          },
        ],
      },
      {
        img: bulingTeam3,
        descr: [
          {
            text: [
              "Ротация ЦзиньСи - крайне большая условность, в ней много нюансов, и базовая ротация довольно слабо отражает реальное положение дел... так что",
              "пользуемся лишь как стартовой точкой, возможно в будущем будет время описать сложные 12-ти секундные и 15-ти секундные ротации",
            ],
            img: bulingTeam3Rotation1,
          },
        ],
      },
    ],
    FinalReview: {
      descr: (
        <>
          Итого... Буллинг - действительно хорошая 4-ка, которая отлично
          справляется с основной задачей - разгрузить Хранительницу от
          переизбытка пачек. Правда для этого нужно дотерпеть до ее 6-го
          созвездия. До него от нее пользы меньше чем от Верины. Однако как я
          уже несколько раз упомянул для новичка она в любом виде пригодится.
        </>
      ),
      img: [bulingFinalReview1],
    },
  },
]
