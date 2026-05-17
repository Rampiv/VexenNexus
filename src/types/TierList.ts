export interface TierListRow {
  id: string
  rating: string
  ratingColor?: string 
  ratingImg?: string
  resonatorIds: string[]
}

export interface TierList {
  id?: string
  name: string
  nameImg: string
  rows: TierListRow[]
  createdAt?: any
  updatedAt?: any
}
