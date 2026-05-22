export interface SiteSettings {
  nextBannerDate?: string
  futureResonatorIds?: string[]
  preview_img?: string
  filter_img?: string
  tierListDescriptions?: SettingsDescription[]
}

export interface SettingsDescription {
  id: string
  title: string
  content: string
}
