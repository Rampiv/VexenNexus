export interface Weapon {
  id?: string;
  name: string;
  engName: string;
  type: 'Sword' | 'Broadblade' | 'Gauntlets' | 'Pistols' | 'Rectifier';
  rarity: 4 | 5;
  img: string;
  createdAt?: any;
  description: string[]
}