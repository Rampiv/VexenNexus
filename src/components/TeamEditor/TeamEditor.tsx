import type React from "react"
import type { Team, TeamSlot, TeamRow } from "../../types/team"
import type { Resonator } from "../../types/resonator"
import type { EchoSet } from "../../types/echoSet"
import "./TeamEditor.scss"
import type { SelectOption } from "../CustomSelect/CustomSelect"
import { CustomSelect } from "../CustomSelect/CustomSelect"

interface TeamEditorProps {
  teams: Team[]
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
  allResonators: Resonator[]
  allEchoSets: EchoSet[]
}

const emptySlot: TeamSlot = {
  resonatorId: "",
  echoSetIcons: [],
}

// Создаем пустую строку с объектом slots, где ключи "0", "1", "2" содержат пустые массивы
const createEmptyRow = (): TeamRow => ({
  slots: {
    "0": [],
    "1": [],
    "2": [],
  },
})

const createEmptyTeam = (): Team => ({
  name: "",
  rows: [createEmptyRow()],
})

export const TeamEditor: React.FC<TeamEditorProps> = ({
  teams,
  setTeams,
  allResonators,
  allEchoSets,
}) => {
  const addTeam = () => {
    setTeams(prev => [...prev, createEmptyTeam()])
  }

  const removeTeam = (index: number) => {
    setTeams(prev => prev.filter((_, i) => i !== index))
  }

  const handleTeamNameChange = (index: number, value: string) => {
    setTeams(prev =>
      prev.map((team, i) => (i === index ? { ...team, name: value } : team)),
    )
  }

  const addRowToTeam = (teamIndex: number) => {
    setTeams(prev =>
      prev.map((team, i) =>
        i === teamIndex
          ? { ...team, rows: [...team.rows, createEmptyRow()] }
          : team,
      ),
    )
  }

  const removeRowFromTeam = (teamIndex: number, rowIndex: number) => {
    setTeams(prev =>
      prev.map((team, i) => {
        if (i !== teamIndex) return team
        if (team.rows.length <= 1) return team

        return {
          ...team,
          rows: team.rows.filter((_, rIdx) => rIdx !== rowIndex),
        }
      }),
    )
  }

  // Добавление персонажа в конкретную колонку (0, 1 или 2)
  const addCharacterToColumn = (
    teamIndex: number,
    rowIndex: number,
    columnIndex: string // "0", "1", "2"
  ) => {
    setTeams(prev =>
      prev.map((team, tIdx) => {
        if (tIdx !== teamIndex) return team

        return {
          ...team,
          rows: team.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row

            return {
              ...row,
              slots: {
                ...row.slots,
                [columnIndex]: [...(row.slots[columnIndex] || []), { ...emptySlot }],
              },
            }
          }),
        }
      }),
    )
  }

  // Удаление персонажа из конкретной колонки
  const removeCharacterFromColumn = (
    teamIndex: number,
    rowIndex: number,
    columnIndex: string,
    charIndex: number
  ) => {
    setTeams(prev =>
      prev.map((team, tIdx) => {
        if (tIdx !== teamIndex) return team

        return {
          ...team,
          rows: team.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row

            const updatedColumn = (row.slots[columnIndex] || []).filter(
              (_, cIdx) => cIdx !== charIndex
            )

            return {
              ...row,
              slots: {
                ...row.slots,
                [columnIndex]: updatedColumn,
              },
            }
          }),
        }
      }),
    )
  }

  const handleResonatorSelect = (
    teamIndex: number,
    rowIndex: number,
    columnIndex: string,
    charIndex: number,
    resonatorId: string,
  ) => {
    setTeams(prev =>
      prev.map((team, tIdx) => {
        if (tIdx !== teamIndex) return team

        return {
          ...team,
          rows: team.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row

            const column = [...(row.slots[columnIndex] || [])]
            
            // Ensure the slot exists
            if (!column[charIndex]) return row;

            column[charIndex] = {
              ...column[charIndex],
              resonatorId: resonatorId,
            }

            return {
              ...row,
              slots: {
                ...row.slots,
                [columnIndex]: column,
              },
            }
          }),
        }
      }),
    )
  }

  const addEchoSetId = (
    teamIndex: number,
    rowIndex: number,
    columnIndex: string,
    charIndex: number,
    echoSetId: string,
  ) => {
    if (!echoSetId) return

    setTeams(prev =>
      prev.map((team, tIdx) => {
        if (tIdx !== teamIndex) return team

        return {
          ...team,
          rows: team.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row

            const column = [...(row.slots[columnIndex] || [])]
            const currentSlot = column[charIndex]

            if (!currentSlot) return row;

            if (currentSlot.echoSetIcons.includes(echoSetId)) {
                return row 
            }

            column[charIndex] = {
              ...currentSlot,
              echoSetIcons: [...currentSlot.echoSetIcons, echoSetId],
            }

            return {
              ...row,
              slots: {
                ...row.slots,
                [columnIndex]: column,
              },
            }
          }),
        }
      }),
    )
  }

  const removeEchoIcon = (
    teamIndex: number,
    rowIndex: number,
    columnIndex: string,
    charIndex: number,
    iconIndex: number,
  ) => {
    setTeams(prev =>
      prev.map((team, tIdx) => {
        if (tIdx !== teamIndex) return team

        return {
          ...team,
          rows: team.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row

            const column = [...(row.slots[columnIndex] || [])]
            const slot = column[charIndex]

            if (!slot) return row

            column[charIndex] = {
              ...slot,
              echoSetIcons: slot.echoSetIcons.filter(
                (_, iIdx) => iIdx !== iconIndex,
              ),
            }

            return {
              ...row,
              slots: {
                ...row.slots,
                [columnIndex]: column,
              },
            }
          }),
        }
      }),
    )
  }

  // Preparation of options
  const resonatorOptions: SelectOption[] = [
    { value: "", label: "Выберите персонажа" },
    ...allResonators
      .filter(res => res.id)
      .map(res => ({
        value: res.id!,
        label: res.name || "Без имени",
        imgSrc: res.resonatorImgMini,
      })),
  ]

  const echoSetOptions: SelectOption[] = [
    { value: "", label: "+ Добавить сет" },
    ...allEchoSets
      .filter(set => set.id)
      .map(set => ({
        value: set.id!,
        label: set.name || "Без названия",
        imgSrc: set.img,
      })),
  ]

  // Колонки для отображения
  const columnKeys = ["0", "1", "2"]

  return (
    <div className="team-editor">
      <h3>Отряды (Команды)</h3>

      {teams.map((team, tIdx) => (
        <div key={tIdx} className="team-block">
          <div className="team-header">
            <input
              type="text"
              placeholder="Название отряда (например, Аэро пачка)"
              value={team.name}
              onChange={e => handleTeamNameChange(tIdx, e.target.value)}
              className="team-name-input"
            />
            <button
              type="button"
              onClick={() => removeTeam(tIdx)}
              className="btn-remove-team"
            >
              Удалить отряд
            </button>
          </div>

          {team.rows.map((row, rIdx) => (
            <div key={rIdx} className="team-row-wrapper">
              <div className="team-row">
                {/* Map through the 3 main columns using keys "0", "1", "2" */}
                {columnKeys.map((colKey) => {
                  const columnSlots = row.slots[colKey] || []
                  
                  return (
                    <div key={colKey} className="team-column">
                      
                      {/* Render each character in this column */}
                      {columnSlots.map((slot, charIdx) => (
                        <div key={charIdx} className="team-slot-card">
                          
                          {/* Remove Character Button */}
                          <button
                              type="button"
                              onClick={() => removeCharacterFromColumn(tIdx, rIdx, colKey, charIdx)}
                              className="btn-remove-character"
                              title="Удалить персонажа из слота"
                          >
                              ×
                          </button>

                          {/* --- ВЫБОР ПЕРСОНАЖА --- */}
                          <CustomSelect
                            options={resonatorOptions}
                            value={slot.resonatorId || ""}
                            onChange={val =>
                              handleResonatorSelect(tIdx, rIdx, colKey, charIdx, val)
                            }
                            placeholder="Персонаж"
                            className="slot-resonator-select"
                          />

                          {slot.resonatorId && (
                            <div className="selected-resonator-preview">
                              {(() => {
                                const res = allResonators.find(
                                  r => r.id === slot.resonatorId,
                                )
                                return res ? (
                                  <img
                                    src={res.resonatorImgMini || res.resonatorImg}
                                    alt={res.name}
                                    className="resonator-thumb"
                                  />
                                ) : null
                              })()}
                            </div>
                          )}

                          {/* Echo Icons Display */}
                          <div className="echo-icons-container">
                            {slot.echoSetIcons.map((echoSetId, iconIdx) => {
                              const echoSetObj = allEchoSets.find(
                                es => es.id === echoSetId,
                              )
                              return (
                                <div key={iconIdx} className="echo-icon-wrapper">
                                  <img
                                    src={echoSetObj?.img || ""}
                                    alt={echoSetObj?.name || "Set"}
                                    className="echo-icon"
                                    title={echoSetObj?.name}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEchoIcon(tIdx, rIdx, colKey, charIdx, iconIdx)
                                    }
                                    className="btn-remove-icon"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            })}
                          </div>

                          {/* --- ВЫБОР ЭХО СЕТА --- */}
                          <CustomSelect
                            options={echoSetOptions}
                            value=""
                            onChange={val => addEchoSetId(tIdx, rIdx, colKey, charIdx, val)}
                            placeholder="+ Сет"
                            className="echo-set-select"
                          />
                        </div>
                      ))}

                      {/* Button to add another character to THIS column */}
                      <button
                          type="button"
                          onClick={() => addCharacterToColumn(tIdx, rIdx, colKey)}
                          className="btn-add-character-to-column"
                      >
                          + Персонаж
                      </button>

                    </div>
                  )
                })}
              </div>

              {team.rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRowFromTeam(tIdx, rIdx)}
                  className="btn-remove-row"
                >
                  Удалить эту строку
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addRowToTeam(tIdx)}
            className="btn-add-row"
          >
            + Добавить строку
          </button>
        </div>
      ))}

      <button type="button" onClick={addTeam} className="btn-add-team">
        + Добавить новый отряд
      </button>
    </div>
  )
}