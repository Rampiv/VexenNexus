import type React from "react"
import { useState } from "react"
import type { Team, TeamSlot, TeamRow } from "../../types/team"
import type { Resonator } from "../../types/resonator"
import type { EchoSet } from "../../types/echoSet"
import "./TeamEditor.scss"

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
  // Состояние для отслеживания того, какой именно dropdown открыт.
  // Формат ключа: "tIdx-rIdx-sIdx" или null, если ничего не открыто.
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

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

    // Закрываем dropdown после выбора
    setOpenDropdownId(null)
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

  // Уникальный ID для каждого слота
  const getDropdownId = (t: number, r: number, s: number) => `${t}-${r}-${s}`

  // Обработчик клика вне dropdown для закрытия
  const handleGlobalClick = () => {
    if (openDropdownId) setOpenDropdownId(null)
  }

  return (
    <div className="team-editor" onClick={handleGlobalClick}>
      <h3>Отряды (Команды)</h3>

      {teams.map((team, tIdx) => (
        <div
          key={tIdx}
          className="team-block"
          onClick={e => e.stopPropagation()}
        >
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
                  const dropdownId = getDropdownId(tIdx, rIdx, sIdx)
                  const isOpen = openDropdownId === dropdownId

                  return (
                    <div key={sIdx} className="team-slot">
                      {/* Выбор персонажа (нативный select, так как там нет картинок) */}
                      <select
                        value={slot?.resonatorId || ""}
                        onChange={e =>
                          handleResonatorSelect(
                            tIdx,
                            rIdx,
                            sIdx,
                            e.target.value,
                          )
                        }
                        className="slot-resonator-select"
                      >
                        <option value="">Выберите персонажа</option>
                        {allResonators.map(res => (
                          <option key={res.id} value={res.id}>
                            {res.name}
                          </option>
                        ))}
                      </select>

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

                      {/* КАСТОМНЫЙ DROPDOWN ДЛЯ ЭХО СЕТОВ */}
                      <div className="custom-echo-select">
                        <div
                          className={`custom-select-trigger ${isOpen ? "active" : ""}`}
                          onClick={e => {
                            e.stopPropagation() // Предотвращаем закрытие при клике на триггер
                            setOpenDropdownId(isOpen ? null : dropdownId)
                          }}
                        >
                          <span>+ Добавить сет</span>
                          <span className="arrow">{isOpen ? "▲" : "▼"}</span>
                        </div>

                        {isOpen && (
                          <ul className="custom-select-options">
                            {allEchoSets.map(set => {
                              return (
                                <li
                                  key={set.id}
                                  className="custom-option"
                                  onClick={e => {
                                    e.stopPropagation()
                                    addEchoSetId(tIdx, rIdx, sIdx, set.id!)
                                  }}
                                >
                                  <img
                                    src={set.img}
                                    alt={set.name}
                                    className="option-img"
                                  />
                                  <span className="option-text">
                                    {set.name}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
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
