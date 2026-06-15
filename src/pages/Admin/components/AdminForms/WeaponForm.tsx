import type React from "react"
import { InputGroup, SelectGroup } from "../AdminUI"
import type { WeaponForm as WeaponFormType } from "../../hooks/useAdminData"
import { ArrayEditor } from "../../../../components"

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
  return (
    <>
      <div className="form-row">
        <InputGroup
          label="Имя (RU)"
          name="name"
          value={form.name || ""}
          onChange={onChange}
          required
        />
        <InputGroup
          label="Имя (ENG)"
          name="engName"
          value={form.engName || ""}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-row">
        <SelectGroup
          label="Тип"
          name="type"
          value={form.type || "Sword"}
          onChange={onChange}
          options={["Sword", "Broadblade", "Gauntlets", "Pistols", "Rectifier"]}
        />
        <SelectGroup
          label="Редкость"
          name="rarity"
          value={form.rarity || 5}
          onChange={onChange}
          options={[5, 4]}
          type="number"
        />
      </div>
      <InputGroup
        label="Стат Основной( АТК: 300)"
        name="stat1"
        value={form.stat1 || ""}
        onChange={onChange}
      />
       <InputGroup
        label="Стат Дополнительный (КУ: 30%)"
        name="stat2"
        value={form.stat2 || ""}
        onChange={onChange}
      />
      <InputGroup
        label="URL Картинки"
        name="img"
        value={form.img || ""}
        onChange={onChange}
        placeholder="https://..."
      />
      <ArrayEditor
        title="Описание пассивки"
        items={form.description || []}
        setItems={newDescription =>
          setForm(prev => ({
            ...prev,
            description:
              typeof newDescription === "function"
                ? newDescription(prev.description || [])
                : newDescription,
          }))
        }
        placeholder="Описание пассивки абзац"
      />
    </>
  )
}
