import type React from "react"
import { InputGroup } from "../AdminUI"
import type {
  TierListCycle,
  TierListRow,
  TierListTag,
} from "../../../../types/TierList"
import type { Resonator } from "../../../../types/resonator"
import { TierListEditor } from "../../../../components"
import { useAdminData } from "../../hooks/useAdminData"
import type { TierListFields } from "../../../../types/roles"

interface TierListFormProps {
  form: {
    name: string
    nameImg: string
    cycles: TierListCycle[]
  }
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string
      nameImg: string
      cycles: TierListCycle[]
    }>
  >
  activeCycleIndex: number
  allResonators: Resonator[]
  globalTagRegistry: Map<string, TierListTag>
  moveTierListRow: (direction: "up" | "down", rowIndex: number) => void
  addCycle: () => void
  removeCycle: (cycleIndex: number) => void
  updateCycleName: (cycleIndex: number, name: string) => void
  switchCycle: (cycleIndex: number) => void
  updateCurrentCycleRows: (
    newRows: TierListRow[] | ((prev: TierListRow[]) => TierListRow[]),
  ) => void
  registerTag: (tag: TierListTag) => void
}

export const TierListForm: React.FC<TierListFormProps> = ({
  form,
  setForm,
  activeCycleIndex,
  allResonators,
  globalTagRegistry,
  moveTierListRow,
  addCycle,
  removeCycle,
  updateCycleName,
  switchCycle,
  updateCurrentCycleRows,
  registerTag,
}) => {
  const admin = useAdminData()
  const canEdit = (field: keyof TierListFields) =>
    admin.hasFieldPermission("tierlist", field)

  return (
    <>
      <div className="form-row">
        {canEdit("name") && (
          <InputGroup
            label="Название тир-листа (RU)"
            name="name"
            value={form.name}
            onChange={(e: any) =>
              setForm(prev => ({ ...prev, name: e.target.value }))
            }
            required
          />
        )}
        {canEdit("nameImg") && (
          <InputGroup
            label="Ссылка на картинку тир листа"
            name="nameImg"
            value={form.nameImg}
            onChange={(e: any) =>
              setForm(prev => ({ ...prev, nameImg: e.target.value }))
            }
          />
        )}
      </div>

      {canEdit("cycles") && (
        <div className="cycles-management">
          <h3>Управление циклами</h3>
          <div className="cycles-tabs">
            {form.cycles.map((cycle, index) => (
              <div
                key={cycle.id}
                className={`cycle-tab ${activeCycleIndex === index ? "active" : ""}`}
              >
                Цикл:
                <button
                  type="button"
                  onClick={() => switchCycle(index)}
                  className="cycle-tab-btn"
                >
                  {cycle.name}
                </button>
                <input
                  type="text"
                  value={cycle.name}
                  onChange={e => updateCycleName(index, e.target.value)}
                  className="cycle-name-input"
                  placeholder="Название цикла"
                />
                {form.cycles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCycle(index)}
                    className="cycle-remove-btn"
                    title="Удалить цикл"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addCycle} className="cycle-add-btn">
              + Добавить цикл
            </button>
          </div>
        </div>
      )}

      {canEdit("rows") && form.cycles[activeCycleIndex] && (
        <TierListEditor
          rows={form.cycles[activeCycleIndex].rows}
          setRows={updateCurrentCycleRows}
          allResonators={allResonators}
          availableTags={Array.from(globalTagRegistry.values())}
          onTagRegistered={registerTag}
          onMoveRow={moveTierListRow}
          canMoveUp={(index: number) => index > 0}
          canMoveDown={(index: number) =>
            index < form.cycles[activeCycleIndex].rows.length - 1
          }
        />
      )}
    </>
  )
}
