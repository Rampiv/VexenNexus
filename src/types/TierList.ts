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

export interface TierList {
  id?: string
  name: string
  nameImg?: string
  rows: TierListRow[]
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