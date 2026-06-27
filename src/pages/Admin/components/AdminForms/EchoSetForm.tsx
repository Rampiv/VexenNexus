import type React from "react"
import { InputGroup } from "../AdminUI"
import {
  useAdminData,
  type EchoSetForm as EchoSetFormType,
} from "../../hooks/useAdminData"
import { ArrayEditor } from "../../../../components"
import type { EchoSetFields } from "../../../../types/roles"

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
  const admin = useAdminData()
  const canEdit = (field: keyof EchoSetFields) =>
    admin.hasFieldPermission("echoSets", field)

  return (
    <>
      {canEdit("name") && (
        <InputGroup
          label="Название сета (RU)"
          name="name"
          value={form.name || ""}
          onChange={onChange}
          required
        />
      )}
      {canEdit("engName") && (
        <InputGroup
          label="Название сета (ENG)"
          name="engName"
          value={form.engName || ""}
          onChange={onChange}
          required
        />
      )}
      {canEdit("img") && (
        <InputGroup
          label="URL Иконки сета"
          name="img"
          value={form.img || ""}
          onChange={onChange}
          placeholder="https://..."
        />
      )}
      {canEdit("patchNumber") && (
        <InputGroup
          label="Номер патча"
          name="patchNumber"
          value={form.patchNumber || ""}
          onChange={onChange}
        />
      )}
      {canEdit("index") && (
        <InputGroup
          label="Номер по списку"
          name="index"
          value={form.index || 0}
          onChange={onChange}
        />
      )}
      {canEdit("onePartsDescr") && (
        <ArrayEditor
          title="Описание 1 части"
          items={form.onePartsDescr || []}
          setItems={v =>
            setForm(p => ({
              ...p,
              onePartsDescr:
                typeof v === "function" ? v(p.onePartsDescr || []) : v,
            }))
          }
          placeholder="Описание"
        />
      )}
      {canEdit("twoPartsDescr") && (
        <ArrayEditor
          title="Описание 2 части"
          items={form.twoPartsDescr || []}
          setItems={v =>
            setForm(p => ({
              ...p,
              twoPartsDescr:
                typeof v === "function" ? v(p.twoPartsDescr || []) : v,
            }))
          }
          placeholder="Описание"
        />
      )}
      {canEdit("fivePartsDescr") && (
        <ArrayEditor
          title="Описание 5 частей"
          items={form.fivePartsDescr || []}
          setItems={v =>
            setForm(p => ({
              ...p,
              fivePartsDescr:
                typeof v === "function" ? v(p.fivePartsDescr || []) : v,
            }))
          }
          placeholder="Описание"
        />
      )}
      {canEdit("threePartsDescr") && (
        <ArrayEditor
          title="Описание 3 части"
          items={form.threePartsDescr || []}
          setItems={v =>
            setForm(p => ({
              ...p,
              threePartsDescr:
                typeof v === "function" ? v(p.threePartsDescr || []) : v,
            }))
          }
          placeholder="Описание"
        />
      )}
      {canEdit("important") && (
        <ArrayEditor
          title="Дополнение (важно)"
          items={form.important || []}
          setItems={v =>
            setForm(p => ({
              ...p,
              important: typeof v === "function" ? v(p.important || []) : v,
            }))
          }
          placeholder="Важно"
        />
      )}
    </>
  )
}
