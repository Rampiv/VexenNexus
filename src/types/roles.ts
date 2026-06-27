// src/types/roles.ts

export type TabKey =
  | "resonators"
  | "weapons"
  | "mechanics"
  | "echoSets"
  | "tierlist"
  | "settings"

export interface ResonatorFields {
  name: boolean; engName: boolean; element: boolean; rarity: boolean; weaponType: boolean;
  resonatorImg: boolean; resonatorImgMini: boolean; resonatorImgBanner: boolean;
  resonatorPreview: boolean; resonatorYTLink: boolean; resonatorImgGuide: boolean;
  resonatorImgDetails: boolean; descr: boolean; result: boolean; teams: boolean; echoSets: boolean;
}

export interface EchoSetFields {
  name: boolean; engName: boolean; img: boolean; patchNumber: boolean; index: boolean;
  onePartsDescr: boolean; twoPartsDescr: boolean; fivePartsDescr: boolean;
  threePartsDescr: boolean; important: boolean;
}

export interface WeaponFields {
  name: boolean; engName: boolean; type: boolean; rarity: boolean;
  stat1: boolean; stat2: boolean; img: boolean; description: boolean;
}

export interface MechanicFields {
  title: boolean; engName: boolean; img: boolean; paragraphs: boolean;
}

export interface TierListFields {
  name: boolean; nameImg: boolean; cycles: boolean; rows: boolean;
}

export interface SettingsFields {
  nextBannerDate: boolean; futureResonatorIds: boolean;
  preview_img: boolean; filter_img: boolean; tierListDescriptions: boolean;
}

export interface RolePermissions {
  tabs: Record<TabKey, boolean>
  fields: {
    resonators: Partial<ResonatorFields>
    echoSets: Partial<EchoSetFields>
    weapons: Partial<WeaponFields>
    mechanics: Partial<MechanicFields>
    tierlist: Partial<TierListFields>
    settings: Partial<SettingsFields>
  }
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: RolePermissions
  password?: string
  isSuperAdmin?: boolean
}