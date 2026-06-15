import type React from "react"
import {
  useAdminData,
  type ResonatorForm as ResonatorFormType,
} from "../../hooks/useAdminData"
import type { Resonator } from "../../../../types/resonator"
import type { EchoSet } from "../../../../types/echoSet"
import { InputGroup, SelectGroup } from "../AdminUI"
import {
  ArrayEditor,
  EchoSetSelector,
  TeamEditor,
} from "../../../../components"

interface ResonatorFormProps {
  form: ResonatorFormType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  setForm: React.Dispatch<React.SetStateAction<ResonatorFormType>>
  allResonators: Resonator[]
  allEchoSets: EchoSet[]
}

export const ResonatorForm: React.FC<ResonatorFormProps> = ({
  form,
  onChange,
  setForm,
  allResonators,
  allEchoSets,
}) => {
  const admin = useAdminData()
  return (
    <>
      {admin.isAdmin && (
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
              label="Элемент"
              name="element"
              value={form.element || "Havoc"}
              onChange={onChange}
              options={[
                "Havoc",
                "Aero",
                "Fusion",
                "Spectro",
                "Glacio",
                "Electro",
              ]}
            />
            <SelectGroup
              label="Редкость"
              name="rarity"
              value={form.rarity || 5}
              onChange={onChange}
              options={[5, 4]}
              type="number"
            />
            <SelectGroup
              label="Оружие"
              name="weaponType"
              value={form.weaponType || "Sword"}
              onChange={onChange}
              options={[
                "Sword",
                "Broadblade",
                "Gauntlets",
                "Pistols",
                "Rectifier",
              ]}
            />
          </div>
          <InputGroup
            label="URL большой картинки (в гайде)"
            name="resonatorImg"
            value={form.resonatorImg || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="URL мини картинки (на карточках)"
            name="resonatorImgMini"
            value={form.resonatorImgMini || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="URL фото карточки персонажа для баннера"
            name="resonatorImgBanner"
            value={form.resonatorImgBanner || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="URL Превью ютуб ролика"
            name="resonatorPreview"
            value={form.resonatorPreview || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="URL ютуб ролика"
            name="resonatorYTLink"
            value={form.resonatorYTLink || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="URL гайда"
            name="resonatorImgGuide"
            value={form.resonatorImgGuide || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <InputGroup
            label="URL Детального подсчета"
            name="resonatorImgDetails"
            value={form.resonatorImgDetails || ""}
            onChange={onChange}
            placeholder="https://..."
          />
          <ArrayEditor
            title="Описание персонажа (под большой картинкой)"
            items={form.descr || []}
            setItems={newDescr =>
              setForm(prev => ({
                ...prev,
                descr:
                  typeof newDescr === "function"
                    ? newDescr(prev.descr || [])
                    : newDescr,
              }))
            }
            placeholder="Информация..."
          />
          <ArrayEditor
            title="Заключение по персонажу"
            items={form.result || []}
            setItems={newResult =>
              setForm(prev => ({
                ...prev,
                result:
                  typeof newResult === "function"
                    ? newResult(prev.result || [])
                    : newResult,
              }))
            }
            placeholder="Перс заебись"
          />
        </>
      )}
      {(admin.isAdmin || admin.isTiermake) && (
        <TeamEditor
          teams={form.teams || []}
          setTeams={newTeams =>
            setForm(prev => ({
              ...prev,
              teams:
                typeof newTeams === "function"
                  ? newTeams(prev.teams || [])
                  : newTeams,
            }))
          }
          allResonators={allResonators}
          allEchoSets={allEchoSets}
        />
      )}

      {admin.isAdmin && (
        <EchoSetSelector
          selections={form.echoSets || []}
          setSelections={newSelections =>
            setForm(prev => ({
              ...prev,
              echoSets:
                typeof newSelections === "function"
                  ? newSelections(prev.echoSets || [])
                  : newSelections,
            }))
          }
          allEchoSets={allEchoSets}
        />
      )}
    </>
  )
}
