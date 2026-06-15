export interface Weapon {
  id?: string;
  name: string;
  engName: string;
  type: 'Sword' | 'Broadblade' | 'Gauntlets' | 'Pistols' | 'Rectifier';
  stat1: string;
  stat2: string;
  rarity: 4 | 5;
  img: string;
  createdAt?: any;
  description: string[]
}