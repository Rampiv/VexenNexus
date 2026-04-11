export interface TeamSlot {
  resonatorId: string
  echoSetIcons: string[]
}

export interface TeamRow {
  slots: [TeamSlot | null, TeamSlot | null, TeamSlot | null]
}

export interface Team {
  name: string
  rows: TeamRow[]
}
