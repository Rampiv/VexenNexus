import type React from "react"
import {
  useAdminData,
  type MechanicForm as MechanicFormType,
} from "../../hooks/useAdminData"
import { ArrayEditor } from "../../../../components"
import { InputGroup } from "../AdminUI"
import type { MechanicFields } from "../../../../types/roles"

interface MechanicFormProps {
  form: MechanicFormType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  setForm: React.Dispatch<React.SetStateAction<MechanicFormType>>
}

export const MechanicForm: React.FC<MechanicFormProps> = ({
  form,
  onChange,
  setForm,
}) => {
  const admin = useAdminData()
  const canEdit = (field: keyof MechanicFields) =>
    admin.hasFieldPermission("mechanics", field)
  return (
    <>
      {canEdit("title") && (
        <InputGroup
          label="Название механики (RU)"
          name="title"
          value={form.title || ""}
          onChange={onChange}
          required
        />
      )}
      {canEdit("engName") && (
        <InputGroup
          label="Название механики (ENG)"
          name="engName"
          value={form.engName || ""}
          onChange={onChange}
          required
        />
      )}
      {canEdit("img") && (
        <InputGroup
          label="URL Иконки"
          name="img"
          value={form.img || ""}
          onChange={onChange}
          placeholder="https://..."
        />
      )}
      {canEdit("paragraphs") && (
        <ArrayEditor
          title="Описание (Абзацы)"
          items={form.paragraphs || []}
          setItems={newParagraphs =>
            setForm(prev => ({
              ...prev,
              paragraphs:
                typeof newParagraphs === "function"
                  ? newParagraphs(prev.paragraphs || [])
                  : newParagraphs,
            }))
          }
          placeholder="Текст абзаца..."
        />
      )}
    </>
  )
}
