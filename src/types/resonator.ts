import type { Team } from "./team";

export interface Resonator {
  id?: string;
  name: string;
  engName: string;
  element: 'Havoc' | 'Aero' | 'Fusion' | 'Spectro' | 'Glacio' | 'Electro';
  rarity: 4 | 5;
  weaponType: 'Sword' | 'Broadblade' | 'Gauntlets' | 'Pistols' | 'Rectifier';
  resonatorImg: string;
  resonatorImgMini: string;
  resonatorPreview: string;
  releaseDate?: string;
  createdAt?: any;
  resonatorImgGuide?: string;
  resonatorYTLink?: string;
  resonatorImgBanner?: string;
  teams?: Team[]
  descr?: string[]
  result?: string[]
}