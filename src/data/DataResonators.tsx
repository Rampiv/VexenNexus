import ResonarotChisa from "@assets/image/Resonators/Resonator_Chisa.webp"
import ResonatorBuling from "@assets/image/Resonators/Resonator_Buling.webp"
import chisaPreview from "@assets/image/Resonators/Chisa/chisaPreview.webp"
import chisaMiniGuide from "@assets/image/Resonators/Chisa/chisaMiniGuide.webp"
import chisaYTPreview from "@assets/image/Resonators/Chisa/chisaYTPreview.webp"
import chisaUtility from "@assets/image/Resonators/Chisa/chisaUtility.webp"
import chisaPumping from "@assets/image/Resonators/Chisa/chisaPumping.webp"
import chisaWeaponPreview from "@assets/image/Resonators/Chisa/chisaWeaponPreview.webp"
import chisaGlossary from "@assets/image/Resonators/Chisa/chisaGlossary.webp"
import chisaConstellation from "@assets/image/Resonators/Chisa/chisaConstellationPreview.webp"
import chisaConstellationTeamDamage from "@assets/image/Resonators/Chisa/chisaConstellarionTeamDamage.webp"
import chisaConstellationSoloDamage from "@assets/image/Resonators/Chisa/chisaConstellarionSoloDamage.webp"
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

import kumokiri from "@assets/image/Weapon/kumokiri.webp"
import wildfireMark from "@assets/image/Weapon/wildfireMark.webp"
import agesOfHarvest from "@assets/image/Weapon/agesOfHarvest.webp"
import lustrousRazon from "@assets/image/Weapon/lustrousRazon.webp"

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
    resonator: ResonarotChisa,
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
        <a href="#QuickSwap" className="glossary-link">
          (quick-swap)
        </a>
      </>,
      <>
        Универсальный{" "}
        <a href="#Buff" className="glossary-link">
          бафф
        </a>
      </>,
    ],
    BaseMinus: [
      "мало совместимых отрядов",
      "архетип пока слабо развит",
      <>
        зависит от{" "}
        <a href="#Debuff" className="glossary-link">
          негативных статусов
        </a>
      </>,
    ],
    Utility: chisaUtility,
    PumpingImg: chisaPumping,
    DamageImg: chisaDamageImg,
    WeaponPreview: chisaWeaponPreview,
    GlossaryImg: chisaGlossary,
    GlossaryTerm: [
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
        <a href="#Passive" className="glossary-link">
          пассивкой
        </a>{" "}
        как временную замену до получения Сигны или стандартного двуручного
        меча.
      </>,
    ],
    СonstellationPreview: chisaConstellation,
    ConstellarionDescr: [
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
    ConstellarionTeamDamage: chisaConstellationTeamDamage,
    ConstellarionSoloDamage: chisaConstellationSoloDamage,
    InvestmentsDamage: chisaInvestmentsDamage,
    InvestmentsReview: (
      <>
        Небольшое пояснение по С1: этот дубль довольно спорный... <br />
        Например, в <span className="red">Кораблях</span> он проявляет себя
        отлично: благодаря{" "}
        <a href="#Passive" className="glossary-link">
          пассивки
        </a>{" "}
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
                <a href="#Intro" className="glossary-link">
                  интро
                </a>{" "}
                — этого достаточно для полного набора «концерта».
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
                <a href="#Intro" className="glossary-link">
                  интро
                </a>{" "}
                — этого хватит для полного набора «концерта».
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
                <a href="#MainDPS" className="glossary-link">
                  МДД
                </a>
              </h3>,
              <p>
                При первой ротации нанесите один базовый удар на{" "}
                <span className="purple">Чисе</span> вместо{" "}
                <a href="#Intro" className="glossary-link">
                  интро
                </a>{" "}
                — этого достаточно для полного набора{" "}
                <a href="#Concert" className="glossary-link">
                  концерта
                </a>
                .
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
                <a href="#MainDPS" className="glossary-link">
                  МДД
                </a>
              </h3>,
              <p>
                При первой ротации сделайте один базовый удар на{" "}
                <span className="purple">Чисе</span> вместо{" "}
                <a href="#Intro" className="glossary-link">
                  интро
                </a>{" "}
                — этого достаточно для полного набора{" "}
                <a href="#Concert" className="glossary-link">
                  концерта
                </a>
                .
              </p>,
              <p>
                На Чаконне выбирайте{" "}
                <span className="yellow">
                  <a href="#Tonic" className="glossary-link">
                    тоник
                  </a>{" "}
                  на{" "}
                  <a href="#SpectroFrazzle" className="glossary-link">
                    фразлы
                  </a>
                </span>
                , чтобы обеспечить Фиби запасом{" "}
                <a href="#SpectroFrazzle" className="glossary-link">
                  фразлов
                </a>
                .
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
    engName: "Byling",
    role: "САП-ДД / САП",
    resonator: ResonatorBuling,
    element: "Electro",
    id: "ResonatorBuling",
    link: "",
    rarity: 4,
    weapon: "Rectifier",
  },
  // {
  //   name: "Aalto",
  //   role: "",
  //   resonator: ResonatorAalto,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorAalto",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Pistols",
  // },
  // {
  //   name: "Augusta",
  //   role: "",
  //   resonator: ResonatorAugusta,
  //   elementIMG: Electro,
  //   element: "Electro",
  //   id: "ResonatorAugusta",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Baizhi",
  //   role: "",
  //   resonator: ResonatorBaizhi,
  //   elementIMG: Glacio,
  //   element: "Glacio",
  //   id: "ResonatorBaizhi",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Brant",
  //   role: "",
  //   resonator: ResonatorBrant,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorBrant",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Calcharo",
  //   role: "",
  //   resonator: ResonatorCalcharo,
  //   elementIMG: Electro,
  //   element: "Electro",
  //   id: "ResonatorCalcharo",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Camellya",
  //   role: "",
  //   resonator: ResonatorCamellya,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorCamellya",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Cantarella",
  //   role: "",
  //   resonator: ResonatorCantarella,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorCantarella",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Carlotta",
  //   role: "",
  //   resonator: ResonatorCarlotta,
  //   elementIMG: Glacio,
  //   element: "Glacio",
  //   id: "ResonatorCarlotta",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Pistols",
  // },
  // {
  //   name: "Cartethyia",
  //   role: "",
  //   resonator: ResonatorCartethyia,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorCartethyia",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Changli",
  //   role: "",
  //   resonator: ResonatorChangli,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorChangli",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Chisa",
  //   role: "САП",
  //   resonator: ResonatorChisa,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorChisa",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Chixia",
  //   role: "",
  //   resonator: ResonatorChixia,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorChixia",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Pistols",
  // },
  // {
  //   name: "Ciaccona",
  //   role: "",
  //   resonator: ResonatorCiaccona,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorCiaccona",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Pistols",
  // },
  // {
  //   name: "Danjin",
  //   role: "",
  //   resonator: ResonatorDanjin,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorDanjin",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Encore",
  //   role: "",
  //   resonator: ResonatorEncore,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorEncore",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Galbrena",
  //   role: "",
  //   resonator: ResonatorGalbrena,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorGalbrena",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Pistols",
  // },
  // {
  //   name: "Iuno",
  //   role: "",
  //   resonator: ResonatorIuno,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorIuno",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Jianxin",
  //   role: "",
  //   resonator: ResonatorJianxin,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorJianxin",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Jinhsi",
  //   role: "",
  //   resonator: ResonatorJinhsi,
  //   elementIMG: Spectro,
  //   element: "Spectro",
  //   id: "ResonatorJinhsi",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Jiyan",
  //   role: "",
  //   resonator: ResonatorJiyan,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorJiyan",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Lingyang",
  //   role: "",
  //   resonator: ResonatorLingyang,
  //   elementIMG: Glacio,
  //   element: "Glacio",
  //   id: "ResonatorLingyang",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Lumi",
  //   role: "",
  //   resonator: ResonatorLumi,
  //   elementIMG: Electro,
  //   element: "Electro",
  //   id: "ResonatorLumi",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Lupa",
  //   role: "",
  //   resonator: ResonatorLupa,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorLupa",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Mortefi",
  //   role: "",
  //   resonator: ResonatorMortefi,
  //   elementIMG: Fusion,
  //   element: "Fusion",
  //   id: "ResonatorMortefi",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Pistols",
  // },
  // {
  //   name: "Phoebe",
  //   role: "",
  //   resonator: ResonatorPhoebe,
  //   elementIMG: Spectro,
  //   element: "Spectro",
  //   id: "ResonatorPhoebe",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Phrolova",
  //   role: "",
  //   resonator: ResonatorPhrolova,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorPhrolova",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Qiuyuan",
  //   role: "",
  //   resonator: ResonatorQiuyuan,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorQiuyuan",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Roccia",
  //   role: "",
  //   resonator: ResonatorRoccia,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorRoccia",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Rover-Aero",
  //   role: "",
  //   resonator: ResonatorRoverAero,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorRoverAero",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Rover-Havoc",
  //   role: "",
  //   resonator: ResonatorRoverHavoc,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorRoverHavoc",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Rover-Spectro",
  //   role: "",
  //   resonator: ResonatorRoverSpectro,
  //   elementIMG: Spectro,
  //   element: "Spectro",
  //   id: "ResonatorRoverSpectro",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Sanhua",
  //   role: "",
  //   resonator: ResonatorSanhua,
  //   elementIMG: Glacio,
  //   element: "Glacio",
  //   id: "ResonatorSanhua",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Shorekeeper",
  //   role: "",
  //   resonator: ResonatorShorekeeper,
  //   elementIMG: Spectro,
  //   element: "Spectro",
  //   id: "ResonatorShorekeeper",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Taoqi",
  //   role: "",
  //   resonator: ResonatorTaoqi,
  //   elementIMG: Havoc,
  //   element: "Havoc",
  //   id: "ResonatorTaoqi",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Broadblade",
  // },
  // {
  //   name: "Verina",
  //   role: "",
  //   resonator: ResonatorVerina,
  //   elementIMG: Spectro,
  //   element: "Spectro",
  //   id: "ResonatorVerina",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Xiangli Yao",
  //   role: "",
  //   resonator: ResonatorXiangliYao,
  //   elementIMG: Electro,
  //   element: "Electro",
  //   id: "ResonatorXiangliYao",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Yangyang",
  //   role: "",
  //   resonator: ResonatorYangyang,
  //   elementIMG: Aero,
  //   element: "Aero",
  //   id: "ResonatorYangyang",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Sword",
  // },
  // {
  //   name: "Yinlin",
  //   role: "",
  //   resonator: ResonatorYinlin,
  //   elementIMG: Electro,
  //   element: "Electro",
  //   id: "ResonatorYinlin",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
  // {
  //   name: "Youhu",
  //   role: "",
  //   resonator: ResonatorYouhu,
  //   elementIMG: Glacio,
  //   element: "Glacio",
  //   id: "ResonatorYouhu",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Yuanwu",
  //   role: "",
  //   resonator: ResonatorYuanwu,
  //   elementIMG: Electro,
  //   element: "Electro",
  //   id: "ResonatorYuanwu",
  //   link: "",
  //   rarity: "4",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Zani",
  //   role: "",
  //   resonator: ResonatorZani,
  //   elementIMG: Spectro,
  //   element: "Spectro",
  //   id: "ResonatorZani",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Gauntlets",
  // },
  // {
  //   name: "Zhezhi",
  //   role: "",
  //   resonator: ResonatorZhezhi,
  //   elementIMG: Glacio,
  //   element: "Glacio",
  //   id: "ResonatorZhezhi",
  //   link: "",
  //   rarity: "5",
  //   weapon: "Rectifier",
  // },
]
