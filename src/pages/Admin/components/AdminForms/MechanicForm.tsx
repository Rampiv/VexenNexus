import type React from "react"
import type { MechanicForm as MechanicFormType } from "../../hooks/useAdminData"
import { ArrayEditor } from "../../../../components"
import { InputGroup } from "../AdminUI"

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
  return (
    <>
      <InputGroup
        label="Название механики (RU)"
        name="title"
        value={form.title || ""}
        onChange={onChange}
        required
      />
      <InputGroup
        label="Название механики (ENG)"
        name="engName"
        value={form.engName || ""}
        onChange={onChange}
        required
      />
      <InputGroup
        label="URL Иконки"
        name="img"
        value={form.img || ""}
        onChange={onChange}
        placeholder="https://..."
      />
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
    </>
  )
}
