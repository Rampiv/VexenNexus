import { useState, useEffect } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../firebase/config"
import type { EchoSet } from "../types/echoSet"

export const useEchoSets = () => {
  const [echoSets, setEchoSets] = useState<EchoSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEchoSets = async () => {
      try {
        const q = query(collection(db, "echo_sets"), orderBy("name"))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as EchoSet[]
        setEchoSets(data)
      } catch (error) {
        console.error("Ошибка загрузки эхо-сетов:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEchoSets()
  }, [])

  return { echoSets, loading }
}
