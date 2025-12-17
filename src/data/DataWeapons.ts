import cumokiriImg from "@assets/image/Weapon/kumokiri.webp"
import wildfireMarkImg from "@assets/image/Weapon/wildfireMark.webp"
import agesOfHarvestImg from "@assets/image/Weapon/agesOfHarvest.webp"
import lustrousRazonImg from "@assets/image/Weapon/lustrousRazon.webp"
import variationImg from "@assets/image/Weapon/variation.webp"
import callOfTheAbyssImg from "@assets/image/Weapon/callOfTheAbyss.webp"


export const cumokiri = {
  name: "Cumokiri",
  img: cumokiriImg,
  base: ["АТК", "500"],
  stat: [`КРИТ ШАНС`, "36%"],
  passive: [
    "АТК + 12%",
    "После интро или негативного статуса получаем 8% / 10% / 12% / 14% / 16% ульт дмг бонуса. Стакается до 3х раз",
    "После того как накопили 3 стака, любой резонатор в отряде накладывая нег. статус получает 24% / 30% / 36% / 42% / 48%",
  ],
}

export const wildfireMark = {
  name: "Widlfire Mark",
  img: wildfireMarkImg,
  base: ["АТК", "587.50"],
  stat: [`КРИТ ШАНС`, "48.60%"],
  passive: [
    "АТК + 12% / 15% / 18% / 21% / 24%",
    "После того, как нажимается ульта или интро, получаем бонус в виде 24% / 30% / 36% / 42% / 48%. Тяжелые атаки продлевают эффект на 4 секунды",
    "Каждое успешное продление эффекта увеличивает на 24% / 30% / 36% / 42% / 48% Fusion бонус всем персонажам в команде",
  ],
}

export const agesOfHarvest = {
  name: "Ages Of Harvest",
  img: agesOfHarvestImg,
  base: ["АТК", "587.50"],
  stat: [`КРИТ ШАНС`, "24.30%"],
  passive: [
    "+ 12% / 15% / 18% / 21% / 24% атрибут бонус",
    "После интро дает 24% / 30% / 36% / 42% / 48% бонус к навыкам",
    "Когда прожимаем навык, то получаем 24% / 30% / 36% / 42% / 48% бонуса к навыкам",
  ],
}

export const lustrousRazon = {
  name: "Lustrous Razon",
  img: lustrousRazonImg,
  base: ["АТК", "588"],
  stat: [`АТК`, "36%"],
  passive: [
    "Реген энергии +12,8%",
    "После нажатия навыка получаем 7% бонуса на урон от ульты",
    "Стакается до 3х раз. Длится 12 секунд",
  ],
}

export const variation = {
  name: "Variation",
  img: variationImg,
  base: ["АТК", "338"],
  stat: [`Реген энергии`, "51,8%"],
  passive: [
    "После прожатия навыка получаем 8 единиц энергии концерта 1 раз в 20 секунд",
  ],
}

export const callOfTheAbyss = {
  name: "Call Of The Abyss",
  img: callOfTheAbyssImg,
  base: ["АТК", "338"],
  stat: [`Реген энергии`, "51,8%"],
  passive: [
    "После прожатия ульты получаем бонус к хилу на 16% на 15 секунд",
  ],
}

