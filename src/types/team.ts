export interface TeamSlot {
  resonatorId: string
  echoSetIcons: string[]
}

export interface TeamRow {
  slots: {
    [key: string]: TeamSlot[]
  }
}

export interface Team {
  name: string
  rows: TeamRow[]
}
