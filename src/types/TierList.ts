export interface TierListRow {
  id: string
  rating: string
  ratingColor?: string
  ratingImg?: string
  dpsResonatorIds: string[]
  hybridResonatorIds: string[]
  supportResonatorIds: string[]
  resonatorIds?: string[]
  resonatorSettings?: Record<string, ResonatorSettings>
  taggedResonators?: TaggedResonator[]
}
export interface TierListCycle {
  id: string
  name: string
  cycleNumber?: number
  rows: TierListRow[]
  createdAt?: any
  updatedAt?: any
}

export interface TierList {
  id?: string
  name: string
  nameImg?: string
  cycles: TierListCycle[]
  createdAt?: any
  updatedAt?: any
  usedTags?: TierListTag[]
}

export interface TierListDescription {
  id: string
  title: string
  content: string
}

export interface ResonatorSettings {
  status: "up" | "neutral" | "down"
  tags: Array<{
    id: string
    text: string
    color: string
  }>
}

export interface TierListTag {
  id: string
  name: string
  text?: string
  color: string
}

export interface TaggedResonator {
  resonatorId: string
  tags: TierListTag[]
}
