import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import type { FirestoreError } from "firebase/firestore"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore"
import "./Admin.scss"
import type { Resonator } from "../../types/resonator"
import type { Weapon } from "../../types/weapon"
import type { SiteSettings } from "../../types/siteSettings"
import type { Mechanic } from "../../types/mechanic"
import type { EchoSet } from "../../types/echoSet"
import type { TierList, TierListRow, TierListTag } from "../../types/TierList"
import { db } from "../../firebase/config"
import {
  ArrayEditor,
  DescriptionEditor,
  EchoSetSelector,
  Loader,
  TeamEditor,
  TierListEditor,
} from "../../components"
import { useAuth } from "@contexts/AuthContext"
import { convertOldTeamsToNew } from "../../supp/ConvertOldTeamsToNew"

const RESONATORS_COLLECTION = "resonators"
const WEAPONS_COLLECTION = "weapons"
const MECHANICS_COLLECTION = "mechanics"
const ECHO_SETS_COLLECTION = "echo_sets"
const SETTINGS_COLLECTION = "settings"
const SETTINGS_DOC_ID = "site_settings"
const TIER_LISTS_COLLECTION = "tier_lists"

type Tab =
  | "resonators"
  | "weapons"
  | "mechanics"
  | "echoSets"
  | "settings"
  | "tierlist"

interface ResonatorForm extends Partial<Resonator> {}
interface WeaponForm extends Partial<Weapon> {}
interface MechanicForm extends Partial<Mechanic> {}
interface EchoSetForm extends Partial<EchoSet> {}

interface SettingsDescription {
  id: string
  title: string
  content: string
}

interface SettingsForm {
  nextBannerDate: string
  futureResonatorIds: string[]
  preview_img: string
  filter_img: string
  tierListDescriptions: SettingsDescription[]
}

export const Admin = () => {
  const {
    userRole,
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
  } = useAuth()
  const [inputKey, setInputKey] = useState("")
  const [authError, setAuthError] = useState("")

  const isAdmin = userRole === "admin" && isAuthenticated
  const isModerator = userRole === "moderator" && isAuthenticated

  const [activeTab, setActiveTab] = useState<Tab>("resonators")
  const [searchTerm, setSearchTerm] = useState("")

  const [resonators, setResonators] = useState<Resonator[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [mechanics, setMechanics] = useState<Mechanic[]>([])
  const [echoSets, setEchoSets] = useState<EchoSet[]>([])
  const [tierLists, setTierLists] = useState<TierList[]>([])

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [isDbReady, setIsDbReady] = useState(false)

  const [globalTagRegistry, setGlobalTagRegistry] = useState<
    Map<string, TierListTag>
  >(new Map())

  useEffect(() => {
    const checkDb = async () => {
      try {
        await getDoc(doc(db, "_check", "connection"))
      } catch {
        // Игнорируем ошибку
      }
      setIsDbReady(true)
    }
    checkDb()
  }, [])

  const [resonatorForm, setResonatorForm] = useState<ResonatorForm>({
    name: "",
    engName: "",
    element: "Havoc",
    rarity: 5,
    weaponType: "Sword",
    resonatorImg: "",
    resonatorImgMini: "",
    resonatorImgBanner: "",
    resonatorPreview: "",
    resonatorImgGuide: "",
    resonatorYTLink: "",
    teams: [],
    descr: [],
    result: [],
    resonatorImgDetails: "",
    echoSets: [],
  })

  const [weaponForm, setWeaponForm] = useState<WeaponForm>({
    name: "",
    engName: "",
    type: "Sword",
    rarity: 5,
    img: "",
    description: [],
  })

  const [mechanicForm, setMechanicForm] = useState<MechanicForm>({
    title: "",
    engName: "",
    img: "",
    paragraphs: [],
  })

  const [echoSetForm, setEchoSetForm] = useState<EchoSetForm>({
    name: "",
    engName: "",
    img: "",
    twoPartsDescr: [],
    fivePartsDescr: [],
    threePartsDescr: [],
    important: [],
    patchNumber: "",
    index: 0,
  })

  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    nextBannerDate: "",
    futureResonatorIds: [],
    preview_img: "",
    filter_img: "",
    tierListDescriptions: [],
  })

  const [tierListForm, setTierListForm] = useState<{
    name: string
    nameImg: string
    rows: TierListRow[]
  }>({
    name: "",
    nameImg: "",
    rows: [
      {
        id: crypto.randomUUID(),
        rating: "S",
        ratingImg: "",
        dpsResonatorIds: [],
        hybridResonatorIds: [],
        supportResonatorIds: [],
      },
    ],
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  const extractGlobalTags = useCallback(
    (lists: TierList[]): Map<string, TierListTag> => {
      const tagMap = new Map<string, TierListTag>()
      lists.forEach(list => {
        list.rows?.forEach(row => {
          Object.values(row.resonatorSettings || {}).forEach(
            (settings: any) => {
              settings?.tags?.forEach((tag: TierListTag) => {
                if (!tagMap.has(tag.id)) tagMap.set(tag.id, { ...tag })
              })
            },
          )
        })
        list.usedTags?.forEach(tag => {
          if (!tagMap.has(tag.id)) tagMap.set(tag.id, { ...tag })
        })
      })
      return tagMap
    },
    [],
  )

  const registerTag = useCallback((tag: TierListTag) => {
    setGlobalTagRegistry(prev => {
      if (prev.has(tag.id)) return prev
      const newMap = new Map(prev)
      newMap.set(tag.id, tag)
      return newMap
    })
  }, [])

  const moveTierListRow = useCallback(
    (direction: "up" | "down", rowIndex: number) => {
      setTierListForm(prev => {
        const newRows = [...prev.rows]
        const targetIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1
        if (targetIndex < 0 || targetIndex >= newRows.length) return prev
        ;[newRows[rowIndex], newRows[targetIndex]] = [
          newRows[targetIndex],
          newRows[rowIndex],
        ]
        return { ...prev, rows: newRows }
      })
    },
    [],
  )

  const fetchSettings = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      try {
        const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID)
        const docSnap = await getDoc(settingsRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings
          setSettingsForm({
            nextBannerDate: data.nextBannerDate ?? "",
            futureResonatorIds: data.futureResonatorIds ?? [],
            preview_img: data.preview_img ?? "",
            filter_img: data.filter_img ?? "",
            tierListDescriptions: (data.tierListDescriptions || []).map(
              (d: any) => ({
                id: d.id || crypto.randomUUID(),
                title: d.title || "",
                content: d.content || "",
              }),
            ),
          })
          setSettingsError(null)
          return true
        } else {
          const defaultSettings: Partial<SiteSettings> = {
            nextBannerDate: "",
            futureResonatorIds: [],
            preview_img: "",
            filter_img: "",
            tierListDescriptions: [],
          }
          await setDoc(
            doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID),
            defaultSettings,
          )
          setSettingsForm({
            nextBannerDate: "",
            futureResonatorIds: [],
            preview_img: "",
            filter_img: "",
            tierListDescriptions: [],
          })
          setSettingsError(null)
          return true
        }
      } catch (error) {
        const err = error as FirestoreError
        if (
          retryCount < 3 &&
          (err.code === "unavailable" || err.code === "deadline-exceeded")
        ) {
          await new Promise(resolve =>
            setTimeout(resolve, 500 * (retryCount + 1)),
          )
          return fetchSettings(retryCount + 1)
        }
        setSettingsError(`Не удалось загрузить настройки: ${err.message}`)
        return false
      }
    },
    [],
  )

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !isDbReady) return
    setLoading(true)
    setSettingsError(null)

    try {
      const [resSnap, weapSnap, mechSnap, echoSnap, tierSnap] =
        await Promise.all([
          getDocs(
            query(collection(db, RESONATORS_COLLECTION), orderBy("name")),
          ),
          getDocs(query(collection(db, WEAPONS_COLLECTION), orderBy("name"))),
          getDocs(
            query(collection(db, MECHANICS_COLLECTION), orderBy("title")),
          ),
          getDocs(query(collection(db, ECHO_SETS_COLLECTION), orderBy("name"))),
          getDocs(
            query(collection(db, TIER_LISTS_COLLECTION), orderBy("name")),
          ),
        ])

      setResonators(
        resSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Resonator[],
      )
      setWeapons(
        weapSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Weapon[],
      )
      setMechanics(
        mechSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Mechanic[],
      )
      setEchoSets(
        echoSnap.docs.map(d => ({ id: d.id, ...d.data() })) as EchoSet[],
      )

      const loadedTierLists = tierSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as TierList[]
      setTierLists(loadedTierLists)

      const tags = extractGlobalTags(loadedTierLists)
      setGlobalTagRegistry(tags)

      await fetchSettings()
    } catch (error) {
      console.error("Ошибка загрузки данных:", error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, isDbReady, fetchSettings, extractGlobalTags])

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !isDbReady) return
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID)
    const unsubscribe = onSnapshot(
      settingsRef,
      docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings
          setSettingsForm(prev => ({
            ...prev,
            nextBannerDate: data.nextBannerDate ?? prev.nextBannerDate,
            futureResonatorIds:
              data.futureResonatorIds ?? prev.futureResonatorIds,
            preview_img: data.preview_img ?? prev.preview_img,
            filter_img: data.filter_img ?? prev.filter_img,
            tierListDescriptions: (data.tierListDescriptions || []).map(
              (d: any, idx: number) => ({
                id:
                  d.id ||
                  prev.tierListDescriptions[idx]?.id ||
                  crypto.randomUUID(),
                title: d.title || "",
                content: d.content || "",
              }),
            ),
          }))
          setSettingsError(null)
        }
      },
      error => {
        setSettingsError("Ошибка синхронизации настроек")
      },
    )
    return () => unsubscribe()
  }, [isAuthenticated, isAdmin, isDbReady])

  useEffect(() => {
    if (isAuthenticated && isDbReady) fetchData()
  }, [isAuthenticated, isDbReady, fetchData])

  const refreshSettings = useCallback(async () => {
    setSettingsError(null)
    const success = await fetchSettings()
    if (success) {
      const btn = document.querySelector(".btn-refresh-settings")
      if (btn) {
        btn.classList.add("refreshed")
        setTimeout(() => btn.classList.remove("refreshed"), 300)
      }
    }
  }, [fetchSettings])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    if (!userRole) return
    const success = await login(inputKey, userRole)
    if (success) {
      setInputKey("")
      setTimeout(() => fetchData(), 100)
    } else {
      setAuthError(
        `Неверный ключ доступа для роли: ${userRole === "admin" ? "Админ" : "Модератор"}.`,
      )
    }
  }

  const handleLogout = () => {
    logout()
    setResonators([])
    setWeapons([])
    setMechanics([])
    setEchoSets([])
    setSettingsForm({
      nextBannerDate: "",
      futureResonatorIds: [],
      preview_img: "",
      filter_img: "",
      tierListDescriptions: [],
    })
    setSearchTerm("")
    setSettingsError(null)
  }

  const handleResonatorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setResonatorForm(prev => ({ ...prev, [name]: value }))
  }
  const handleWeaponChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setWeaponForm(prev => ({ ...prev, [name]: value }))
  }
  const handleMechanicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setMechanicForm(prev => ({ ...prev, [name]: value }))
  }
  const handleEchoSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEchoSetForm(prev => ({ ...prev, [name]: value }))
  }
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettingsForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let collectionName = "",
        dataToSave: any = {},
        objTitle = "",
        objLink = "",
        isSettings = false

      if (activeTab === "settings") {
        isSettings = true
        const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID)
        dataToSave = {
          nextBannerDate: settingsForm.nextBannerDate,
          futureResonatorIds: settingsForm.futureResonatorIds,
          preview_img: settingsForm.preview_img,
          filter_img: settingsForm.filter_img,
          tierListDescriptions: settingsForm.tierListDescriptions.map(
            ({ id, ...rest }) => rest,
          ),
          updatedAt: serverTimestamp(),
        }
        await setDoc(settingsRef, dataToSave, { merge: true })
        setSettingsError(null)
        alert("Настройки сохранены!")
      } else {
        if (activeTab === "resonators") {
          collectionName = RESONATORS_COLLECTION
          objTitle = resonatorForm.name || ""
          objLink = `/resonator/${resonatorForm.engName}`
          dataToSave = {
            ...resonatorForm,
            updatedAt: serverTimestamp(),
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        } else if (activeTab === "weapons") {
          collectionName = WEAPONS_COLLECTION
          objTitle = weaponForm.engName || ""
          objLink = `/weapons/${encodeURIComponent(weaponForm.engName || "")}`
          dataToSave = {
            ...weaponForm,
            updatedAt: serverTimestamp(),
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        } else if (activeTab === "mechanics") {
          collectionName = MECHANICS_COLLECTION
          objTitle = mechanicForm.engName || ""
          if (mechanicForm.engName)
            objLink = `/mechanics/${mechanicForm.engName.toLowerCase().replace(/\s+/g, "-")}`
          dataToSave = {
            ...mechanicForm,
            updatedAt: serverTimestamp(),
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        } else if (activeTab === "echoSets") {
          collectionName = ECHO_SETS_COLLECTION
          objTitle = echoSetForm.name || ""
          if (echoSetForm.engName)
            objLink = `/echoSets/${echoSetForm.engName.toLowerCase().replace(/\s+/g, "-")}`
          dataToSave = {
            ...echoSetForm,
            updatedAt: serverTimestamp(),
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        } else if (activeTab === "tierlist") {
          collectionName = TIER_LISTS_COLLECTION
          objTitle = tierListForm.name || ""
          objLink = `/tierlists/${tierListForm.name}`

          const allTagsMap = new Map<string, TierListTag>()
          tierListForm.rows.forEach(row => {
            Object.values(row.resonatorSettings || {}).forEach(
              (settings: any) => {
                settings?.tags?.forEach((tag: any) => {
                  if (tag?.id) {
                    const uniqueKey = `${(tag.text || tag.name || "").toLowerCase()}_${tag.color || "#000000"}`
                    if (!allTagsMap.has(uniqueKey)) {
                      allTagsMap.set(uniqueKey, {
                        id: tag.id,
                        name: tag.text || tag.name || "",
                        color: tag.color || "#7d40ff",
                      })
                    }
                  }
                })
              },
            )
          })

          dataToSave = {
            ...tierListForm,
            usedTags: Array.from(allTagsMap.values()),
            updatedAt: serverTimestamp(),
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        }
        if (editingId) {
          const docRef = doc(db, collectionName, editingId)
          await updateDoc(docRef, dataToSave)
          if (activeTab === "resonators")
            await addUpdateLog("Изменено", `гайд на ${objTitle}`, objLink)
          if (activeTab === "mechanics")
            await addUpdateLog("Изменено", `механика: ${objTitle}`, objLink)
          if (activeTab === "weapons")
            await addUpdateLog("Изменено", `оружие: ${objTitle}`, objLink)
          if (activeTab === "echoSets")
            await addUpdateLog("Изменено", `эхо сет: ${objTitle}`, objLink)
          if (activeTab === "tierlist")
            await addUpdateLog("Изменено", `тир-лист: ${objTitle}`, objLink)
          alert("Объект обновлен!")
        } else {
          await addDoc(collection(db, collectionName), dataToSave)
          if (activeTab === "resonators")
            await addUpdateLog("Добавлено", `гайд на ${objTitle}`, objLink)
          if (activeTab === "mechanics")
            await addUpdateLog("Добавлено", `механика: ${objTitle}`, objLink)
          if (activeTab === "weapons")
            await addUpdateLog("Добавлено", `оружие: ${objTitle}`, objLink)
          if (activeTab === "echoSets")
            await addUpdateLog("Добавлено", `эхо сет: ${objTitle}`, objLink)
          if (activeTab === "tierlist")
            await addUpdateLog("Добавлено", `тир-лист: ${objTitle}`, objLink)
          alert("Объект добавлен!")
        }
      }
      resetForms()
      fetchData()
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка при сохранении. Проверьте консоль.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id || null)
    if (activeTab === "resonators") {
      const convertedTeams = convertOldTeamsToNew(item.teams || [])
      setResonatorForm({
        name: item.name || "",
        engName: item.engName || "",
        element: item.element || "Havoc",
        rarity: item.rarity || 5,
        weaponType: item.weaponType || "Sword",
        resonatorImg: item.resonatorImg || "",
        resonatorImgMini: item.resonatorImgMini || "",
        resonatorImgBanner: item.resonatorImgBanner || "",
        resonatorPreview: item.resonatorPreview || "",
        resonatorImgGuide: item.resonatorImgGuide || "",
        resonatorYTLink: item.resonatorYTLink || "",
        teams: convertedTeams,
        descr: item.descr?.length ? item.descr : [],
        result: item.result?.length ? item.result : [],
        resonatorImgDetails: item.resonatorImgDetails || "",
        echoSets: item.echoSets || [],
      })
    } else if (activeTab === "weapons") {
      setWeaponForm({
        name: item.name || "",
        engName: item.engName || "",
        type: item.type || "Sword",
        rarity: item.rarity || 5,
        img: item.img || "",
        description: item.description || [],
      })
    } else if (activeTab === "mechanics") {
      setMechanicForm({
        title: item.title || "",
        engName: item.engName || "",
        img: item.img || "",
        paragraphs: item.paragraphs || [],
      })
    } else if (activeTab === "echoSets") {
      setEchoSetForm({
        name: item.name || "",
        engName: item.engName || "",
        img: item.img || "",
        twoPartsDescr: item.twoPartsDescr || [],
        fivePartsDescr: item.fivePartsDescr || [],
        threePartsDescr: item.threePartsDescr || [],
        important: item.important || [],
        patchNumber: item.patchNumber || "",
        index: item.index || 0,
      })
    } else if (activeTab === "tierlist") {
      setTierListForm({
        name: item.name || "",
        nameImg: item.nameImg || "",
        rows: item.rows?.map((r: TierListRow) => ({
          ...r,
          resonatorSettings: r.resonatorSettings || {},
        })) || [
          {
            id: crypto.randomUUID(),
            rating: "S",
            ratingImg: "",
            dpsResonatorIds: [],
            hybridResonatorIds: [],
            supportResonatorIds: [],
          },
        ],
      })
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Вы уверены?")) return
    let collectionName = ""
    if (activeTab === "resonators") collectionName = RESONATORS_COLLECTION
    else if (activeTab === "weapons") collectionName = WEAPONS_COLLECTION
    else if (activeTab === "mechanics") collectionName = MECHANICS_COLLECTION
    else if (activeTab === "echoSets") collectionName = ECHO_SETS_COLLECTION
    else if (activeTab === "tierlist") collectionName = TIER_LISTS_COLLECTION
    try {
      await deleteDoc(doc(db, collectionName, id))
      fetchData()
    } catch (error) {
      console.error("Ошибка удаления:", error)
    }
  }

  const handleAddResonatorToBanner = (resonatorId: string) => {
    if (!settingsForm.futureResonatorIds.includes(resonatorId)) {
      setSettingsForm(prev => ({
        ...prev,
        futureResonatorIds: [...prev.futureResonatorIds, resonatorId],
      }))
    }
  }
  const handleRemoveResonatorFromBanner = (resonatorId: string) => {
    setSettingsForm(prev => ({
      ...prev,
      futureResonatorIds: prev.futureResonatorIds.filter(
        id => id !== resonatorId,
      ),
    }))
  }

  const resetForms = () => {
    setResonatorForm({
      name: "",
      engName: "",
      element: "Havoc",
      rarity: 5,
      weaponType: "Sword",
      resonatorImg: "",
      resonatorImgMini: "",
      resonatorImgBanner: "",
      resonatorPreview: "",
      resonatorImgGuide: "",
      resonatorYTLink: "",
      teams: [],
      descr: [],
      result: [],
      resonatorImgDetails: "",
      echoSets: [],
    })
    setWeaponForm({
      name: "",
      engName: "",
      type: "Sword",
      rarity: 5,
      img: "",
      description: [],
    })
    setMechanicForm({ title: "", engName: "", img: "", paragraphs: [] })
    setEchoSetForm({
      name: "",
      img: "",
      engName: "",
      twoPartsDescr: [],
      fivePartsDescr: [],
      threePartsDescr: [],
      important: [],
      patchNumber: "",
      index: 0,
    })
    setTierListForm({
      name: "",
      nameImg: "",
      rows: [
        {
          id: crypto.randomUUID(),
          rating: "S",
          ratingImg: "",
          dpsResonatorIds: [],
          hybridResonatorIds: [],
          supportResonatorIds: [],
        },
      ],
    })
    setSettingsForm({
      nextBannerDate: "",
      futureResonatorIds: [],
      preview_img: "",
      filter_img: "",
      tierListDescriptions: [],
    })
    setEditingId(null)
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    resetForms()
    setSearchTerm("")
  }

  const filteredList = useMemo(() => {
    let list: any[] = []
    if (activeTab === "resonators") list = resonators
    else if (activeTab === "weapons") list = weapons
    else if (activeTab === "mechanics") list = mechanics
    else if (activeTab === "echoSets") list = echoSets
    else if (activeTab === "tierlist") list = tierLists
    if (!searchTerm) return list
    const lowerTerm = searchTerm.toLowerCase()
    return list.filter(
      item =>
        (item.name && item.name.toLowerCase().includes(lowerTerm)) ||
        (item.engName && item.engName.toLowerCase().includes(lowerTerm)) ||
        (item.title && item.title.toLowerCase().includes(lowerTerm)),
    )
  }, [
    activeTab,
    resonators,
    weapons,
    mechanics,
    echoSets,
    tierLists,
    searchTerm,
  ])

  if (authLoading || !isDbReady) return <Loader width="100px" height="100px" />
  if (!isAuthenticated)
    return (
      <AuthScreen
        inputKey={inputKey}
        setInputKey={setInputKey}
        handleLogin={handleLogin}
        authError={authError}
        authLoading={false}
      />
    )

  return (
    <section className="admin">
      <div className="admin-header">
        <h1>{isAdmin ? "Админ" : "Модератор"} панель</h1>
        <button onClick={handleLogout} className="btn-logout">
          Выйти
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "resonators" ? "active" : ""}`}
          onClick={() => handleTabChange("resonators")}
        >
          Персонажи
        </button>
        {isAdmin && (
          <>
            <button
              className={`tab-btn ${activeTab === "weapons" ? "active" : ""}`}
              onClick={() => handleTabChange("weapons")}
            >
              Оружие
            </button>
            <button
              className={`tab-btn ${activeTab === "mechanics" ? "active" : ""}`}
              onClick={() => handleTabChange("mechanics")}
            >
              Механики
            </button>
            <button
              className={`tab-btn ${activeTab === "echoSets" ? "active" : ""}`}
              onClick={() => handleTabChange("echoSets")}
            >
              Эхо Сеты
            </button>
            <button
              className={`tab-btn ${activeTab === "tierlist" ? "active" : ""}`}
              onClick={() => handleTabChange("tierlist")}
            >
              Тир-лист
            </button>
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              Настройки
            </button>
          </>
        )}
      </div>

      <div className="admin-content">
        <div className="admin-form-container">
          <h2>
            {editingId
              ? "Редактировать"
              : activeTab === "settings"
                ? "Сохранить"
                : "Добавить"}{" "}
            {activeTab === "settings"
              ? "настройки"
              : activeTab === "mechanics"
                ? `механику: ${mechanicForm.title}`
                : activeTab === "weapons"
                  ? `оружие: ${weaponForm.name}`
                  : activeTab === "echoSets"
                    ? "эхо сет"
                    : activeTab === "tierlist"
                      ? `тир-лист: ${tierListForm.name}`
                      : `персонажа: ${resonatorForm.name}`}
          </h2>

          <form onSubmit={handleSubmit} className="admin-form">
            {activeTab === "resonators" && (
              <>
                {isAdmin && (
                  <>
                    <div className="form-row">
                      <InputGroup
                        label="Имя (RU)"
                        name="name"
                        value={resonatorForm.name || ""}
                        onChange={handleResonatorChange}
                        required
                      />
                      <InputGroup
                        label="Имя (ENG)"
                        name="engName"
                        value={resonatorForm.engName || ""}
                        onChange={handleResonatorChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <SelectGroup
                        label="Элемент"
                        name="element"
                        value={resonatorForm.element || "Havoc"}
                        onChange={handleResonatorChange}
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
                        value={resonatorForm.rarity || 5}
                        onChange={handleResonatorChange}
                        options={[5, 4]}
                        type="number"
                      />
                      <SelectGroup
                        label="Оружие"
                        name="weaponType"
                        value={resonatorForm.weaponType || "Sword"}
                        onChange={handleResonatorChange}
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
                      value={resonatorForm.resonatorImg || ""}
                      onChange={handleResonatorChange}
                      placeholder="https://..."
                    />
                    <InputGroup
                      label="URL мини картинки (на карточках)"
                      name="resonatorImgMini"
                      value={resonatorForm.resonatorImgMini || ""}
                      onChange={handleResonatorChange}
                      placeholder="https://..."
                    />
                    <InputGroup
                      label="URL фото карточки персонажа для баннера"
                      name="resonatorImgBanner"
                      value={resonatorForm.resonatorImgBanner || ""}
                      onChange={handleResonatorChange}
                      placeholder="https://..."
                    />
                    <InputGroup
                      label="URL Превью ютуб ролика"
                      name="resonatorPreview"
                      value={resonatorForm.resonatorPreview || ""}
                      onChange={handleResonatorChange}
                      placeholder="https://..."
                    />
                    <InputGroup
                      label="URL ютуб ролика"
                      name="resonatorYTLink"
                      value={resonatorForm.resonatorYTLink || ""}
                      onChange={handleResonatorChange}
                      placeholder="https://..."
                    />
                    <InputGroup
                      label="URL гайда"
                      name="resonatorImgGuide"
                      value={resonatorForm.resonatorImgGuide || ""}
                      onChange={handleResonatorChange}
                      placeholder="https://..."
                    />
                  </>
                )}
                <InputGroup
                  label="URL Детального подсчета"
                  name="resonatorImgDetails"
                  value={resonatorForm.resonatorImgDetails || ""}
                  onChange={handleResonatorChange}
                  placeholder="https://..."
                />
                <ArrayEditor
                  title="Описание персонажа (под большой картинкой)"
                  items={resonatorForm.descr || []}
                  setItems={newDescr =>
                    setResonatorForm(prev => ({
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
                  items={resonatorForm.result || []}
                  setItems={newResult =>
                    setResonatorForm(prev => ({
                      ...prev,
                      result:
                        typeof newResult === "function"
                          ? newResult(prev.result || [])
                          : newResult,
                    }))
                  }
                  placeholder="Перс заебись"
                />
                <TeamEditor
                  teams={resonatorForm.teams || []}
                  setTeams={newTeams =>
                    setResonatorForm(prev => ({
                      ...prev,
                      teams:
                        typeof newTeams === "function"
                          ? newTeams(prev.teams || [])
                          : newTeams,
                    }))
                  }
                  allResonators={resonators}
                  allEchoSets={echoSets}
                />
                <EchoSetSelector
                  selections={resonatorForm.echoSets || []}
                  setSelections={newSelections =>
                    setResonatorForm(prev => ({
                      ...prev,
                      echoSets:
                        typeof newSelections === "function"
                          ? newSelections(prev.echoSets || [])
                          : newSelections,
                    }))
                  }
                  allEchoSets={echoSets}
                />
              </>
            )}

            {activeTab === "weapons" && (
              <>
                <div className="form-row">
                  <InputGroup
                    label="Имя (RU)"
                    name="name"
                    value={weaponForm.name || ""}
                    onChange={handleWeaponChange}
                    required
                  />
                  <InputGroup
                    label="Имя (ENG)"
                    name="engName"
                    value={weaponForm.engName || ""}
                    onChange={handleWeaponChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <SelectGroup
                    label="Тип"
                    name="type"
                    value={weaponForm.type || "Sword"}
                    onChange={handleWeaponChange}
                    options={[
                      "Sword",
                      "Broadblade",
                      "Gauntlets",
                      "Pistols",
                      "Rectifier",
                    ]}
                  />
                  <SelectGroup
                    label="Редкость"
                    name="rarity"
                    value={weaponForm.rarity || 5}
                    onChange={handleWeaponChange}
                    options={[5, 4]}
                    type="number"
                  />
                </div>
                <InputGroup
                  label="URL Картинки"
                  name="img"
                  value={weaponForm.img || ""}
                  onChange={handleWeaponChange}
                  placeholder="https://..."
                />
                <ArrayEditor
                  title="Описание пассивки"
                  items={weaponForm.description || []}
                  setItems={newDescription =>
                    setWeaponForm(prev => ({
                      ...prev,
                      description:
                        typeof newDescription === "function"
                          ? newDescription(prev.description || [])
                          : newDescription,
                    }))
                  }
                  placeholder="Описание пассивки абзац"
                />
              </>
            )}

            {activeTab === "mechanics" && (
              <>
                <InputGroup
                  label="Название механики (RU)"
                  name="title"
                  value={mechanicForm.title || ""}
                  onChange={handleMechanicChange}
                  required
                />
                <InputGroup
                  label="Название механики (ENG)"
                  name="engName"
                  value={mechanicForm.engName || ""}
                  onChange={handleMechanicChange}
                  required
                />
                <InputGroup
                  label="URL Иконки"
                  name="img"
                  value={mechanicForm.img || ""}
                  onChange={handleMechanicChange}
                  placeholder="https://..."
                />
                <ArrayEditor
                  title="Описание (Абзацы)"
                  items={mechanicForm.paragraphs || []}
                  setItems={newParagraphs =>
                    setMechanicForm(prev => ({
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
            )}

            {activeTab === "echoSets" && (
              <>
                <InputGroup
                  label="Название сета (RU)"
                  name="name"
                  value={echoSetForm.name || ""}
                  onChange={handleEchoSetChange}
                  required
                />
                <InputGroup
                  label="Название сета (ENG)"
                  name="engName"
                  value={echoSetForm.engName || ""}
                  onChange={handleEchoSetChange}
                  required
                />
                <InputGroup
                  label="URL Иконки сета"
                  name="img"
                  value={echoSetForm.img || ""}
                  onChange={handleEchoSetChange}
                  placeholder="https://..."
                />
                <InputGroup
                  label="Номер патча, когда добавили сет"
                  name="patchNumber"
                  value={echoSetForm.patchNumber || ""}
                  onChange={handleEchoSetChange}
                />
                <InputGroup
                  label="Номер по списку отображения"
                  name="index"
                  value={echoSetForm.index || 0}
                  onChange={handleEchoSetChange}
                />
                <ArrayEditor
                  title="Описание сета 2 части"
                  items={echoSetForm.twoPartsDescr || []}
                  setItems={newDescription =>
                    setEchoSetForm(prev => ({
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
                  items={echoSetForm.fivePartsDescr || []}
                  setItems={newDescription =>
                    setEchoSetForm(prev => ({
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
                  items={echoSetForm.threePartsDescr || []}
                  setItems={newDescription =>
                    setEchoSetForm(prev => ({
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
                  items={echoSetForm.important || []}
                  setItems={newDescription =>
                    setEchoSetForm(prev => ({
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
            )}

            {activeTab === "tierlist" && (
              <>
                <div className="form-row">
                  <InputGroup
                    label="Название тир-листа (RU)"
                    name="name"
                    value={tierListForm.name}
                    onChange={(e: { target: { value: any } }) =>
                      setTierListForm(prev => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                  <InputGroup
                    label="Ссылка на картинку тир листа"
                    name="nameImg"
                    value={tierListForm.nameImg}
                    onChange={(e: { target: { value: any } }) =>
                      setTierListForm(prev => ({
                        ...prev,
                        nameImg: e.target.value,
                      }))
                    }
                  />
                </div>
                <TierListEditor
                  rows={tierListForm.rows}
                  setRows={newRows =>
                    setTierListForm(prev => ({
                      ...prev,
                      rows:
                        typeof newRows === "function"
                          ? newRows(prev.rows)
                          : newRows,
                    }))
                  }
                  allResonators={resonators}
                  availableTags={Array.from(globalTagRegistry.values())}
                  onTagRegistered={registerTag}
                  onMoveRow={moveTierListRow}
                  canMoveUp={(index: number) => index > 0}
                  canMoveDown={(index: number) =>
                    index < tierListForm.rows.length - 1
                  }
                />
              </>
            )}

            {activeTab === "settings" && (
              <div className="settings-container">
                {settingsError && (
                  <div className="settings-error-banner">
                    ⚠️ {settingsError}
                    <button
                      type="button"
                      onClick={refreshSettings}
                      className="btn-retry"
                    >
                      Повторить
                    </button>
                  </div>
                )}
                <div className="form-group">
                  <label>Дата следующего баннера</label>
                  <input
                    type="datetime-local"
                    name="nextBannerDate"
                    value={
                      settingsForm.nextBannerDate
                        ? new Date(settingsForm.nextBannerDate)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={e =>
                      setSettingsForm(prev => ({
                        ...prev,
                        nextBannerDate: new Date(e.target.value).toISOString(),
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Персонажи на будущем баннере</label>
                  <div className="resonator-selector">
                    <select
                      onChange={e => {
                        if (e.target.value)
                          handleAddResonatorToBanner(e.target.value)
                        e.target.value = ""
                      }}
                      className="resonator-select"
                      disabled={resonators.length === 0}
                    >
                      <option value="">
                        {resonators.length !== 0 && "Выберите персонажа..."}
                      </option>
                      {resonators.map(r => (
                        <option
                          key={r.id}
                          value={r.id}
                          disabled={settingsForm.futureResonatorIds.includes(
                            r.id || "",
                          )}
                        >
                          {r.name} ({r.engName})
                        </option>
                      ))}
                    </select>
                  </div>
                  {resonators.length === 0 && (
                    <p className="hint">⏳ Персонажи загружаются...</p>
                  )}
                  <ul className="selected-resonators">
                    {settingsForm.futureResonatorIds.map(id => {
                      const res = resonators.find(r => r.id === id)
                      return (
                        res && (
                          <li key={id} className="selected-resonator-item">
                            <img
                              src={res.resonatorImg}
                              alt={res.name}
                              className="resonator-thumb"
                              onError={e => {
                                ;(e.target as HTMLImageElement).src =
                                  "/placeholder.png"
                              }}
                            />
                            <span>{res.name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveResonatorFromBanner(id)
                              }
                              className="btn-remove-resonator"
                            >
                              ×
                            </button>
                          </li>
                        )
                      )
                    })}
                  </ul>
                </div>
                <InputGroup
                  label="Ссылка на Preview Image (Баннер)"
                  name="preview_img"
                  value={settingsForm.preview_img || ""}
                  onChange={handleSettingsChange}
                  placeholder="https://..."
                />
                <InputGroup
                  label="Ссылка на Filter Image (Фильтр)"
                  name="filter_img"
                  value={settingsForm.filter_img || ""}
                  onChange={handleSettingsChange}
                  placeholder="https://..."
                />
                <div className="form-group">
                  <label>Глобальные описания для тир-листов</label>
                  {settingsForm.tierListDescriptions.map(desc => (
                    <DescriptionEditor
                      key={desc.id}
                      title={desc.title}
                      content={desc.content}
                      onTitleChange={newTitle =>
                        setSettingsForm(prev => ({
                          ...prev,
                          tierListDescriptions: prev.tierListDescriptions.map(
                            d =>
                              d.id === desc.id ? { ...d, title: newTitle } : d,
                          ),
                        }))
                      }
                      onContentChange={newContent =>
                        setSettingsForm(prev => ({
                          ...prev,
                          tierListDescriptions: prev.tierListDescriptions.map(
                            d =>
                              d.id === desc.id
                                ? { ...d, content: newContent }
                                : d,
                          ),
                        }))
                      }
                      onRemove={() =>
                        setSettingsForm(prev => ({
                          ...prev,
                          tierListDescriptions:
                            prev.tierListDescriptions.filter(
                              d => d.id !== desc.id,
                            ),
                        }))
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm(prev => ({
                        ...prev,
                        tierListDescriptions: [
                          ...prev.tierListDescriptions,
                          { id: crypto.randomUUID(), title: "", content: "" },
                        ],
                      }))
                    }
                    className="btn-add-description"
                  >
                    + Добавить описание
                  </button>
                  <p className="hint">
                    Эти описания будут отображаться на <strong>всех</strong>{" "}
                    страницах тир-листов.
                  </p>
                </div>
                <div className="settings-actions">
                  <button
                    type="button"
                    onClick={refreshSettings}
                    className="btn-refresh-settings"
                    disabled={loading}
                  >
                    🔄 Обновить настройки
                  </button>
                  {loading && (
                    <span className="loading-indicator">Загрузка...</span>
                  )}
                </div>
              </div>
            )}

            <div className="form-actions">
              {isAdmin && (
                <>
                  <button type="submit" disabled={isSubmitting || loading}>
                    {isSubmitting
                      ? "Сохранение..."
                      : loading && activeTab === "settings"
                        ? "Загрузка..."
                        : editingId && activeTab !== "settings"
                          ? "Обновить"
                          : "Сохранить"}
                  </button>
                  {editingId && activeTab !== "settings" && (
                    <button
                      type="button"
                      onClick={resetForms}
                      className="btn-cancel"
                      disabled={isSubmitting}
                    >
                      Отмена
                    </button>
                  )}
                </>
              )}
              {isModerator && (
                <>
                  {editingId && activeTab !== "settings" && (
                    <>
                      <button type="submit" disabled={isSubmitting || loading}>
                        {isSubmitting ? "Сохранение..." : "Обновить"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForms}
                        className="btn-cancel"
                        disabled={isSubmitting}
                      >
                        Отмена
                      </button>
                    </>
                  )}
                  {!editingId && activeTab !== "settings" && (
                    <p className="moderator-hint">
                      Выберите персонажа из списка для редактирования.
                    </p>
                  )}
                </>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-container">
          <h2>
            Список:{" "}
            {activeTab === "resonators"
              ? "Персонажи"
              : activeTab === "weapons"
                ? "Оружие"
                : activeTab === "mechanics"
                  ? "Механики"
                  : activeTab === "echoSets"
                    ? "Эхо Сеты"
                    : activeTab === "tierlist"
                      ? "Тир-листы"
                      : "Настройки"}
          </h2>
          {activeTab !== "settings" && activeTab !== "tierlist" && (
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
            </div>
          )}
          {activeTab === "settings" ? (
            <div className="settings-info">
              <p>
                Глобальные настройки сайта. Изменения применяются ко всем
                пользователям.
              </p>
              {settingsError && (
                <p className="error-text">
                  ⚠️ {settingsError}. Попробуйте обновить страницу.
                </p>
              )}
            </div>
          ) : activeTab === "tierlist" ? (
            <ul className="admin-list">
              {filteredList.length > 0 ? (
                filteredList.map((item: TierList) => (
                  <li key={item.id} className="admin-list-item">
                    <div className="admin-info">
                      <strong>{item.name}</strong>
                      <span className="admin-meta">
                        {item.rows.length} ряд(ов)
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : loading ? (
                <li className="admin-list-empty">Загрузка...</li>
              ) : (
                <li className="admin-list-empty">Ничего не найдено</li>
              )}
            </ul>
          ) : (
            <ul className="admin-list">
              {filteredList.length > 0 ? (
                filteredList.map((item: any) => (
                  <li key={item.id} className="admin-list-item">
                    <img
                      src={item.resonatorImg || item.img}
                      alt={item.name || item.title}
                      className="admin-thumb"
                      onError={e => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.png"
                      }}
                    />
                    <div className="admin-info">
                      <strong>{item.name || item.title}</strong>
                      {item.engName && (
                        <span className="eng-name">({item.engName})</span>
                      )}
                      <span className="admin-meta">
                        {item.element ||
                          item.type ||
                          (activeTab === "echoSets" ? "Сет" : "Механика")}
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : loading ? (
                <li className="admin-list-empty">Загрузка...</li>
              ) : (
                <li className="admin-list-empty">Ничего не найдено</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

const InputGroup = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: any) => (
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

const SelectGroup = ({
  label,
  name,
  value,
  onChange,
  options,
  type = "string",
}: any) => (
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

const AuthScreen = ({
  inputKey,
  setInputKey,
  handleLogin,
  authError,
  authLoading,
}: any) => (
  <section className="admin-auth-screen">
    <div className="admin-auth-box">
      <h2>Доступ ограничен</h2>
      <form onSubmit={handleLogin} className="admin-key-form">
        <input
          type="password"
          placeholder="Ключ..."
          value={inputKey}
          onChange={(e: any) => setInputKey(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={authLoading}>
          {authLoading ? "..." : "Войти"}
        </button>
      </form>
      {authError && <p className="admin-error-msg">{authError}</p>}
    </div>
  </section>
)

const addUpdateLog = async (
  type: "Добавлено" | "Изменено",
  title: string,
  link: string,
) => {
  try {
    await addDoc(collection(db, "updates"), {
      type,
      title,
      link,
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Ошибка при создании лога обновления:", error)
  }
}
