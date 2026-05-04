import type { Team, TeamRow, TeamSlot } from "../types/team"

// Старые типы (для совместимости при чтении из БД)
interface OldTeamSlot {
  resonatorId: string
  echoSetIcons: string[]
}

interface OldTeamRow {
  slots: [OldTeamSlot | null, OldTeamSlot | null, OldTeamSlot | null]
}

interface OldTeam {
  name: string
  rows: OldTeamRow[]
}

export const convertOldTeamsToNew = (oldTeams: any[]): Team[] => {
  if (!oldTeams || !Array.isArray(oldTeams)) return []

  return oldTeams.map((oldTeam: any) => {
    // Проверка, если данные уже в новом формате (у slots есть ключи "0", "1", "2" или это не массив)
    if (oldTeam.rows && Array.isArray(oldTeam.rows)) {
      const firstRow = oldTeam.rows[0]
      if (firstRow && firstRow.slots && !Array.isArray(firstRow.slots)) {
        // Уже новый формат
        return oldTeam as Team
      }
    }

    // Преобразование старого формата
    const newRows: TeamRow[] =
      oldTeam.rows?.map((oldRow: any) => {
        // Инициализируем новый объект slots
        const newSlots: { [key: string]: TeamSlot[] } = {
          "0": [],
          "1": [],
          "2": [],
        }

        // oldRow.slots был кортежем [Slot, Slot, Slot]
        if (oldRow.slots && Array.isArray(oldRow.slots)) {
          oldRow.slots.forEach((slot: any, index: number) => {
            const key = index.toString() // "0", "1", "2"
            if (newSlots[key] && slot) {
              newSlots[key].push({
                resonatorId: slot.resonatorId || "",
                echoSetIcons: slot.echoSetIcons || [],
              })
            }
          })
        }

        return {
          slots: newSlots,
        }
      }) || []

    return {
      name: oldTeam.name || "",
      rows: newRows,
    }
  })
}
