import type React from "react"
import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore"
import "./Admin.scss"
import type { Resonator } from "../../types/resonator"
import type { Weapon } from "../../types/weapon"
import type { SiteSettings } from "../../types/siteSettings"
import type { Mechanic } from "../../types/mechanic"
import type { EchoSet } from "../../types/echoSet"
import { db } from "../../firebase/config"
import { ArrayEditor, TeamEditor } from "../../components"

const ADMIN_KEYS_COLLECTION = "admin_keys"
const RESONATORS_COLLECTION = "resonators"
const WEAPONS_COLLECTION = "weapons"
const MECHANICS_COLLECTION = "mechanics"
const ECHO_SETS_COLLECTION = "echo_sets"
const SETTINGS_DOC_ID = "site_settings"

// <-- 3. Добавляем 'echoSets' в типы табов
type Tab = "resonators" | "weapons" | "mechanics" | "echoSets" | "settings"

// --- Типы для форм ---
interface ResonatorForm extends Partial<Resonator> {}
interface WeaponForm extends Partial<Weapon> {}
interface MechanicForm extends Partial<Mechanic> {}
interface EchoSetForm extends Partial<EchoSet> {}

export const Admin = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [inputKey, setInputKey] = useState("")
  const [authError, setAuthError] = useState("")

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<Tab>("resonators")

  // --- Data States ---
  const [resonators, setResonators] = useState<Resonator[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [mechanics, setMechanics] = useState<Mechanic[]>([])
  const [echoSets, setEchoSets] = useState<EchoSet[]>([]) // <-- 5. Состояние для списока сетов

  // Настройки
  const [nextBannerDate, setNextBannerDate] = useState<string>("")
  const [futureResonatorIds, setFutureResonatorIds] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Forms State (разделены по сущностям) ---
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
  })
  const [weaponForm, setWeaponForm] = useState<WeaponForm>({
    name: "",
    engName: "",
    type: "Sword",
    rarity: 5,
    img: "",
  })
  const [mechanicForm, setMechanicForm] = useState<MechanicForm>({
    title: "",
    engName: "",
    img: "",
    paragraphs: [],
  })
  // <-- 6. Состояние формы для Эхо сета
  const [echoSetForm, setEchoSetForm] = useState<EchoSetForm>({
    name: "",
    engName: "",
    img: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  // Проверка сессии
  useEffect(() => {
    const checkSession = async () => {
      const storedAuth = localStorage.getItem("vexen_admin_auth")
      if (storedAuth === "true") {
        setIsAuthenticated(true)
        fetchData()
      }
      setAuthLoading(false)
    }
    checkSession()
  }, [])

  // Функция загрузки всех данных
  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Резонаторы
      const resSnap = await getDocs(
        query(collection(db, RESONATORS_COLLECTION), orderBy("name")),
      )
      setResonators(
        resSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Resonator[],
      )

      // 2. Оружие
      const weapSnap = await getDocs(
        query(collection(db, WEAPONS_COLLECTION), orderBy("name")),
      )
      setWeapons(
        weapSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Weapon[],
      )

      // 3. Механики
      const mechSnap = await getDocs(
        query(collection(db, MECHANICS_COLLECTION), orderBy("title")),
      )
      setMechanics(
        mechSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Mechanic[],
      )

      // 4. Эхо Сеты <-- 7. Загрузка Эхо сетов
      const echoSnap = await getDocs(
        query(collection(db, ECHO_SETS_COLLECTION), orderBy("name")),
      )
      setEchoSets(
        echoSnap.docs.map(d => ({ id: d.id, ...d.data() })) as EchoSet[],
      )

      // 5. Настройки
      const settingsRef = doc(db, "settings", SETTINGS_DOC_ID)
      const docSnap = await getDoc(settingsRef)
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings
        setNextBannerDate(data.nextBannerDate || "")
        setFutureResonatorIds(data.futureResonatorIds || [])
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error)
    } finally {
      setLoading(false)
    }
  }

  // Логика входа
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthLoading(true)
    try {
      const q = query(
        collection(db, ADMIN_KEYS_COLLECTION),
        where("key", "==", inputKey.trim()),
      )
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        setIsAuthenticated(true)
        localStorage.setItem("vexen_admin_auth", "true")
        setInputKey("")
        fetchData()
      } else {
        setAuthError("Неверный ключ доступа.")
      }
    } catch (error) {
      setAuthError("Ошибка сети.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("vexen_admin_auth")
    setResonators([])
    setWeapons([])
    setMechanics([])
    setEchoSets([]) // <-- 8. Очистка при выходе
  }

  // Обработчики ввода
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

  // <-- 9. Обработчик для Эхо сетов
  const handleEchoSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEchoSetForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // --- ЛОГИКА НАСТРОЕК ---
      if (activeTab === "settings") {
        const settingsRef = doc(db, "settings", SETTINGS_DOC_ID)
        await setDoc(
          settingsRef,
          {
            nextBannerDate: nextBannerDate,
            futureResonatorIds: futureResonatorIds,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )
        alert("Настройки сохранены!")
        setIsSubmitting(false)
        return
      }

      // --- ЛОГИКА ОСТАЛЬНЫХ КОЛЛЕКЦИЙ ---
      let collectionName = ""
      let dataToSave: any = {}
      let objTitle = ""
      let objLink = ""

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
        objLink = `/weapon/${weaponForm.engName}`
        dataToSave = {
          ...weaponForm,
          updatedAt: serverTimestamp(),
          ...(editingId ? {} : { createdAt: serverTimestamp() }),
        }
      } else if (activeTab === "mechanics") {
        collectionName = MECHANICS_COLLECTION
        objTitle = mechanicForm.engName || ""
        if (mechanicForm.engName) {
          objLink = `/mechanics/${mechanicForm.engName.toLowerCase().replace(/\s+/g, "-")}`
        }

        dataToSave = {
          ...mechanicForm,
          updatedAt: serverTimestamp(),
          ...(editingId ? {} : { createdAt: serverTimestamp() }),
        }
      } else if (activeTab === "echoSets") {
        collectionName = ECHO_SETS_COLLECTION
        objTitle = echoSetForm.name || ""
        objLink = echoSetForm.engName || ""
        if (echoSetForm.engName) {
          objLink = `/echoSets/${echoSetForm.engName.toLowerCase().replace(/\s+/g, "-")}`
        }
        dataToSave = {
          ...echoSetForm,
          updatedAt: serverTimestamp(),
          ...(editingId ? {} : { createdAt: serverTimestamp() }),
        }
      }

      if (editingId) {
        const docRef = doc(db, collectionName, editingId)
        await updateDoc(docRef, dataToSave)

        // Логируем только важные изменения
        if (activeTab === "resonators")
          await addUpdateLog("Изменено", `гайд на ${objTitle}`, objLink)
        if (activeTab === "mechanics")
          await addUpdateLog("Изменено", `механика: ${objTitle}`, objLink)

        alert("Объект обновлен!")
      } else {
        await addDoc(collection(db, collectionName), dataToSave)

        if (activeTab === "resonators")
          await addUpdateLog("Добавлено", `гайд на ${objTitle}`, objLink)
        if (activeTab === "mechanics")
          await addUpdateLog("Добавлено", `механика: ${objTitle}`, objLink)
        if (activeTab === "echoSets")
          await addUpdateLog("Добавлено", `эхо сет: ${objTitle}`, objLink)

        alert("Объект добавлен!")
      }

      resetForms()
      fetchData()
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка при сохранении")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Редактирование
  const handleEdit = (item: any) => {
    setEditingId(item.id || null)

    if (activeTab === "resonators") {
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
        teams: item.teams && item.teams.length > 0 ? item.teams : [],
        descr: item.descr && item.descr.length > 0 ? item.descr : [],
        result: item.result && item.result.length > 0 ? item.result : [],
      })
    } else if (activeTab === "weapons") {
      setWeaponForm({
        name: item.name || "",
        engName: item.engName || "",
        type: item.type || "Sword",
        rarity: item.rarity || 5,
        img: item.img || "",
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
      })
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Удаление
  const handleDelete = async (id: string) => {
    if (!window.confirm("Вы уверены?")) return

    let collectionName = ""
    if (activeTab === "resonators") collectionName = RESONATORS_COLLECTION
    else if (activeTab === "weapons") collectionName = WEAPONS_COLLECTION
    else if (activeTab === "mechanics") collectionName = MECHANICS_COLLECTION
    else if (activeTab === "echoSets") collectionName = ECHO_SETS_COLLECTION // <-- 12. Удаление Эхо сета

    try {
      await deleteDoc(doc(db, collectionName, id))
      fetchData()
    } catch (error) {
      console.error("Ошибка удаления:", error)
    }
  }

  // Управление списком ID в настройках
  const handleAddResonatorToBanner = (resonatorId: string) => {
    if (!futureResonatorIds.includes(resonatorId)) {
      setFutureResonatorIds([...futureResonatorIds, resonatorId])
    }
  }

  const handleRemoveResonatorFromBanner = (resonatorId: string) => {
    setFutureResonatorIds(futureResonatorIds.filter(id => id !== resonatorId))
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
    })

    setWeaponForm({
      name: "",
      engName: "",
      type: "Sword",
      rarity: 5,
      img: "",
    })

    setMechanicForm({
      title: "",
      engName: "",
      img: "",
      paragraphs: [],
    })

    setEchoSetForm({
      name: "",
      img: "",
      engName: "",
    })

    setEditingId(null)
  }

  // Обработчик смены вкладки
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    resetForms()
  }

  // --- Рендеринг экранов ---
  // if (loading) return <>loading</>
  if (authLoading) return <div className="admin-loading">Проверка...</div>
  if (!isAuthenticated)
    return (
      <AuthScreen
        inputKey={inputKey}
        setInputKey={setInputKey}
        handleLogin={handleLogin}
        authError={authError}
        authLoading={authLoading}
      />
    )

  return (
    <section className="admin">
      <div className="admin-header">
        <h1>Админ Панель Vexen Hub</h1>
        <button onClick={handleLogout} className="btn-logout">
          Выйти
        </button>
      </div>

      {/* Табы навигации */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "resonators" ? "active" : ""}`}
          onClick={() => handleTabChange("resonators")}
        >
          Персонажи
        </button>
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
        {/* <-- 14. Кнопка таба Эхо Сетов */}
        <button
          className={`tab-btn ${activeTab === "echoSets" ? "active" : ""}`}
          onClick={() => handleTabChange("echoSets")}
        >
          Эхо Сеты
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => handleTabChange("settings")}
        >
          Настройки Баннера
        </button>
      </div>

      <div className="admin-content">
        {/* Форма */}
        <div className="admin-form-container">
          <h2>
            {editingId ? "Редактировать" : "Добавить"}{" "}
            {activeTab === "settings"
              ? "настройки"
              : activeTab === "mechanics"
                ? "механику"
                : activeTab === "weapons"
                  ? "оружие"
                  : activeTab === "echoSets"
                    ? "эхо сет" // <-- 15. Заголовок формы
                    : "персонажа"}
          </h2>

          <form onSubmit={handleSubmit} className="admin-form">
            {/* ... (Формы Персонажей, Оружия, Механик без изменений) ... */}

            {/* --- ФОРМА ПЕРСОНАЖЕЙ --- */}
            {activeTab === "resonators" && (
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
                  label="URL фото карточки персонажа  для баннера"
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
              </>
            )}

            {/* --- ФОРМА ОРУЖИЯ --- */}
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
              </>
            )}

            {/* --- ФОРМА МЕХАНИКИ --- */}
            {activeTab === "mechanics" && (
              <>
                <InputGroup
                  label="Название механики"
                  name="title"
                  value={mechanicForm.title || ""}
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

            {/* <-- 16. НОВАЯ ФОРМА: ЭХО СЕТЫ */}
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
              </>
            )}

            {/* --- ФОРМА НАСТРОЕК --- */}
            {activeTab === "settings" && (
              <div className="settings-container">
                <div className="form-group">
                  <label>Дата следующего баннера</label>
                  <input
                    type="datetime-local"
                    value={
                      nextBannerDate
                        ? new Date(nextBannerDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={e =>
                      setNextBannerDate(new Date(e.target.value).toISOString())
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Персонажи на будущем баннере</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <select
                      onChange={e => {
                        if (e.target.value)
                          handleAddResonatorToBanner(e.target.value)
                        e.target.value = ""
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#2a2a2a",
                        color: "#fff",
                        border: "1px solid #444",
                      }}
                    >
                      <option value="">Выберите персонажа...</option>
                      {resonators.map(r => (
                        <option
                          key={r.id}
                          value={r.id}
                          disabled={futureResonatorIds.includes(r.id || "")}
                        >
                          {r.name} ({r.engName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {futureResonatorIds.map(id => {
                      const res = resonators.find(r => r.id === id)
                      return res ? (
                        <li
                          key={id}
                          style={{
                            background: "#333",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <img
                            src={res.resonatorImg}
                            alt={res.name}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                          <span>{res.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveResonatorFromBanner(id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ff4444",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </button>
                        </li>
                      ) : null
                    })}
                  </ul>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Сохранение..."
                  : editingId
                    ? "Обновить"
                    : "Добавить"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForms}
                  className="btn-cancel"
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Списки данных */}
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
                    ? "Эхо Сеты" // <-- 17. Заголовок списка
                    : "Настройки"}
          </h2>

          {activeTab === "settings" ? (
            <></>
          ) : (
            <ul className="admin-list">
              {(activeTab === "resonators"
                ? resonators
                : activeTab === "weapons"
                  ? weapons
                  : activeTab === "mechanics"
                    ? mechanics
                    : echoSets
              ) // <-- 18. Отображение списка Эхо сетов
                .map((item: any) => (
                  <li key={item.id} className="admin-list-item">
                    <img
                      src={item.resonatorImg || item.img}
                      alt={item.name || item.title}
                      className="admin-thumb"
                    />
                    <div className="admin-info">
                      <strong>{item.name || item.title}</strong>
                      {item.engName && `(${item.engName})`}
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
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
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
    <label>{label}</label>
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
      <h2>🔒 Доступ ограничен</h2>
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
      type: type,
      title: title,
      link: link,
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Ошибка при создании лога обновления:", error)
  }
}
