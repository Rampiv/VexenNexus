import { Route, Routes, useLocation } from "react-router"
import { AppContextProvider } from "./context/contextProvider"
import "./App.scss"
import React from "react"
import { Burger, Footer, Header } from "./components"
import { Banners, Main, Resonators } from "./pages"

const HeaderMemo = React.memo(Header)
const FooterMemo = React.memo(Footer)
const MainMemo = React.memo(Main)
const ResonatorsMemo = React.memo(Resonators)
const BannersMemo = React.memo(Banners)

const InnerApp = () => {
  const location = useLocation()

  const appClass = `App ${location.pathname === "/resonators" ? "customBackground" : ""}`

  return (
    <div className={appClass}>
      <HeaderMemo />
      <Burger />
      <Routes>
        <Route path="/" element={<MainMemo />} />
        <Route path="/resonators" element={<ResonatorsMemo />} />
        <Route path="/banners" element={<BannersMemo />} />
      </Routes>
      <FooterMemo />
    </div>
  )
}

export default function App() {
  return (
    <AppContextProvider>
      <InnerApp />
    </AppContextProvider>
  )
}
