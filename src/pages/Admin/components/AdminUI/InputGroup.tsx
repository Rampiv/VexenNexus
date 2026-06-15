import type React from "react"

interface InputGroupProps {
  label: string
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  placeholder?: string
  required?: boolean
  type?: string
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}) => (
  <div className="form-group">
    <label>
      {label}
      {required && <span className="required">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
)