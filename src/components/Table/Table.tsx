import "./Tables.scss"
import { useMemo } from "react"

type TableRow = Record<string, React.ReactNode>

interface TableProps {
  columns?: string[]
  rows: TableRow[]
  highlightId?: string // ✨ новое свойство
}

export const Table: React.FC<TableProps> = ({
  columns = [],
  rows = [],
  highlightId,
}) => {
  const headers = useMemo(() => {
    return columns.length > 0
      ? columns
      : rows.length > 0
        ? Object.keys(rows[0])
        : []
  }, [columns, rows])

  if (rows.length === 0) {
    return (
      <div className="table__container">
        <p>Нет данных</p>
      </div>
    )
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const rowId = typeof row.id === "string" ? row.id : undefined
          const isHighlighted = rowId === highlightId

          return (
            <tr key={rowIndex} id={rowId}>
              {headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className={isHighlighted ? "table__row--highlighted" : ""}
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
