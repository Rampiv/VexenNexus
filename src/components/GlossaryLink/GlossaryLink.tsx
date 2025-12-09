import { useGlossary } from "../../context/GlossaryContext"
import "./GlossaryLink.scss"

interface Props {
  id: string
  children: React.ReactNode
}

export const GlossaryLink = ({ id, children }: Props) => {
  const { scrollToGlossaryTerm } = useGlossary()

  return (
    <button
      className="glossary-link"
      onClick={e => {
        e.preventDefault()
        scrollToGlossaryTerm(id)
      }}
    >
      {children}
    </button>
  )
}
