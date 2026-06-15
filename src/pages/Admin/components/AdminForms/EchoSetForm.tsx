import type React from "react"
import { InputGroup } from "../AdminUI"
import type { EchoSetForm as EchoSetFormType } from "../../hooks/useAdminData"
import { ArrayEditor } from "../../../../components"

interface EchoSetFormProps {
  form: EchoSetFormType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  setForm: React.Dispatch<React.SetStateAction<EchoSetFormType>>
}

export const EchoSetForm: React.FC<EchoSetFormProps> = ({
  form,
  onChange,
  setForm,
}) => {
  return (
    <>
      <InputGroup
        label="Название сета (RU)"
        name="name"
        value={form.name || ""}
        onChange={onChange}
        required
      />
      <InputGroup
        label="Название сета (ENG)"
        name="engName"
        value={form.engName || ""}
        onChange={onChange}
        required
      />
      <InputGroup
        label="URL Иконки сета"
        name="img"
        value={form.img || ""}
        onChange={onChange}
        placeholder="https://..."
      />
      <InputGroup
        label="Номер патча, когда добавили сет"
        name="patchNumber"
        value={form.patchNumber || ""}
        onChange={onChange}
      />
      <InputGroup
        label="Номер по списку отображения"
        name="index"
        value={form.index || 0}
        onChange={onChange}
      />
      <ArrayEditor
        title="Описание сета 1 части"
        items={form.onePartsDescr || []}
        setItems={newDescription =>
          setForm(prev => ({
            ...prev,
            onePartsDescr:
              typeof newDescription === "function"
                ? newDescription(prev.onePartsDescr || [])
                : newDescription,
          }))
        }
        placeholder="Описание сета"
      />
      <ArrayEditor
        title="Описание сета 2 части"
        items={form.twoPartsDescr || []}
        setItems={newDescription =>
          setForm(prev => ({
            ...prev,
            twoPartsDescr:
              typeof newDescription === "function"
                ? newDescription(prev.twoPartsDescr || [])
                : newDescription,
          }))
        }
        placeholder="Описание сета"
      />
      <ArrayEditor
        title="Описание сета 5 частей"
        items={form.fivePartsDescr || []}
        setItems={newDescription =>
          setForm(prev => ({
            ...prev,
            fivePartsDescr:
              typeof newDescription === "function"
                ? newDescription(prev.fivePartsDescr || [])
                : newDescription,
          }))
        }
        placeholder="Описание сета"
      />
      <ArrayEditor
        title="Описание сета 3 части"
        items={form.threePartsDescr || []}
        setItems={newDescription =>
          setForm(prev => ({
            ...prev,
            threePartsDescr:
              typeof newDescription === "function"
                ? newDescription(prev.threePartsDescr || [])
                : newDescription,
          }))
        }
        placeholder="Описание сета"
      />
      <ArrayEditor
        title="Дополнение (важно)"
        items={form.important || []}
        setItems={newDescription =>
          setForm(prev => ({
            ...prev,
            important:
              typeof newDescription === "function"
                ? newDescription(prev.important || [])
                : newDescription,
          }))
        }
        placeholder="Важно"
      />
    </>
  )
}
