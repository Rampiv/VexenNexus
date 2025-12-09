import { createContext, useContext } from 'react'

type GlossaryContextType = {
  scrollToGlossaryTerm: (id: string) => void
}

const GlossaryContext = createContext<GlossaryContextType>({
  scrollToGlossaryTerm: () => {
    console.warn('GlossaryContext: scrollToGlossaryTerm called outside provider')
  },
})

export const useGlossary = () => useContext(GlossaryContext)
export const GlossaryProvider = GlossaryContext.Provider