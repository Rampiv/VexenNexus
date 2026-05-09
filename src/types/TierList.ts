export interface TierListRow {
  id: string
  rating: string
  ratingImg?: string
  resonatorIds: string[]
}

export interface TierList {
  id?: string
  name: string
  engName: string
  rows: TierListRow[]
  createdAt?: any
  updatedAt?: any
}