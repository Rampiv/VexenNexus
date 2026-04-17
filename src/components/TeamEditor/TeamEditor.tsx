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

const createEmptyRow = (): TeamRow => ({
  slots: [null, null, null],
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

  const handleResonatorSelect = (
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
    resonatorId: string,
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
              slots: row.slots.map((slot, sIdx) => {
                if (sIdx !== slotIndex) return slot

                const currentSlot = slot || { ...emptySlot }
                return {
                  ...currentSlot,
                  resonatorId: resonatorId,
                }
              }) as [TeamSlot | null, TeamSlot | null, TeamSlot | null],
            }
          }),
        }
      }),
    )
  }

  const addEchoSetId = (
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
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

            return {
              ...row,
              slots: row.slots.map((slot, sIdx) => {
                if (sIdx !== slotIndex) return slot

                const currentSlot = slot || { ...emptySlot }

                if (currentSlot.echoSetIcons.includes(echoSetId))
                  return currentSlot

                return {
                  ...currentSlot,
                  echoSetIcons: [...currentSlot.echoSetIcons, echoSetId],
                }
              }) as [TeamSlot | null, TeamSlot | null, TeamSlot | null],
            }
          }),
        }
      }),
    )
  }

  const removeEchoIcon = (
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
    iconIndex: number,
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
              slots: row.slots.map((slot, sIdx) => {
                if (sIdx !== slotIndex || !slot) return slot

                return {
                  ...slot,
                  echoSetIcons: slot.echoSetIcons.filter(
                    (_, iIdx) => iIdx !== iconIndex,
                  ),
                }
              }) as [TeamSlot | null, TeamSlot | null, TeamSlot | null],
            }
          }),
        }
      }),
    )
  }

  // Подготовка опций для селекта персонажей
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

  // Подготовка опций для селекта эхо-сетов
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
                {row.slots.map((slot, sIdx) => {
                  return (
                    <div key={sIdx} className="team-slot">
                      {/* --- ВЫБОР ПЕРСОНАЖА (CustomSelect) --- */}
                      <CustomSelect
                        options={resonatorOptions}
                        value={slot?.resonatorId || ""}
                        onChange={val =>
                          handleResonatorSelect(tIdx, rIdx, sIdx, val)
                        }
                        placeholder="Выберите персонажа"
                        className="slot-resonator-select"
                      />

                      {slot?.resonatorId && (
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

                      {/* Отображение выбранных сетов */}
                      <div className="echo-icons-container">
                        {slot?.echoSetIcons.map((echoSetId, iconIdx) => {
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
                                  removeEchoIcon(tIdx, rIdx, sIdx, iconIdx)
                                }
                                className="btn-remove-icon"
                              >
                                ×
                              </button>
                            </div>
                          )
                        })}
                      </div>

                      {/* --- ВЫБОР ЭХО СЕТА (CustomSelect) --- */}
                      <CustomSelect
                        options={echoSetOptions}
                        value=""
                        onChange={val => addEchoSetId(tIdx, rIdx, sIdx, val)}
                        placeholder="+ Добавить сет"
                        className="echo-set-select"
                      />
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
            + Добавить строку (3 персонажа)
          </button>
        </div>
      ))}

      <button type="button" onClick={addTeam} className="btn-add-team">
        + Добавить новый отряд
      </button>
    </div>
  )
}
