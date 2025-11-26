import { Route, Routes } from "react-router"
import { AppContextProvider } from "./context/contextProvider"
import "./App.scss"
import React from "react"
import { Footer, Header } from "./components"
import { Banners, Main, Resonator, Resonators } from "./pages"

const HeaderMemo = React.memo(Header)
const FooterMemo = React.memo(Footer)
const MainMemo = React.memo(Main)
const ResonatorsMemo = React.memo(Resonators)
const BannersMemo = React.memo(Banners)
const ResonatorMemo = React.memo(Resonator)

export default function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <HeaderMemo />
        <Routes>
          <Route path="/" element={<MainMemo />} />
          <Route path="/resonators" element={<ResonatorsMemo />} />
          <Route path="/resonator/:id" element={<ResonatorMemo />} />
          <Route path="/banners" element={<BannersMemo />} />
        </Routes>
        <FooterMemo />
      </div>
    </AppContextProvider>
  )
}
