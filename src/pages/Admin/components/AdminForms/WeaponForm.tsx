import type React from "react"
import { InputGroup, SelectGroup } from "../AdminUI"
import {
  useAdminData,
  type WeaponForm as WeaponFormType,
} from "../../hooks/useAdminData"
import { ArrayEditor } from "../../../../components"
import type { WeaponFields } from "../../../../types/roles"

interface WeaponFormProps {
  form: WeaponFormType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  setForm: React.Dispatch<React.SetStateAction<WeaponFormType>>
}

export const WeaponForm: React.FC<WeaponFormProps> = ({
  form,
  onChange,
  setForm,
}) => {
  const admin = useAdminData()
  const canEdit = (field: keyof WeaponFields) =>
    admin.hasFieldPermission("weapons", field)

  return (
    <>
      <div className="form-row">
        {canEdit("name") && (
          <InputGroup
            label="Имя (RU)"
            name="name"
            value={form.name || ""}
            onChange={onChange}
            required
          />
        )}
        {canEdit("engName") && (
          <InputGroup
            label="Имя (ENG)"
            name="engName"
            value={form.engName || ""}
            onChange={onChange}
            required
          />
        )}
      </div>
      <div className="form-row">
        {canEdit("type") && (
          <SelectGroup
            label="Тип"
            name="type"
            value={form.type || "Sword"}
            onChange={onChange}
            options={[
              "Sword",
              "Broadblade",
              "Gauntlets",
              "Pistols",
              "Rectifier",
            ]}
          />
        )}
        {canEdit("rarity") && (
          <SelectGroup
            label="Редкость"
            name="rarity"
            value={form.rarity || 5}
            onChange={onChange}
            options={[5, 4]}
            type="number"
          />
        )}
      </div>
      {canEdit("stat1") && (
        <InputGroup
          label="Стат Основной( АТК: 300)"
          name="stat1"
          value={form.stat1 || ""}
          onChange={onChange}
        />
      )}
      {canEdit("stat2") && (
        <InputGroup
          label="Стат Дополнительный (КУ: 30%)"
          name="stat2"
          value={form.stat2 || ""}
          onChange={onChange}
        />
      )}
      {canEdit("img") && (
        <InputGroup
          label="URL Картинки"
          name="img"
          value={form.img || ""}
          onChange={onChange}
          placeholder="https://..."
        />
      )}
      {canEdit("description") && (
        <ArrayEditor
          title="Описание пассивки"
          items={form.description || []}
          setItems={v =>
            setForm(p => ({
              ...p,
              description: typeof v === "function" ? v(p.description || []) : v,
            }))
          }
          placeholder="Описание пассивки абзац"
        />
      )}
    </>
  )
}
