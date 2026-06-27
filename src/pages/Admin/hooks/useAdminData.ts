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
import type { Resonator } from "../../../types/resonator"
import type { Weapon } from "../../../types/weapon"
import type { Mechanic } from "../../../types/mechanic"
import type { EchoSet } from "../../../types/echoSet"
import { useAuth } from "@contexts/AuthContext"
import type {
  TierList,
  TierListCycle,
  TierListRow,
  TierListTag,
} from "../../../types/TierList"
import { db } from "../../../firebase/config"
import type { SiteSettings } from "../../../types/siteSettings"
import { convertOldTeamsToNew } from "../../../supp/ConvertOldTeamsToNew"
import type { Role, RolePermissions, TabKey } from "../../../types/roles"

const RESONATORS_COLLECTION = "resonators"
const WEAPONS_COLLECTION = "weapons"
const MECHANICS_COLLECTION = "mechanics"
const ECHO_SETS_COLLECTION = "echo_sets"
const SETTINGS_COLLECTION = "settings"
const SETTINGS_DOC_ID = "site_settings"
const TIER_LISTS_COLLECTION = "tier_lists"

export type Tab =
  | "resonators"
  | "weapons"
  | "mechanics"
  | "echoSets"
  | "settings"
  | "tierlist"

export interface SettingsDescription {
  id: string
  title: string
  content: string
}

export interface SettingsForm {
  nextBannerDate: string
  futureResonatorIds: string[]
  preview_img: string
  filter_img: string
  tierListDescriptions: SettingsDescription[]
}

export interface ResonatorForm extends Partial<Resonator> {}
export interface WeaponForm extends Partial<Weapon> {}
export interface MechanicForm extends Partial<Mechanic> {}
export interface EchoSetForm extends Partial<EchoSet> {}

const ROLES_COLLECTION = "roles"

export const useAdminData = () => {
  const {
    userRole,
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
  } = useAuth()

  const [inputUsername, setInputUsername] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const [authError, setAuthError] = useState("")

  const isAdmin = userRole === "admin" && isAuthenticated
  const isModerator = userRole === "moderator" && isAuthenticated
  const isTiermake = userRole === "tiermake" && isAuthenticated

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
    stat1: "",
    stat2: "",
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
    onePartsDescr: [],
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
    cycles: TierListCycle[]
  }>({
    name: "",
    nameImg: "",
    cycles: [
      {
        id: crypto.randomUUID(),
        name: "1",
        cycleNumber: 1,
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
      },
    ],
  })

  const [activeCycleIndex, setActiveCycleIndex] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)

  const addUpdateLog = useCallback(
    async (
      type: "Добавлено" | "Изменено" | "Удалено",
      title: string,
      link: string,
    ) => {
      try {
        await addDoc(collection(db, "updates"), {
          type,
          title,
          link,
          userRole: userRole || "unknown",
          date: new Date().toISOString(),
          createdAt: serverTimestamp(),
        })
      } catch (error) {
        console.error("Ошибка при создании лога обновления:", error)
      }
    },
    [userRole],
  )

  const extractGlobalTags = useCallback(
    (lists: TierList[]): Map<string, TierListTag> => {
      const tagMap = new Map<string, TierListTag>()
      lists.forEach(list => {
        list.cycles?.forEach(cycle => {
          cycle.rows?.forEach(row => {
            Object.values(row.resonatorSettings || {}).forEach(
              (settings: any) => {
                settings?.tags?.forEach((tag: TierListTag) => {
                  if (!tagMap.has(tag.id)) tagMap.set(tag.id, { ...tag })
                })
              },
            )
          })
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
        const newCycles = [...prev.cycles]
        const currentCycle = { ...newCycles[activeCycleIndex] }
        const newRows = [...currentCycle.rows]
        const targetIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1
        if (targetIndex < 0 || targetIndex >= newRows.length) return prev
        ;[newRows[rowIndex], newRows[targetIndex]] = [
          newRows[targetIndex],
          newRows[rowIndex],
        ]
        currentCycle.rows = newRows
        newCycles[activeCycleIndex] = currentCycle
        return { ...prev, cycles: newCycles }
      })
    },
    [activeCycleIndex],
  )

  const addCycle = () => {
    setTierListForm(prev => ({
      ...prev,
      cycles: [
        ...prev.cycles,
        {
          id: crypto.randomUUID(),
          name: `${prev.cycles.length + 1}`,
          cycleNumber: prev.cycles.length + 1,
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
        },
      ],
    }))
  }

  const removeCycle = (cycleIndex: number) => {
    if (tierListForm.cycles.length <= 1) {
      alert("Нельзя удалить последний цикл")
      return
    }
    if (!window.confirm("Вы уверены, что хотите удалить этот цикл?")) return

    setTierListForm(prev => ({
      ...prev,
      cycles: prev.cycles.filter((_, idx) => idx !== cycleIndex),
    }))

    if (activeCycleIndex >= cycleIndex && activeCycleIndex > 0) {
      setActiveCycleIndex(activeCycleIndex - 1)
    }
  }

  const updateCycleName = (cycleIndex: number, name: string) => {
    setTierListForm(prev => ({
      ...prev,
      cycles: prev.cycles.map((cycle, idx) =>
        idx === cycleIndex ? { ...cycle, name } : cycle,
      ),
    }))
  }

  const switchCycle = (cycleIndex: number) => {
    setActiveCycleIndex(cycleIndex)
  }

  const updateCurrentCycleRows = (
    newRows: TierListRow[] | ((prev: TierListRow[]) => TierListRow[]),
  ) => {
    setTierListForm(prev => {
      const currentRows = prev.cycles[activeCycleIndex]?.rows || []
      const updatedRows =
        typeof newRows === "function" ? newRows(currentRows) : newRows
      return {
        ...prev,
        cycles: prev.cycles.map((cycle, idx) =>
          idx === activeCycleIndex ? { ...cycle, rows: updatedRows } : cycle,
        ),
      }
    })
  }

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

    if (!inputUsername.trim() || !inputPassword.trim()) {
      setAuthError("Введите имя и пароль")
      return
    }

    const success = await login(inputUsername, inputPassword)

    if (success) {
      setInputUsername("")
      setInputPassword("")
      setTimeout(() => fetchData(), 100)
    } else {
      setAuthError("Неверное имя пользователя или пароль")
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setMechanicForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEchoSetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setEchoSetForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
        objLink = ""

      if (activeTab === "settings") {
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
          // 👇 Кто последний менял настройки
          lastModifiedBy: userRole || "unknown",
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
            // 👇 Кто последний редактировал
            lastModifiedBy: userRole || "unknown",
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        } else if (activeTab === "weapons") {
          collectionName = WEAPONS_COLLECTION
          objTitle = weaponForm.engName || ""
          objLink = `/weapons/${encodeURIComponent(weaponForm.engName || "")}`
          dataToSave = {
            ...weaponForm,
            updatedAt: serverTimestamp(),
            lastModifiedBy: userRole || "unknown",
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
            lastModifiedBy: userRole || "unknown",
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
            lastModifiedBy: userRole || "unknown",
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        } else if (activeTab === "tierlist") {
          collectionName = TIER_LISTS_COLLECTION
          objTitle = tierListForm.name || ""
          objLink = `/tierlists/${tierListForm.name}`

          const allTagsMap = new Map<string, TierListTag>()
          tierListForm.cycles.forEach(cycle => {
            cycle.rows.forEach(row => {
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
          })

          dataToSave = {
            name: tierListForm.name,
            nameImg: tierListForm.nameImg,
            cycles: tierListForm.cycles,
            usedTags: Array.from(allTagsMap.values()),
            updatedAt: serverTimestamp(),
            lastModifiedBy: userRole || "unknown",
            ...(editingId ? {} : { createdAt: serverTimestamp() }),
          }
        }

        if (editingId) {
          const docRef = doc(db, collectionName, editingId)
          await updateDoc(docRef, dataToSave)

          // 👇 Логируем с userRole
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

          // 👇 Логируем с userRole
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
        stat1: item.stat1 || "",
        stat2: item.stat2 || "",
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
        onePartsDescr: item.onePartsDescr || [],
        twoPartsDescr: item.twoPartsDescr || [],
        fivePartsDescr: item.fivePartsDescr || [],
        threePartsDescr: item.threePartsDescr || [],
        important: item.important || [],
        patchNumber: item.patchNumber || "",
        index: item.index || 0,
      })
    } else if (activeTab === "tierlist") {
      let cycles = item.cycles || []
      if (cycles.length === 0 && item.rows) {
        cycles = [
          {
            id: crypto.randomUUID(),
            name: item.name || "1",
            cycleNumber: 1,
            rows: item.rows,
          },
        ]
      }

      setTierListForm({
        name: item.name || "",
        nameImg: item.nameImg || "",
        cycles: cycles.map((c: TierListCycle) => ({
          ...c,
          rows: c.rows?.map((r: TierListRow) => ({
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
        })),
      })
      setActiveCycleIndex(0)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 👇 handleDelete теперь тоже логирует с userRole
  const handleDelete = async (id: string) => {
    if (!window.confirm("Вы уверены?")) return
    let collectionName = ""
    let objTitle = ""
    let objLink = ""

    if (activeTab === "resonators") {
      collectionName = RESONATORS_COLLECTION
      const item = resonators.find(r => r.id === id)
      objTitle = item?.name || ""
      objLink = `/resonator/${item?.engName || ""}`
    } else if (activeTab === "weapons") {
      collectionName = WEAPONS_COLLECTION
      const item = weapons.find(w => w.id === id)
      objTitle = item?.name || ""
      objLink = `/weapons/${encodeURIComponent(item?.engName || "")}`
    } else if (activeTab === "mechanics") {
      collectionName = MECHANICS_COLLECTION
      const item = mechanics.find(m => m.id === id)
      objTitle = item?.title || ""
      objLink = `/mechanics/${item?.engName?.toLowerCase().replace(/\s+/g, "-") || ""}`
    } else if (activeTab === "echoSets") {
      collectionName = ECHO_SETS_COLLECTION
      const item = echoSets.find(e => e.id === id)
      objTitle = item?.name || ""
      objLink = `/echoSets/${item?.engName?.toLowerCase().replace(/\s+/g, "-") || ""}`
    } else if (activeTab === "tierlist") {
      collectionName = TIER_LISTS_COLLECTION
      const item = tierLists.find(t => t.id === id)
      objTitle = item?.name || ""
      objLink = `/tierlists/${item?.name || ""}`
    }

    try {
      await deleteDoc(doc(db, collectionName, id))
      await addUpdateLog("Удалено", objTitle, objLink)
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
      stat1: "",
      stat2: "",
    })
    setMechanicForm({ title: "", engName: "", img: "", paragraphs: [] })
    setEchoSetForm({
      name: "",
      img: "",
      engName: "",
      onePartsDescr: [],
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
      cycles: [
        {
          id: crypto.randomUUID(),
          name: "1",
          cycleNumber: 1,
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
        },
      ],
    })
    setActiveCycleIndex(0)
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

  ////////////////////////////////////////////////////////////
  // фича с ролями
  ///////////////////////////////////////////////////////////
  const getDefaultFields = () => ({
    resonators: {
      name: false,
      engName: false,
      element: false,
      rarity: false,
      weaponType: false,
      resonatorImg: false,
      resonatorImgMini: false,
      resonatorImgBanner: false,
      resonatorPreview: false,
      resonatorYTLink: false,
      resonatorImgGuide: false,
      resonatorImgDetails: false,
      descr: false,
      result: false,
      teams: false,
      echoSets: false,
    },
    echoSets: {
      name: false,
      engName: false,
      img: false,
      patchNumber: false,
      index: false,
      onePartsDescr: false,
      twoPartsDescr: false,
      fivePartsDescr: false,
      threePartsDescr: false,
      important: false,
    },
    weapons: {
      name: false,
      engName: false,
      type: false,
      rarity: false,
      stat1: false,
      stat2: false,
      img: false,
      description: false,
    },
    mechanics: { title: false, engName: false, img: false, paragraphs: false },
    tierlist: { name: false, nameImg: false, cycles: false, rows: false },
    settings: {
      nextBannerDate: false,
      futureResonatorIds: false,
      preview_img: false,
      filter_img: false,
      tierListDescriptions: false,
    },
  })

  const [roles, setRoles] = useState<Role[]>([])
  const [editingRoleId] = useState<string | null>(null)
  const [roleForm, setRoleForm] = useState<Partial<Role>>({
    name: "",
    password: "",
    description: "",
    permissions: {
      tabs: {
        resonators: false,
        weapons: false,
        mechanics: false,
        echoSets: false,
        tierlist: false,
        settings: false,
      },
      fields: getDefaultFields(),
    },
  })

  const fetchRoles = useCallback(async () => {
    try {
      const q = query(collection(db, ROLES_COLLECTION), orderBy("name"))
      const snap = await getDocs(q)
      setRoles(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Role[])
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && isDbReady) {
      fetchData()
      fetchRoles()
    }
  }, [isAuthenticated, isDbReady, fetchData, fetchRoles])

  // Helper: Get current user's role object
  const currentUserRole = useMemo(() => {
    if (!userRole) return null
    return roles.find(r => r.id === userRole || r.name === userRole) || null
  }, [userRole, roles])

  const isSuperAdmin = currentUserRole?.isSuperAdmin === true

  // Helper: Check Tab Permission
  const hasTabPermission = useCallback(
    (tab: TabKey) => {
      if (!isAuthenticated) return false
      if (isSuperAdmin) return true

      const perms = currentUserRole?.permissions.tabs
      return perms ? perms[tab] : false
    },
    [isAuthenticated, isSuperAdmin, currentUserRole?.permissions.tabs],
  )

  // Helper: Check Field Permission
  const hasFieldPermission = useCallback(
    <T extends keyof RolePermissions["fields"]>(
      formType: T,
      field: keyof RolePermissions["fields"][T],
    ): boolean => {
      if (!isAuthenticated) return false
      if (isSuperAdmin) return true

      const fieldPerms = currentUserRole?.permissions?.fields?.[formType]
      return fieldPerms ? !!(fieldPerms as any)[field] : false
    },
    [isAuthenticated, isSuperAdmin, currentUserRole],
  )

  const clearRoleForm = () => {
    setRoleForm({
      name: "",
      password: "",
      description: "",
      permissions: {
        tabs: {
          resonators: false,
          weapons: false,
          mechanics: false,
          echoSets: false,
          tierlist: false,
          settings: false,
        },
        fields: getDefaultFields(),
      },
    })
  }

  const startCreatingRole = () => {
    clearRoleForm()
    setEditingId("__new__")
  }

  const cancelRoleForm = () => {
    setEditingId(null)
    clearRoleForm()
  }

  const handleEditRole = (role: Role) => {
    setEditingId(role.id)
    setRoleForm(role)
  }

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const roleId = editingId === "__new__" ? crypto.randomUUID() : editingId!

      const roleData: any = {
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
        isSuperAdmin: !!roleForm.isSuperAdmin,
      }

      if (roleForm.password) roleData.password = roleForm.password
      else if (roleId && !roleForm.password && editingId === "__new__") {
        alert("Пароль обязателен для новой роли!")
        setIsSubmitting(false)
        return
      }

      await setDoc(doc(db, ROLES_COLLECTION, roleId), roleData)
      alert(editingId === "__new__" ? "Роль создана" : "Роль обновлена")

      cancelRoleForm()
      fetchRoles()
    } catch (error) {
      console.error("Error saving role:", error)
      alert("Ошибка сохранения роли")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 👇 Удаление роли
  const handleDeleteRole = async (id: string) => {
    if (!window.confirm("Вы уверены? Это действие нельзя отменить.")) return
    try {
      await deleteDoc(doc(db, ROLES_COLLECTION, id))
      alert("Роль удалена")
      fetchRoles()
      if (editingId === id) cancelRoleForm()
    } catch (error) {
      console.error("Error deleting role:", error)
      alert("Ошибка при удалении")
    }
  }

  // Автоматическое переключение на первую доступную вкладку
  useEffect(() => {
    if (!isAuthenticated || !roles.length) return

    // Проверяем, доступна ли текущая вкладка
    const isCurrentTabAvailable = hasTabPermission(activeTab)

    if (!isCurrentTabAvailable) {
      // Ищем первую доступную вкладку
      const allTabs: Tab[] = [
        "resonators",
        "weapons",
        "mechanics",
        "echoSets",
        "tierlist",
        "settings",
      ]
      const firstAvailableTab = allTabs.find(tab => hasTabPermission(tab))

      if (firstAvailableTab && firstAvailableTab !== activeTab) {
        setActiveTab(firstAvailableTab)
        resetForms()
        setSearchTerm("")
      }
    }
  }, [isAuthenticated, roles, userRole, activeTab, hasTabPermission])

  return {
    // Auth
    inputUsername,
    setInputUsername,
    inputPassword,
    setInputPassword,
    authError,
    isAdmin: isSuperAdmin,
    isSuperAdmin,
    isModerator,
    isTiermake,
    isAuthenticated,
    authLoading,
    handleLogin,
    handleLogout,
    // Tabs
    activeTab,
    handleTabChange,
    searchTerm,
    setSearchTerm,
    // Data
    resonators,
    weapons,
    mechanics,
    echoSets,
    tierLists,
    loading,
    isSubmitting,
    settingsError,
    isDbReady,
    globalTagRegistry,
    // Forms
    resonatorForm,
    setResonatorForm,
    weaponForm,
    setWeaponForm,
    mechanicForm,
    setMechanicForm,
    echoSetForm,
    setEchoSetForm,
    settingsForm,
    setSettingsForm,
    tierListForm,
    setTierListForm,
    activeCycleIndex,
    editingId,
    // Handlers
    handleResonatorChange,
    handleWeaponChange,
    handleMechanicChange,
    handleEchoSetChange,
    handleSettingsChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAddResonatorToBanner,
    handleRemoveResonatorFromBanner,
    refreshSettings,
    resetForms,
    // TierList specific
    moveTierListRow,
    addCycle,
    removeCycle,
    updateCycleName,
    switchCycle,
    updateCurrentCycleRows,
    registerTag,
    // Filtered data
    filteredList,
    // roles
    roles,
    roleForm,
    setRoleForm,
    editingRoleId,
    handleRoleSubmit,
    handleEditRole,
    handleDeleteRole,
    startCreatingRole,
    cancelRoleForm,
    hasTabPermission,
    hasFieldPermission,
  }
}
