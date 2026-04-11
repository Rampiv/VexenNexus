import type React from "react"
import type { Team, TeamSlot, TeamRow } from "../../types/team"
import type { Resonator } from "../../types/resonator"
import './TeamEditor.scss'

interface TeamEditorProps {
  teams: Team[]
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
  allResonators: Resonator[]
}

const emptySlot: TeamSlot = {
  resonatorId: "",
  echoSetIcons: [],
}

// Функция для создания пустой строки из 3 слотов
const createEmptyRow = (): TeamRow => ({
  slots: [null, null, null],
})

// Функция для создания пустого отряда с одной строкой
const createEmptyTeam = (): Team => ({
  name: "",
  rows: [createEmptyRow()],
})

export const TeamEditor: React.FC<TeamEditorProps> = ({
  teams,
  setTeams,
  allResonators,
}) => {
  // Добавление нового отряда (с одной пустой строкой)
  const addTeam = () => {
    setTeams([...teams, createEmptyTeam()])
  }

  // Удаление отряда
  const removeTeam = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index)
    setTeams(newTeams)
  }

  // Изменение названия отряда
  const handleTeamNameChange = (index: number, value: string) => {
    const newTeams = [...teams]
    newTeams[index].name = value
    setTeams(newTeams)
  }

  // --- ЛОГИКА СТРОК ---

  // Добавление новой строки в отряд
  const addRowToTeam = (teamIndex: number) => {
    const newTeams = [...teams]
    newTeams[teamIndex].rows.push(createEmptyRow())
    setTeams(newTeams)
  }

  // Удаление строки из отряда
  const removeRowFromTeam = (teamIndex: number, rowIndex: number) => {
    const newTeams = [...teams]
    // Не удаляем последнюю строку, чтобы отряд не стал пустым (опционально)
    if (newTeams[teamIndex].rows.length > 1) {
      newTeams[teamIndex].rows.splice(rowIndex, 1)
      setTeams(newTeams)
    }
  }

  // --- ЛОГИКА СЛОТОВ ---

  const handleResonatorSelect = (
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
    resonatorId: string,
  ) => {
    const newTeams = [...teams]
    // Инициализируем слот, если он null
    if (!newTeams[teamIndex].rows[rowIndex].slots[slotIndex]) {
       newTeams[teamIndex].rows[rowIndex].slots[slotIndex] = { ...emptySlot }
    }
    
    newTeams[teamIndex].rows[rowIndex].slots[slotIndex]!.resonatorId = resonatorId
    setTeams(newTeams)
  }

  const addEchoIcon = (
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
    iconUrl: string,
  ) => {
    const newTeams = [...teams]
    if (!newTeams[teamIndex].rows[rowIndex].slots[slotIndex]) {
       newTeams[teamIndex].rows[rowIndex].slots[slotIndex] = { ...emptySlot }
    }
    newTeams[teamIndex].rows[rowIndex].slots[slotIndex]!.echoSetIcons.push(iconUrl)
    setTeams(newTeams)
  }

  const removeEchoIcon = (
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
    iconIndex: number,
  ) => {
    const newTeams = [...teams]
    if (newTeams[teamIndex].rows[rowIndex].slots[slotIndex]) {
      newTeams[teamIndex].rows[rowIndex].slots[slotIndex]!.echoSetIcons.splice(iconIndex, 1)
      setTeams(newTeams)
    }
  }

  const handleEchoIconInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    teamIndex: number,
    rowIndex: number,
    slotIndex: number,
  ) => {
    if (e.key === "Enter") {
      const url = e.currentTarget.value.trim()
      if (url) {
        addEchoIcon(teamIndex, rowIndex, slotIndex, url)
        e.currentTarget.value = ""
      }
    }
  }

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
              onChange={(e) => handleTeamNameChange(tIdx, e.target.value)}
              className="team-name-input"
            />
            <button
              onClick={() => removeTeam(tIdx)}
              className="btn-remove-team"
            >
              Удалить отряд
            </button>
          </div>

          {/* Рендеринг строк */}
          {team.rows.map((row, rIdx) => (
            <div key={rIdx} className="team-row-wrapper">
              <div className="team-row">
                {row.slots.map((slot, sIdx) => (
                  <div key={sIdx} className="team-slot">
                    <select
                      value={slot?.resonatorId || ""}
                      onChange={(e) =>
                        handleResonatorSelect(tIdx, rIdx, sIdx, e.target.value)
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
                              src={res.resonatorImg}
                              alt={res.name}
                              className="resonator-thumb"
                            />
                          ) : null
                        })()}
                      </div>
                    )}

                    <div className="echo-icons-container">
                      {slot?.echoSetIcons.map((icon, iconIdx) => (
                        <div key={iconIdx} className="echo-icon-wrapper">
                          <img src={icon} alt="Echo Set" className="echo-icon" />
                          <button
                            onClick={() =>
                              removeEchoIcon(tIdx, rIdx, sIdx, iconIdx)
                            }
                            className="btn-remove-icon"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="URL иконки сета + Enter"
                      onKeyDown={(e) => handleEchoIconInput(e, tIdx, rIdx, sIdx)}
                      className="echo-icon-input"
                    />
                  </div>
                ))}
              </div>
              
              {/* Кнопка удаления строки (если строк больше 1) */}
              {team.rows.length > 1 && (
                 <button 
                   onClick={() => removeRowFromTeam(tIdx, rIdx)}
                   className="btn-remove-row"
                 >
                   Удалить эту строку
                 </button>
              )}
            </div>
          ))}

          {/* Кнопка добавления новой строки внутри отряда */}
          <button 
            onClick={() => addRowToTeam(tIdx)} 
            className="btn-add-row"
          >
            + Добавить строку (3 персонажа)
          </button>
        </div>
      ))}

      <button onClick={addTeam} className="btn-add-team">
        + Добавить новый отряд
      </button>
    </div>
  )
}