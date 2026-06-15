import type React from "react"

interface SelectGroupProps {
  label: string
  name: string
  value: any
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: any[]
  type?: string
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div className="form-group">
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange}>
      {options.map((opt: any) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)